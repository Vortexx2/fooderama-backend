import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import config from 'config'

import { User } from '@models/users.model'
// Imports above

if (!process.env.GMAIL_USERNAME || !process.env.GMAIL_PASS) {
  throw new Error(
    'Add GMAIL_USERNAME and GMAIL_PASSWORD as environment variables'
  )
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASS,
  },
})

export function sendVerificationMail(user: User) {
  const token = jwt.sign(
    {
      userId: user.userId,
    },
    config.get('EMAIL_SECRET'),
    {
      expiresIn: config.get('emailExpiryTime'),
    }
  )

  const urlForVerification = `http://localhost:4000/api/v1/users/confirmation/${token}`

  transporter.sendMail({
    from: 'Fooderama fooderama@gmail.com',
    to: user.email,
    subject: 'Verification of Fooderama Account',
    html: `
    <h1>Verify your email</h1>
    <p>
      To verify your account, click on the following link:\n
    </p>
    <br/>
    <a href="${urlForVerification}">${urlForVerification}</a>
    `,
  })
}
