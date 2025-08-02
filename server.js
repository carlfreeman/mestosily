require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    ...(process.env.NODE_ENV === 'development' && {
        tls: { rejectUnauthorized: false }
    })
});

app.post('/send-email', async (req, res) => {
    const { name, phone, message } = req.body;

    const mailOptions = {
        from: `"Место Силы" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        subject: 'Новая заявка на аренду',
        html: `
            <h2>Новая заявка</h2>
            <p><strong>Имя:</strong> ${name}</p>
            <p><strong>Телефон:</strong> ${phone}</p>
            <p><strong>Сообщение:</strong></p>
            <p>${message}</p>
            <hr>
            <p>Дата: ${new Date().toLocaleString()}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Сообщение отправлено' });
    } catch (error) {
        console.error('Ошибка отправки:', error);
        res.status(500).json({ error: 'Ошибка при отправке сообщения' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});