import type { NextApiRequest, NextApiResponse } from 'next'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }
  const { text } = req.body
  if (!text) {
    return res.status(400).json({ error: 'Missing `text` in body' })
  }

  try {
    const telegramRes = await fetch(TELEGRAM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    })
    const resultText = await telegramRes.text()
    if (!telegramRes.ok) {
      console.error('Telegram API error:', resultText)
      return res
        .status(502)
        .json({ error: 'Telegram API error', detail: resultText })
    }
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Fetch threw:', err)
    return res
      .status(500)
      .json({ error: 'Internal error', detail: String(err) })
  }
}
