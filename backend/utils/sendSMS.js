const twilio = require('twilio');

// SMS Provider Abstraction
const sendSMS = async ({ to, body }) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromPhone) {
      console.warn('\n[SMS WARNING] Twilio credentials not configured in .env');
      console.warn(`[SMS WARNING] Failed to send SMS to ${to}. Message: "${body}"\n`);
      return false; // SMS NOT CONFIGURED, clearly reported
    }

    const client = twilio(accountSid, authToken);
    
    const message = await client.messages.create({
      body: body,
      from: fromPhone,
      to: to
    });

    console.log(`[SMS SUCCESS] SMS sent to ${to}. SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error(`[SMS ERROR] Failed to send SMS to ${to}:`, error.message);
    return false;
  }
};

module.exports = sendSMS;
