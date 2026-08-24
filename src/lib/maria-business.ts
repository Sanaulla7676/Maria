import { workshopConfig } from './live-storefront'

export const eventTypes = [
  'Wedding',
  'Haldi',
  'Birthday',
  'Corporate Event',
  'Private Celebration',
  'Other',
] as const

export const mariaServices = [
  { title: 'Customized Perfumes', description: 'Personalized fragrances, bottles and labels for memorable celebrations.' },
  { title: 'Signature Scent Creation', description: 'Premium long-lasting fragrances crafted around the occasion and audience.' },
  { title: 'Perfumery Workshop', description: 'A hands-on Sunday experience where guests learn, blend and create a personal fragrance.' },
  { title: 'Corporate & Event Gifting', description: 'Bulk gifting, return-gift stalls and customized event solutions.' },
] as const

export const upcomingWorkshop = {
  date: nextSundayLabel(),
  pricePerPerson: workshopConfig.pricePerPerson,
  location: workshopConfig.location,
}

function nextSundayLabel(): string {
  const now = new Date()
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7
  const next = new Date(now)
  next.setDate(now.getDate() + daysUntilSunday)
  return next.toISOString().slice(0, 10)
}
