import type { Addon } from '@/lib/pricing'

export const addons: Addon[] = [
  {
    id: 'clip-repurposing',
    name: 'Clip Repurposing',
    description:
      'We cut your session into 8–12 short-form clips, formatted vertical and horizontal, ready to post across platforms.',
    price: 50,
    image:
      'https://lh3.googleusercontent.com/aida/ADBb0ujkabd-Yg9HDPoXBdp7TCrj8S4AhRxU8pPjoC8xTNSwxfd7Fhpe_Ou_YT8G5HBPPTjwu7IIuuBBXHMj2ozpsqu42ivCQegGcn0p9CC7-JpnxzYE3ru4FFAGYuCy6JT8i4XE1wxMCRLi2hCrQydr7TpIAGOXh7xcrxh83TKruaZTjBMtzd8PYg9GXS12MbXcjmub6R9eF65to1FipzfGzj1E4wIDA3lZ9FI_IykSBzeiiLUrhIoWGNY8mnmk',
    appliesTo: ['executive-podcast', 'horizon-podcast'],
  },
]

export function addonsForSet(setId: string | null): Addon[] {
  if (!setId) return addons
  return addons.filter((a) => !a.appliesTo || a.appliesTo.includes(setId))
}
