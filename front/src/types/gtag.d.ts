// types/gtag.d.ts
export {}

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: Gtag.Gtag
  }
}

declare namespace Gtag {
  interface ControlParams {
    send_page_view?: boolean
    page_title?: string
    page_location?: string
    page_path?: string
    anonymize_ip?: boolean
    allow_google_signals?: boolean
    [key: string]: unknown
  }

  interface EventParams {
    event_category?: string
    event_label?: string
    value?: number
    [key: string]: unknown
  }

  // generic key-value params
  type CustomParams = Record<string, unknown>
  // If you *really* want a ConfigParams name, do:
  // type ConfigParams = ControlParams

  interface Gtag {
    (command: 'js', date: Date): void
    (command: 'config', targetId: string, config?: ControlParams): void
    (command: 'set', params: CustomParams): void
    (
      command: 'event',
      eventName: string,
      eventParams?: EventParams | CustomParams
    ): void
  }
}
