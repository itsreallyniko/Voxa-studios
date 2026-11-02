import { pushDataLayer } from '@/lib/data-layer'

export function trackOnsiteQuoteSubmit(opts: {
  pageSlug: string
  projectType: string
}) {
  // Deliberately not generate_lead: that event feeds the studio's Google Ads
  // conversions, and On-Site quotes would skew its bidding.
  pushDataLayer({
    event: 'onsite_quote_submit',
    page_slug: opts.pageSlug,
    project_type: opts.projectType,
  })
}

export function trackOnsiteCallBooked(opts: {
  pageSlug: string
  projectType: string
}) {
  pushDataLayer({
    event: 'onsite_call_booked',
    page_slug: opts.pageSlug,
    project_type: opts.projectType,
  })
}
