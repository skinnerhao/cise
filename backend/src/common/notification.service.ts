import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class NotificationService {
  async sendEmail(to: string, subject: string, text: string) {
    const host = process.env.SMTP_HOST
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.FROM_EMAIL || 'noreply@spped.local'
    if (!host || !port || !user || !pass) {
      return
    }
    const transporter = nodemailer.createTransport({ host, port, secure: false, auth: { user, pass } })
    await transporter.sendMail({ from, to, subject, text })
  }
}

