export const workshopConfig = {
  title: 'Perfume Workshop',
  pricePerPerson: 1200,
  location: "Maria Perfumes, Bengaluru",
  cadence: 'Every Sunday',
  capacity: null as number | null,
}

export const workshopCurriculum = [
  'Perfume basics',
  'Fragrance notes',
  'Blending',
  'Create personal fragrance',
  'Take perfume home',
] as const
