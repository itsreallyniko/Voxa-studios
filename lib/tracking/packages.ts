import { pushDataLayer } from '@/lib/data-layer'
import type { PackageType } from '@/lib/packages/pricing'

// Deliberately not generate_lead or tour_booked: those events feed the
// studio's Google Ads conversions, and package-page events would skew its
// bidding. Package pages get their own event names.

export function trackPackageBuilderStart(pageType: PackageType) {
  pushDataLayer({ event: 'package_builder_start', page_type: pageType })
}

export function trackPackageTourClick(pageType: PackageType, rangeLow: number) {
  pushDataLayer({
    event: 'package_tour_click',
    page_type: pageType,
    range_low: rangeLow,
  })
}

export function trackPackageTourBooked(pageType: PackageType, uid: string) {
  pushDataLayer({ event: 'package_tour_booked', page_type: pageType, uid })
}

export function trackPackageContactSubmit(
  pageType: PackageType,
  rangeLow: number
) {
  pushDataLayer({
    event: 'package_contact_submit',
    page_type: pageType,
    range_low: rangeLow,
  })
}

export function trackPackageCallBooked(pageType: PackageType) {
  pushDataLayer({ event: 'package_call_booked', page_type: pageType })
}

export function trackPackageDepositPaid(
  pageType: PackageType,
  opts: {
    value: number
    rangeLow: number
    rangeHigh: number
    paymentIntentId: string
  }
) {
  pushDataLayer({
    event: 'package_deposit_paid',
    page_type: pageType,
    value: opts.value,
    currency: 'USD',
    range_low: opts.rangeLow,
    range_high: opts.rangeHigh,
    transaction_id: opts.paymentIntentId,
  })
}

export function trackPackageDeepRead(pageType: PackageType) {
  pushDataLayer({ event: 'package_deep_read', page_type: pageType })
}
