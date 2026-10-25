import Razorpay from 'razorpay';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.warn(
    '⚠️ [Razorpay Config] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in environment variables. Razorpay API operations will fail if invoked without valid keys.',
  );
}

export const razorpay = new Razorpay({
  key_id: keyId || '',
  key_secret: keySecret || '',
});

export default razorpay;
