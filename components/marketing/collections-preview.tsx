import { Tag } from '@/components/ui/tag'
import { collections } from '@/lib/content/collections'

function shortLabel(setName: string, collectionName: string) {
  const collectionPrefix = collectionName.split(' ')[0] + ' '
  return setName.replace(collectionPrefix, '').replace(' Set', '')
}

export function CollectionsPreview() {
  return (
    <section id="sets" className="py-section-gap bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-label-caps text-heritage-gold mb-4 block">COLLECTIONS</span>
            <h2 className="text-headline-xl text-white">
              Choose the Environment <br />
              That Fits Your Brand
            </h2>
          </div>
          <a href="#book" className="text-label-caps text-heritage-gold flex items-center gap-2 group">
            VIEW ALL SETS{' '}
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
              arrow_forward
            </span>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {collections.map((c) => (
            <a
              key={c.id}
              href="#book"
              className="group relative overflow-hidden bg-surface-container-low block"
            >
              <div className="aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={c.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  src={c.heroImage}
                />
              </div>
              <div className="p-12 liquid-glass border-t-0">
                <h3 className="text-headline-md text-white mb-6">{c.name}</h3>
                <div className="flex flex-wrap gap-3 mb-10">
                  {c.sets.map((s) => (
                    <Tag key={s.id}>{shortLabel(s.name, c.name)}</Tag>
                  ))}
                </div>
                <div className="w-full py-5 border border-white/10 text-label-caps text-white text-center group-hover:bg-white group-hover:text-obsidian transition-all">
                  Explore Sets
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
