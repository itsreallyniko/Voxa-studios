export type ParsedVideo =
  | { provider: 'youtube'; id: string }
  | { provider: 'vimeo'; id: string; hash?: string }

export function parseVideoUrl(href: string): ParsedVideo | null {
  const youtube = href.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  )
  if (youtube) return { provider: 'youtube', id: youtube[1] }

  const vimeo = href.match(
    /vimeo\.com\/(?:video\/)?(\d+)(?:\/([\da-f]+)|\?(?:.*&)?h=([\da-f]+))?/
  )
  if (vimeo) return { provider: 'vimeo', id: vimeo[1], hash: vimeo[2] ?? vimeo[3] }

  return null
}

export function videoEmbedUrl(video: ParsedVideo): string {
  if (video.provider === 'youtube') {
    return `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`
  }
  const hash = video.hash ? `h=${video.hash}&` : ''
  return `https://player.vimeo.com/video/${video.id}?${hash}autoplay=1&dnt=1`
}

export async function videoThumbnail(
  video: ParsedVideo,
  href: string
): Promise<string | null> {
  if (video.provider === 'youtube') {
    return `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
  }
  try {
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?width=1280&url=${encodeURIComponent(href)}`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return null
    const data = (await res.json()) as { thumbnail_url?: string }
    return data.thumbnail_url ?? null
  } catch {
    return null
  }
}
