#!/usr/bin/env node

import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');
const outDir = path.join(frontendDir, 'out');
const publicDir = path.join(backendDir, 'public');

const PRESERVE_ENTRIES = new Set([
  'index.php',
  '.htaccess',
  'uploads',
  'images',
  'storage',
  'robots.txt',
  'sitemap.xml',
]);

const PUBLIC_HTACCESS = `<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    DirectoryIndex index.html index.php

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # /login → admin login (common bookmark / typed URL)
    RewriteRule ^login/?$ /admin/login/ [R=301,L]

    # Serve Next.js static-export folders (…/path → …/path/index.html)
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{DOCUMENT_ROOT}/$1/index.html -f
    RewriteRule ^(.+?)/?$ /$1/index.html [L]

    # Admin client routes: serve a pre-built shell when a specific ID was not exported
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^admin/sections/[0-9]+/edit/?$ /admin/sections/1/edit/index.html [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^admin/sections/[0-9]+/content/?$ /admin/sections/1/content/index.html [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^admin/packages/[0-9]+/edit/?$ /admin/packages/1/edit/index.html [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^admin/packages/[0-9]+/content/?$ /admin/packages/1/content/index.html [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^admin/blogs/[0-9]+/edit/?$ /admin/blogs/1/edit/index.html [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^admin/gallery/[0-9]+/edit/?$ /admin/gallery/1/edit/index.html [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^admin/inquiries/[0-9]+/?$ /admin/inquiries/1/index.html [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^admin/homepage/promises/[0-9]+/?$ /admin/homepage/promises/1/index.html [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^admin/destinations/[^/]+/edit/?$ /admin/destinations/popular/edit/index.html [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^admin/pages/[^/]+/content/?$ /admin/pages/about/content/index.html [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^admin/pages/[^/]+/seo/?$ /admin/pages/about/seo/index.html [L]

    # Package / blog detail fallbacks (CSR shells for new slugs)
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^packages/[^/]+/?$ /packages/fallback/index.html [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^blogs/[^/]+/?$ /blogs/fallback/index.html [L]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
`;

function parseEnvFile(content) {
  return Object.fromEntries(
    content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const [key, ...rest] = line.split('=');
        return [key.trim(), rest.join('=').trim().replace(/^['"]|['"]$/g, '')];
      })
  );
}

async function readEnvFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    return parseEnvFile(content);
  } catch {
    return {};
  }
}

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function countMatchingDirectories(basePath, pattern) {
  if (!(await pathExists(basePath))) {
    return 0;
  }

  const entries = await readdir(basePath, { withFileTypes: true });

  return entries.filter((entry) => entry.isDirectory() && pattern.test(entry.name)).length;
}

async function loadAdminBuildCredentials(productionEnv = {}) {
  const envPath = path.join(backendDir, '.env');
  const backendValues = (await pathExists(envPath)) ? await readEnvFile(envPath) : {};

  return {
    email:
      process.env.BUILD_ADMIN_EMAIL ??
      productionEnv.BUILD_ADMIN_EMAIL ??
      backendValues.ADMIN_EMAIL,
    password:
      process.env.BUILD_ADMIN_PASSWORD ??
      productionEnv.BUILD_ADMIN_PASSWORD ??
      backendValues.ADMIN_PASSWORD,
  };
}

async function resolveAdminToken(apiBaseUrl, productionEnv = {}) {
  if (process.env.BUILD_ADMIN_TOKEN) {
    return process.env.BUILD_ADMIN_TOKEN;
  }

  const { email, password } = await loadAdminBuildCredentials(productionEnv);

  if (!email || !password) {
    console.warn('');
    console.warn('WARNING: No BUILD_ADMIN_TOKEN or BUILD_ADMIN_EMAIL/BUILD_ADMIN_PASSWORD found.');
    console.warn('Admin edit pages will rely on public API fallbacks and .htaccess shell rewrites.');
    console.warn('Set BUILD_ADMIN_EMAIL and BUILD_ADMIN_PASSWORD in frontend/.env.production to match the server .env.');
    console.warn('');
    return null;
  }

  const response = await fetch(`${apiBaseUrl}/admin/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    console.warn('');
    console.warn(`WARNING: Admin login failed during build (${response.status}) for ${email}.`);
    console.warn('Verify BUILD_ADMIN_EMAIL / BUILD_ADMIN_PASSWORD match the server .env values.');
    console.warn('Admin edit pages will rely on public API fallbacks and .htaccess shell rewrites.');
    console.warn('');
    return null;
  }

  const body = await response.json();

  return body?.data?.token ?? null;
}

async function clearGeneratedAssets() {
  const entries = await readdir(publicDir);

  await Promise.all(
    entries
      .filter((entry) => !PRESERVE_ENTRIES.has(entry))
      .map((entry) => rm(path.join(publicDir, entry), { recursive: true, force: true }))
  );
}

async function copyExportIntoPublic() {
  const entries = await readdir(outDir);

  for (const entry of entries) {
    if (PRESERVE_ENTRIES.has(entry)) {
      continue;
    }

    await cp(path.join(outDir, entry), path.join(publicDir, entry), { recursive: true, force: true });
  }
}

function runNextBuild(env) {
  const result = spawnSync('npm run build', {
    cwd: frontendDir,
    stdio: 'inherit',
    env,
    shell: true,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function logAdminExportSummary() {
  const adminRoot = path.join(publicDir, 'admin');
  const sectionIds = await countMatchingDirectories(path.join(adminRoot, 'sections'), /^\d+$/);
  const packageIds = await countMatchingDirectories(path.join(adminRoot, 'packages'), /^\d+$/);
  const blogIds = await countMatchingDirectories(path.join(adminRoot, 'blogs'), /^\d+$/);
  const galleryIds = await countMatchingDirectories(path.join(adminRoot, 'gallery'), /^\d+$/);
  const inquiryIds = await countMatchingDirectories(path.join(adminRoot, 'inquiries'), /^\d+$/);

  console.log('Pre-rendered admin routes:');
  console.log(`  sections:  ${sectionIds} id folders`);
  console.log(`  packages:  ${packageIds} id folders`);
  console.log(`  blogs:     ${blogIds} id folders`);
  console.log(`  gallery:   ${galleryIds} id folders`);
  console.log(`  inquiries: ${inquiryIds} id folders`);
}

async function main() {
  const productionEnv = await readEnvFile(path.join(frontendDir, '.env.production'));
  const buildApiUrl = (
    productionEnv.BUILD_API_URL ??
    process.env.BUILD_API_URL ??
    'http://127.0.0.1:8000/api'
  ).replace(/\/$/, '');

  const publicApiUrl = (
    productionEnv.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:8000/api'
  ).replace(/\/$/, '');

  const publicSiteUrl = (
    productionEnv.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'http://localhost:8000'
  ).replace(/\/$/, '');

  console.log(`Build API (data fetch): ${buildApiUrl}`);
  console.log(`Public API (client bundle): ${publicApiUrl}`);
  console.log(`Public site URL: ${publicSiteUrl}`);

  const adminToken = await resolveAdminToken(buildApiUrl, productionEnv);

  if (adminToken) {
    console.log('Admin build auth: OK');
  }

  const buildEnv = {
    ...process.env,
    NODE_ENV: 'production',
    BUILD_API_URL: buildApiUrl,
    NEXT_PUBLIC_API_URL: publicApiUrl,
    NEXT_PUBLIC_SITE_URL: publicSiteUrl,
    BUILD_ADMIN_TOKEN: adminToken ?? '',
  };

  console.log('Building static frontend export...');
  runNextBuild(buildEnv);

  if (!(await pathExists(outDir))) {
    throw new Error(`Expected export output at ${outDir}`);
  }

  await mkdir(publicDir, { recursive: true });
  console.log('Clearing previously generated public assets...');
  await clearGeneratedAssets();
  console.log('Copying export into backend/public...');
  await copyExportIntoPublic();

  console.log('Writing public/.htaccess for static export + login aliases...');
  await writeFile(path.join(publicDir, '.htaccess'), PUBLIC_HTACCESS, 'utf8');

  const loginHtml = path.join(publicDir, 'admin', 'login', 'index.html');
  if (!(await pathExists(loginHtml))) {
    throw new Error('Missing admin/login/index.html in export — login will 404 on live.');
  }

  await logAdminExportSummary();

  console.log('');
  console.log('Done. Next steps:');
  console.log('1. Upload backend/public/ to shared hosting (include admin/, login/, .htaccess)');
  console.log('2. Verify https://your-domain/admin/login/ and https://your-domain/login');
  console.log('3. Ensure server .env has APP_URL, FRONTEND_URL, DB credentials, and ADMIN_PASSWORD');
  console.log('4. After admin/content changes, re-run npm run build:live and upload changed public files');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
