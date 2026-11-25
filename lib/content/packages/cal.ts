export function calPackageLink(): string | null {
  const link = process.env.NEXT_PUBLIC_CAL_PACKAGE_LINK?.trim()
  return link ? link : null
}
