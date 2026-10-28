import { pushDataLayer } from '@/lib/data-layer'

export function trackOnsiteQuoteSubmit(opts: {
  pageSlug: string
  projectType: string
}) {
  // Also fire generate_lead so existing Google Ads conversion wiring continues
  // to work for the on-site funnel. See handoff notes.
  pushDataLayer({
    event: 'generate_lead',
    lead_source: 'onsite_quote',
    page_slug: opts.pageSlug,
    project_type: opts.projectType,
  })
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
