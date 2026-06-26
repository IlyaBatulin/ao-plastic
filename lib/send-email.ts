import nodemailer from "nodemailer"

export type SendEmailOptions = {
  to: string | string[]
  subject: string
  text: string
  html?: string
}

function getNotifyRecipients(): string[] {
  const raw = process.env.ORDER_NOTIFY_EMAIL || process.env.CONTACT_NOTIFY_EMAIL
  if (!raw?.trim()) return []
  return raw
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)
}

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      getNotifyRecipients().length > 0
  )
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    console.warn("[Email] SMTP не настроен — письмо не отправлено")
    return false
  }

  const port = Number(process.env.SMTP_PORT || 465)
  const secure = process.env.SMTP_SECURE !== "false"
  const from = process.env.SMTP_FROM?.trim() || user

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })

  const recipients = Array.isArray(options.to) ? options.to.join(", ") : options.to

  await transporter.sendMail({
    from,
    to: recipients,
    subject: options.subject,
    text: options.text,
    html: options.html,
  })

  return true
}

export async function sendNotifyEmail(options: Omit<SendEmailOptions, "to">): Promise<boolean> {
  const recipients = getNotifyRecipients()
  if (!recipients.length) {
    console.warn("[Email] ORDER_NOTIFY_EMAIL не задан — письмо не отправлено")
    return false
  }

  try {
    await sendEmail({ ...options, to: recipients })
    console.log("[Email] Письмо отправлено:", options.subject)
    return true
  } catch (error) {
    console.error("[Email] Ошибка отправки:", error)
    return false
  }
}
