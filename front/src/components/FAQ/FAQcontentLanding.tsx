import { ContentId } from '~/components/FAQ/FAQ'

export type DescriptionSection = {
  title: string
  content: ContentId | ContentId[]
}
export const FAQcontentLanding: DescriptionSection[] = [
  { title: 'faq.question.1', content: 'faq.answer.1.1' },
  { title: 'faq.question.2', content: ['faq.answer.2.1', 'faq.answer.2.2'] },
  { title: 'faq.question.3', content: ['faq.answer.3.1', 'faq.answer.3.2'] },
  { title: 'faq.question.4', content: ['faq.answer.4.1'] },
  { title: 'faq.question.5', content: ['faq.answer.5.1', 'faq.answer.5.2'] },
  { title: 'faq.question.6', content: ['faq.answer.6.1', 'faq.answer.6.2'] },
  { title: 'faq.question.7', content: ['faq.answer.7.1', 'faq.answer.7.2'] },
  { title: 'faq.question.8', content: ['faq.answer.8.1', 'faq.answer.8.2'] },
  { title: 'faq.question.9', content: ['faq.answer.9.1', 'faq.answer.9.2'] },
  { title: 'faq.question.10', content: ['faq.answer.10.1', 'faq.answer.10.2'] },
  { title: 'faq.question.11', content: ['faq.answer.11.1', 'faq.answer.11.2'] },
  { title: 'faq.question.12', content: ['faq.answer.12.1', 'faq.answer.12.2'] },
]
