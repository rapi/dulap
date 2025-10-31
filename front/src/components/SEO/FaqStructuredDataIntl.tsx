import Head from 'next/head'
import { useIntl } from 'react-intl'

type ContentId = string
type FaqItem = { title: string; content: ContentId | ContentId[] }

/** Convert simple formatted strings to plain text for JSON-LD */
function toPlainText(input: string) {
  // strip very basic tags if any slipped in; keep it simple & safe
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/\s+\n/g, '\n')
    .trim()
}

/** Join multiple answer lines into one plain-text answer */
function joinAnswers(lines: string[]) {
  // Use blank lines between paragraphs (Google is fine with \n)
  return lines.join('\n\n')
}

export default function FaqStructuredDataIntl({ items }: { items: FaqItem[] }) {
  const intl = useIntl()

  const mainEntity = items.map(({ title, content }) => {
    const q = intl.formatMessage({ id: title })
    const contentIds = Array.isArray(content) ? content : [content]
    const a = joinAnswers(contentIds.map((id) => intl.formatMessage({ id })))

    return {
      '@type': 'Question',
      name: toPlainText(q),
      acceptedAnswer: { '@type': 'Answer', text: toPlainText(a) },
    }
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        // Important: stringify once; never inject objects directly
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  )
}
