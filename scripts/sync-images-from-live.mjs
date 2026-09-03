#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'backend', 'public');

const DEFAULT_LIVE_ORIGIN = 'https://darkturquoise-albatross-364819.hostingersite.com';

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
    const { readFile } = await import('node:fs/promises');
    return parseEnvFile(await readFile(filePath, 'utf8'));
  } catch {
    return {};
  }
}

function collectPaths(value, paths) {
  if (typeof value === 'string' && value.trim()) {
    const trimmed = value.trim();

    if (
      trimmed.startsWith('/images/') ||
      trimmed.startsWith('images/') ||
      trimmed.startsWith('/uploads/') ||
      trimmed.startsWith('uploads/')
    ) {
      paths.add(trimmed.startsWith('/') ? trimmed : `/${trimmed}`);
    }

    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectPaths(item, paths));
    return;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectPaths(item, paths));
  }
}

async function apiGet(origin, endpoint) {
  const response = await fetch(`${origin}/api${endpoint}`);

  if (!response.ok) {
    throw new Error(`Failed ${endpoint} (${response.status})`);
  }

  const body = await response.json();

  if (!body.success) {
    throw new Error(`Unsuccessful API response for ${endpoint}`);
  }

  return body.data;
}

async function fetchAllPackages(origin) {
  const packages = [];
  let page = 1;
  let lastPage = 1;

  do {
    const body = await fetch(`${origin}/api/packages?per_page=50&page=${page}`).then((response) =>
      response.json()
    );

    if (!body.success || !body.meta) {
      break;
    }

    packages.push(...body.data);
    lastPage = body.meta.last_page;
    page += 1;
  } while (page <= lastPage);

  return packages;
}

async function collectAssetPaths(origin) {
  const paths = new Set();

  const [homepage, blogs, gallery, sections, packages] = await Promise.all([
    apiGet(origin, '/homepage').catch(() => null),
    apiGet(origin, '/blogs').catch(() => []),
    apiGet(origin, '/gallery').catch(() => ({ items: [] })),
    apiGet(origin, '/sections').catch(() => []),
    fetchAllPackages(origin).catch(() => []),
  ]);

  collectPaths(homepage, paths);
  collectPaths(blogs, paths);
  collectPaths(gallery, paths);
  collectPaths(sections, paths);

  for (const section of sections ?? []) {
  if (section?.slug) {
      const sectionPackages = await apiGet(origin, `/sections/${section.slug}/packages`).catch(
        () => null
      );
      collectPaths(sectionPackages, paths);
    }
  }

  for (const pkg of packages) {
    if (!pkg?.slug) {
      continue;
    }

    const detail = await apiGet(origin, `/packages/${pkg.slug}`).catch(() => null);
    collectPaths(detail, paths);
  }

  const pageKeys = ['about', 'contact'];

  for (const pageKey of pageKeys) {
    const pageContent = await apiGet(origin, `/page-content/${pageKey}`).catch(() => null);
    collectPaths(pageContent, paths);
  }

  return [...paths].sort();
}

async function downloadAsset(origin, assetPath) {
  const url = `${origin}${assetPath}`;
  const destination = path.join(publicDir, assetPath.replace(/^\//, '').split('/').join(path.sep));

  await mkdir(path.dirname(destination), { recursive: true });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status} for ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, buffer);

  return destination;
}

async function main() {
  const productionEnv = await readEnvFile(path.join(rootDir, 'frontend', '.env.production'));
  const configuredApiUrl =
    productionEnv.NEXT_PUBLIC_API_URL ??
    process.env.SYNC_API_URL ??
    `${DEFAULT_LIVE_ORIGIN}/api`;
  const origin = configuredApiUrl.replace(/\/api\/?$/, '');

  console.log(`Collecting image/upload paths from ${origin}/api ...`);
  const assetPaths = await collectAssetPaths(origin);

  console.log(`Found ${assetPaths.length} asset paths.`);

  let downloaded = 0;
  let failed = 0;

  for (const assetPath of assetPaths) {
    try {
      const savedTo = await downloadAsset(origin, assetPath);
      downloaded += 1;
      console.log(`OK  ${assetPath} -> ${path.relative(rootDir, savedTo)}`);
    } catch (error) {
      failed += 1;
      console.warn(`FAIL ${assetPath}: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log('');
  console.log(`Done. Downloaded ${downloaded}, failed ${failed}.`);
  console.log('Assets saved under backend/public/images and backend/public/uploads.');
  console.log('Start Laragon, then run frontend with frontend/.env.local (localhost API).');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
