export type EventType = 'Wedding' | 'Haldi' | 'Birthday' | 'Corporate' | 'Other'

export type WorkshopSession = {
  id: string
  date: string
  day: 'Sunday'
  time: string
  pricePerPerson: number
  capacity: number | null
  booked: number
  location: string
}

export const mariaServices = [
  { title: 'Return Gift Stalls', description: 'A dedicated Maria perfume gifting experience for weddings, Haldi, birthdays and corporate events.' },
  { title: 'Customized Perfumes', description: 'Bottle, fragrance, label, logo, packaging, ribbon, names, event text and themes.' },
  { title: 'Signature Scent Creation', description: 'Create a distinctive fragrance experience for personal or event gifting.' },
  { title: 'Corporate & Event Gifting', description: 'Bulk gifting solutions with quotation-led planning and event support.' },
]

export const workshopCurriculum = [
  'Perfume basics',
  'Understanding fragrance notes',
  'Blending fragrances',
  'Create your personal fragrance',
  'Take your perfume home',
]

export const nextSunday = (): string => {
  const today = new Date()
  const result = new Date(today)
  const days = (7 - result.getDay()) % 7 || 7
  result.setDate(result.getDate() + days)
  return result.toISOString().slice(0, 10)
}

export const upcomingWorkshop: WorkshopSession = {
  id: 'sunday-perfumery-workshop',
  date: nextSunday(),
  day: 'Sunday',
  time: '11:00 AM',
  pricePerPerson: 1200,
  capacity: null,
  booked: 0,
  location: 'Maria Perfumes, Bengaluru',
}

export const eventTypes: EventType[] = ['Wedding', 'Haldi', 'Birthday', 'Corporate', 'Other']
