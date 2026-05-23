import { Resend } from 'resend'

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'BotMarket <onboarding@resend.dev>',
      to: [orderData.customer_email],
      subject: `Order Confirmed - ${orderData.bot_name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #000;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                padding: 40px 0;
                border-bottom: 2px solid #000;
              }
              .header h1 {
                font-size: 32px;
                font-weight: 900;
                margin: 0;
              }
              .content {
                padding: 40px 0;
              }
              .order-details {
                background: #f5f5f5;
                border-radius: 12px;
                padding: 30px;
                margin: 30px 0;
              }
              .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #ddd;
              }
              .detail-row:last-child {
                border-bottom: none;
              }
              .detail-label {
                color: #666;
                font-weight: 500;
              }
              .detail-value {
                font-weight: 700;
                color: #000;
              }
              .button {
                display: inline-block;
                background: #000;
                color: #fff;
                padding: 16px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 700;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                padding: 40px 0;
                border-top: 2px solid #000;
                color: #666;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Payment Confirmed</h1>
            </div>
            
            <div class="content">
              <p>Hi <strong>${orderData.customer_discord}</strong>,</p>
              
              <p>Thank you for your purchase! Your payment has been confirmed and your bot will be delivered shortly.</p>
              
              <div class="order-details">
                <h2 style="margin-top: 0; font-size: 24px;">Order Details</h2>
                
                <div class="detail-row">
                  <span class="detail-label">Bot</span>
                  <span class="detail-value">${orderData.bot_name}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Discord</span>
                  <span class="detail-value">${orderData.customer_discord}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Amount Paid</span>
                  <span class="detail-value">${orderData.price_sol} SOL</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Transaction</span>
                  <span class="detail-value">${orderData.transaction_signature?.slice(0, 16)}...</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Status</span>
                  <span class="detail-value" style="color: #16a34a;">Confirmed</span>
                </div>
              </div>
              
              <h3>What's Next?</h3>
              <p>Your bot files will be sent to this email address within 24 hours. You will receive:</p>
              <ul style="line-height: 2;">
                <li>Complete bot source code files</li>
                <li>Setup and installation guide</li>
                <li>Configuration instructions</li>
                <li>Support documentation</li>
              </ul>
              
              <p><strong>Note:</strong> We deliver the bot files directly to you. You will host and run the bot on your own server or hosting platform.</p>
              
              <p>If you have any questions, feel free to reach out to our support team.</p>
              
              <center>
                <a href="https://discord.gg/yourinvite" class="button">Join Our Discord</a>
              </center>
            </div>
            
            <div class="footer">
              <p>BotMarket - Premium Discord Bots</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </body>
        </html>
      `
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

export const sendAdminNotificationEmail = async (orderData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'BotMarket <onboarding@resend.dev>',
      to: [import.meta.env.VITE_ADMIN_EMAIL || 'your-admin-email@example.com'],
      subject: `New Order - ${orderData.bot_name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; padding: 20px;">
            <h2>New Order Received</h2>
            <p><strong>Bot:</strong> ${orderData.bot_name}</p>
            <p><strong>Customer Discord:</strong> ${orderData.customer_discord}</p>
            <p><strong>Customer Email:</strong> ${orderData.customer_email}</p>
            <p><strong>Amount:</strong> ${orderData.price_sol} SOL</p>
            <p><strong>Transaction:</strong> ${orderData.transaction_signature}</p>
            <p><strong>Order ID:</strong> ${orderData.id}</p>
          </body>
        </html>
      `
    })

    if (error) {
      console.error('Admin email error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Admin email error:', error)
    return { success: false, error: error.message }
  }
}
