export interface Review {
  id: string
  rating: number
  author: string // intl id
  color?: string // intl id
  dateLabel: string // intl id
  title: string // intl id
  body: string // intl id for TRANSLATED body (current locale)
  originalBody?: string // intl id for ORIGINAL language body
  originalLanguageLabel?: string //
  imageUrl?: string
  imageAlt?: string // intl id
}
