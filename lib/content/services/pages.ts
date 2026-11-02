import { courseWebinar } from './course-webinar'
import { podcastStudio } from './podcast-studio'
import type { ServicePage } from './types'
import { vslMetaAds } from './vsl-meta-ads'
import { youtubeStudio } from './youtube-studio'

export const SERVICE_PAGES: ServicePage[] = [vslMetaAds, podcastStudio, youtubeStudio, courseWebinar]
