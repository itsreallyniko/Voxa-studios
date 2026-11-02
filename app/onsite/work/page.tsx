import type { Metadata } from 'next'
import Link from 'next/link'
import { OnsiteFinalCta } from '@/components/onsite/final-cta'
import { QuoteForm } from '@/components/onsite/quote-form'
import { StickyQuoteCta } from '@/components/onsite/sticky-quote-cta'
import { VideoPlayer } from '@/components/onsite/video-player'
import { Reveal } from '@/components/ui/reveal'
import { Button } from '@/components/ui/button'
import { onsiteHub } from '@/lib/content/onsite/hub'
import { parseVideoUrl } from '@/lib/content/onsite/video'
import { onsiteWork, type WorkProject, type WorkVideo } from '@/lib/content/onsite/work'

export const metadata: Metadata = {
  title: onsiteWork.seo.title,
  description: onsiteWork.seo.description,
  alternates: { canonical: '/onsite/work' },
  openGraph: {
    title: onsiteWork.seo.title,
    description: onsiteWork.seo.description,
    url: '/onsite/work',
    images: [{ url: onsiteWork.seo.ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: onsiteWork.seo.title,
    description: onsiteWork.seo.description,
    images: [onsiteWork.seo.ogImage],
  },
}

function WorkFilm({ film, large = false }: { film: WorkVideo; large?: boolean }) {
  const video = parseVideoUrl(film.href)
  const label = `${film.client}: ${film.title}`
  return (
    <figure>
      <div
        className={`relative bg-black overflow-hidden border border-white/10 ${
          film.portrait ? 'aspect-[9/16] max-w-[280px] md:max-w-none' : 'aspect-video'
        }`}
      >
        {video ? (
          <VideoPlayer video={video} title={label} thumbnail={film.thumbnail} />
        ) : (
          <video
            src={film.href}
            poster={film.thumbnail}
            aria-label={label}
            className="absolute inset-0 h-full w-full object-cover"
            controls
            muted
            loop
            playsInline
            preload="none"
          />
        )}
      </div>
      <figcaption
        className={`mt-4 flex flex-col gap-1 ${
          film.portrait ? '' : 'md:flex-row md:items-baseline md:justify-between md:gap-6'
        }`}
      >
        <p className={`text-white ${large ? 'text-body-lg' : 'text-body-md'}`}>
          {film.client}
          <span className="text-ivory/50"> · {film.title}</span>
        </p>
        <p className="text-label-caps text-heritage-gold shrink-0">{film.type.toUpperCase()}</p>
      </figcaption>
    </figure>
  )
}

function ProjectRow({ project, index }: { project: WorkProject; index: number }) {
  const flipped = index % 2 === 1
  return (
    <Reveal className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start py-10 md:py-14 border-t border-white/10">
      <div className={`md:col-span-8 aspect-video bg-black overflow-hidden ${flipped ? 'md:order-2' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image.src}
          alt={project.image.alt}
          className="h-full w-full object-cover"
          style={project.image.focus ? { objectPosition: project.image.focus } : undefined}
          loading="lazy"
        />
      </div>
      <div className={`md:col-span-4 flex flex-col gap-4 md:gap-6 ${flipped ? 'md:order-1' : ''}`}>
        <div>
          <p className="text-metadata tracking-[0.2em] text-heritage-gold mb-3">
            {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="text-headline-md text-white leading-tight">{project.type}</h3>
          <p className="text-label-caps text-ivory/50 mt-3">{project.client.toUpperCase()}</p>
          <p className="text-sm text-ivory/70 leading-relaxed mt-4">{project.body}</p>
        </div>
        {/* Phones get the lead frame only, which keeps the page short. */}
        <div className="hidden md:block aspect-video bg-black overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.detail.src}
            alt={project.detail.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </Reveal>
  )
}

export default function OnsiteWorkPage() {
  const { header, featured, videos, range, projects, cta } = onsiteWork
  return (
    <>
      <section className="pt-32 md:pt-40 pb-10 md:pb-14 bg-obsidian">
        <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
          <div className="fade-up flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12">
            <div className="max-w-2xl">
              <span className="text-label-caps text-heritage-gold mb-4 block">{header.eyebrow}</span>
              <h1 className="text-headline-xl md:text-display-lg leading-[1.05] tracking-tight text-white">
                {header.headline}
              </h1>
              <p className="text-body-md md:text-body-lg text-ivory/70 mt-5">{header.body}</p>
            </div>
            <a href="#quote" className="hidden md:flex shrink-0">
              <Button variant="gold" size="md">
                Get a quote
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-obsidian pb-section-gap">
        <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
          <Reveal>
            <WorkFilm film={featured} large />
          </Reveal>

          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-y border-white/10 py-5">
            {onsiteHub.proof.map((brand) => (
              <li key={brand.name} className="text-metadata uppercase tracking-[0.2em] text-ivory/60">
                {brand.name}
              </li>
            ))}
          </ul>

          {/* Column widths follow the 16:9 and 9:16 ratios so both frames share a height. */}
          <p className="mt-5 text-sm text-ivory/60">
            {onsiteHub.studioNote.text}{' '}
            <Link
              href={onsiteHub.studioNote.href}
              className="whitespace-nowrap underline underline-offset-4 decoration-heritage-gold/50 hover:text-heritage-gold transition-colors"
            >
              {onsiteHub.studioNote.cta}
            </Link>
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-[1.778fr_0.5625fr] gap-8">
            {videos.map((film, i) => (
              <Reveal key={film.href} delay={i * 60}>
                <WorkFilm film={film} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest py-section-gap">
        <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
          <Reveal className="mb-10 md:mb-14 max-w-3xl">
            <span className="text-label-caps text-heritage-gold mb-4 block">{range.eyebrow}</span>
            <h2 className="text-headline-xl text-white">{range.heading}</h2>
          </Reveal>
          {projects.map((project, i) => (
            <ProjectRow key={project.type} project={project} index={i} />
          ))}
        </div>
      </section>

      <OnsiteFinalCta heading={cta.heading} body={cta.body} />
      <QuoteForm pageSlug="work" preselect="not-sure" />
      <StickyQuoteCta />
    </>
  )
}
