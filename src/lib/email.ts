// Update email domain
export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: 'BondMate <hello@bondmate.app>',
      to: email,
      subject: 'Welcome to BondMate! 🎉',
      // ... (keep existing email template)
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}