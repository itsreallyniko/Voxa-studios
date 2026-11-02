// Emails on-site quote leads through Resend's HTTP API.
const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const DEFAULT_TO = 'voxastudiosfl@gmail.com'
// Resend's shared sender works without a verified domain, but only delivers to
// the address on the Resend account. Set ONSITE_LEAD_FROM after verifying one.
const DEFAULT_FROM = 'Voxa On-Site Leads <onboarding@resend.dev>'

export type OnsiteLead = {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  budgetRange: string
  shootDate: string
  locationCity: string
  referralSource: string
  message: string
  pageSlug: string
  receivedAt: string
}

export function leadEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim())
}

export async function sendOnsiteLeadEmail(lead: OnsiteLead): Promise<void> {
  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.ONSITE_LEAD_FROM?.trim() || DEFAULT_FROM,
      to: process.env.ONSITE_LEAD_EMAIL?.trim() || DEFAULT_TO,
      reply_to: lead.email,
      subject: `On-Site lead: ${lead.name} (${lead.projectType})`,
      text: [
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Phone: ${lead.phone}`,
        `Company: ${lead.company || '-'}`,
        `Project: ${lead.projectType}`,
        `Budget: ${lead.budgetRange}`,
        `Shoot date: ${lead.shootDate || '-'}`,
        `Location: ${lead.locationCity || '-'}`,
        `Heard about us: ${lead.referralSource || '-'}`,
        `Page: ${lead.pageSlug}`,
        `Received: ${lead.receivedAt}`,
        '',
        lead.message || '(no message)',
      ].join('\n'),
    }),
  })
  if (!res.ok) throw new Error(`Resend responded ${res.status}`)
}
