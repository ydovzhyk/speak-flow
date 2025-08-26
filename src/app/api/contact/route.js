import axios from 'axios'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Create and configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSKEY,
  },
})

// Helper function to send a message via Telegram
async function sendTelegramMessage(token, chat_id, message) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`
  try {
    const res = await axios.post(url, {
      text: message,
      chat_id,
    })
    return res.data.ok
  } catch (error) {
    console.error(
      'Error sending Telegram message:',
      error.response?.data || error.message
    )
    return false
  }
}

// HTML email template
const generateEmailTemplate = (name, email, userMessage, origin) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); text-align: center;">
      <img src="${origin}/images/logo.png" alt="Logo" style="max-width: 150px; margin-bottom: 20px;" />
      <h2 style="color: #017683;">New Message Received</h2>
      <p style="text-align: left;"><strong>Name:</strong> ${name}</p>
      <p style="text-align: left;"><strong>Email:</strong> ${email}</p>
      <p style="text-align: left;"><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #017683; padding-left: 10px; margin-left: 0; text-align: left;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888; text-align: left;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

// Helper function to send an email via Nodemailer
async function sendEmail(payload, message) {
  const { name, email, message: userMessage, origin} = payload

  const mailOptions = {
    from: 'Portfolio',
    to: process.env.EMAIL_ADDRESS,
    subject: `New Message From: ${name}`,
    text: message,
    html: generateEmailTemplate(name, email, userMessage, origin),
    replyTo: email,
  }

  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error while sending email:', error.message)
    return false
  }
}

export async function POST(request) {
  try {
    const payload = await request.json()
    const { name, email, message: userMessage } = payload
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chat_id = process.env.TELEGRAM_CHAT_ID

    // Validate environment variables
    if (!token || !chat_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Telegram token or chat ID is missing.',
        },
        { status: 400 }
      )
    }

    const message = `New message from: ${name}\n\nEmail: ${email}\n\nMessage:\n\n${userMessage}\n\n`

    // Send Telegram message
    const telegramSuccess = await sendTelegramMessage(token, chat_id, message)

    // Send email
    const emailSuccess = await sendEmail(payload, message)

    if (telegramSuccess && emailSuccess) {
      return NextResponse.json(
        {
          success: true,
          message: 'Message and email sent successfully!',
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send message or email.',
      },
      { status: 500 }
    )
  } catch (error) {
    console.error('API Error:', error.message)
    return NextResponse.json(
      {
        success: false,
        message: 'Server error occurred.',
      },
      { status: 500 }
    )
  }
};
