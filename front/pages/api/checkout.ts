import type { NextApiRequest, NextApiResponse } from 'next'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!
const TELEGRAM_DOC_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }
  const body = req.body
  if (!body) {
    return res.status(400).json({ error: 'Missing request body' })
  }

  const jsonPayload = JSON.stringify(body.items ?? body, null, 2)
  // Create a Blob for fetch()
  const blob = new Blob([jsonPayload], { type: 'application/json' })
  const caption = JSON.stringify({ ...body, items: ':' })
  const form = new FormData()
  form.append('chat_id', CHAT_ID)
  form.append('caption', caption) // optional
  form.append('document', blob, 'payload.json')

  // improved logging from above…
  try {
    const telegramRes = await fetch(TELEGRAM_DOC_URL, {
      method: 'POST',
      body: form,
    })

    const text = await telegramRes.text()
    if (!telegramRes.ok) {
      return res.status(502).json({
        error: 'Telegram API error',
        status: telegramRes.status,
        body: text,
      })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Fetch threw:', err)
    return res
      .status(500)
      .json({ error: 'Internal error', detail: String(err) })
  }
}
