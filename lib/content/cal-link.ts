export function toCalLinkSlug(link: string | null): string | null {
  if (!link) return null
  try {
    const u = new URL(link)
    // Cal expects "username/event-slug"
    return u.pathname.replace(/^\/+/, '').replace(/\/+$/, '') || null
  } catch {
    // Allow passing just the slug ("voxastudios/15min")
    return link.replace(/^\/+/, '').replace(/\/+$/, '')
  }
}
