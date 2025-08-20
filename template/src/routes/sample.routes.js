import express from 'express';
const router = express.Router();
import { generateCaptcha } from '../utils/generateCaptcha.js';
import { pdfGenerate } from '../controllers/pdfController.js';

router.get('/captcha', (req, res) => {
  const captcha = generateCaptcha();
  req.session.captcha = captcha.text; // store in session
  res.type('svg');
  res.status(200).send(captcha.data);
});

router.post('/verify-captcha', (req, res) => {
  const { userInput } = req.body;

  if (userInput === req.session.captcha) {
    res.send({ success: true, message: 'CAPTCHA verified' });
  } else {
    res.send({ success: false, message: 'CAPTCHA incorrect' });
  }
});
router.post('/generatePdf', pdfGenerate)

router.get("/test", (req, res) => {
  res.send("This is a test route.");
});


export default router;
