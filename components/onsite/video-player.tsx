'use client'

import { useState } from 'react'
import { videoEmbedUrl, type ParsedVideo } from '@/lib/content/onsite/video'

type Props = {
  video: ParsedVideo
  title: string
  thumbnail: string | null
}

// Shows only the thumbnail until clicked, so the player's scripts don't slow the page.
export function VideoPlayer({ video, title, thumbnail }: Props) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        src={videoEmbedUrl(video)}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play: ${title}`}
      className="group/play absolute inset-0 h-full w-full"
    >
      {thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt=""
          className="h-full w-full object-cover opacity-80 group-hover/play:opacity-100 transition-opacity"
          loading="lazy"
        />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-heritage-gold/60 bg-obsidian/70 text-heritage-gold group-hover/play:bg-heritage-gold group-hover/play:text-obsidian transition-colors">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  )
}
