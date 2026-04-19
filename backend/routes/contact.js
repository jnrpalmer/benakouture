const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/join', async (req, res) => {
  try {
    const data = req.body;
    const subject = `Bena Kouture — ${data.role}`;
    const html = `
      <h2 style= 'color:#722F37; '>${data.role}</h2>
      <table style= 'width:100%;border-collapse:collapse; '>
        ${Object.entries(data).filter(([k]) => k !== 'role').map(([k, v]) => `
          <tr>
            <td style= 'padding:8px;border-bottom:1px solid #eee;font-weight:600;text-transform:capitalize;width:40% '>${k.replace(/([A-Z])/g, ' $1')}</td>
            <td style= 'padding:8px;border-bottom:1px solid #eee; '>${v || '—'}</td>
          </tr>
        `).join('')}
      </table>
      <p style= 'margin-top:24px;color:#888;font-size:12px; '>Sent from Bena Kouture website</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject,
      html
    });

    res.json({ message: 'Application submitted successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;