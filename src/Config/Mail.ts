import sgMail from "@sendgrid/mail"
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


export const ForgotPasswordEmail = async (email: string, url: string) => {
    const msg = {
        to: email, // Change to your recipient
        from: 'hola@angeeltrujillo.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: `Reset password url: ${url}`,
        html: `<strong>Reset password url: ${url}</strong>`
      }
      try {
          await sgMail.send(msg);
      } catch (error) {
        console.error(error)
      }
}
