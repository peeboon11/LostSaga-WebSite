export default async function handler(req:any, res:any) {
  const { token } = req.body;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `secret=${secretKey}&response=${token}`
  });

  const data = await response.json();

  if (data.success) {
      // The reCAPTCHA verification was successful
      res.status(200).json({ success: true });
  } else {
      // The reCAPTCHA verification failed
      res.status(400).json({ success: false, error: data['error-codes'] });
  }
}