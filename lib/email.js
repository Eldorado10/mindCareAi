const nodemailer = require('nodemailer')

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Fallback to console logging if email is not configured
const isEmailConfigured = process.env.SMTP_USER && process.env.SMTP_PASSWORD

/**
 * Send email with fallback to console logging
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!isEmailConfigured) {
    console.log('\n=== EMAIL NOT SENT (SMTP not configured) ===')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('HTML:', html)
    console.log('Text:', text || 'No text content')
    console.log('============================================\n')
    return
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"MindCare" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    })

    console.log('Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Email sending failed:', error)
    
    // Fallback to console logging
    console.log('\n=== EMAIL FAILED TO SEND ===')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('HTML:', html)
    console.log('Text:', text || html.replace(/<[^>]*>/g, ''))
    console.log('============================\n')
    
    throw error
  }
}

// Test email configuration
export async function testEmailConfig() {
  if (!isEmailConfigured) {
    return {
      configured: false,
      message: 'SMTP not configured - emails will be logged to console'
    }
  }

  try {
    await transporter.verify()
    return {
      configured: true,
      message: 'Email configuration is valid'
    }
  } catch (error) {
    return {
      configured: false,
      message: `Email configuration error: ${error.message}`
    }
  }
}