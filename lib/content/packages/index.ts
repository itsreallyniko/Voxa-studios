import type { PackageType } from '@/lib/packages/pricing'
import type { PackagePage } from './types'
import { coursePackage } from './course'
import { vslPackage } from './vsl'
import { demoPackage } from './demo'

export type { PackagePage } from './types'
export { calPackageLink } from './cal'
export { SCOPE_NOTE, SEND_FILES_NOTE, AFTER_CALL_ANSWER } from './shared'

export const PACKAGE_PAGES: Record<PackageType, PackagePage> = {
  course: coursePackage,
  vsl: vslPackage,
  demo: demoPackage,
}

export function getPackagePage(slug: string): PackagePage | undefined {
  return Object.prototype.hasOwnProperty.call(PACKAGE_PAGES, slug)
    ? PACKAGE_PAGES[slug as PackageType]
    : undefined
}
