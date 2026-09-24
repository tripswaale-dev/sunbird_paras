export function revalidatePublicSite(): void {
  // Vercel Node serves dynamic package/blog/admin routes without a full static rebuild.
  // Optional: add on-demand revalidation (revalidatePath / revalidateTag) later if needed.
}
