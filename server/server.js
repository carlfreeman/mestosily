require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Проверка reCAPTCHA
async function verifyRecaptcha(token) {
    try {
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET,
                    response: token
                }
            }
        );
        return response.data.success;
    } catch (error) {
        console.error('reCAPTCHA error:', error);
        return false;
    }
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
});

app.post('/api/send-email', async (req, res) => {
    const { name, phone, message, 'g-recaptcha-response': recaptcha } = req.body;

    // Валидация reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptcha);
    if (!isHuman) {
        return res.status(400).json({ error: 'Пожалуйста, подтвердите, что вы не робот' });
    }

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
        res.json({ message: 'Сообщение отправлено' });
    } catch (error) {
        console.error('Ошибка отправки:', error);
        res.status(500).json({ error: 'Ошибка при отправке сообщения' });
    }
});

// Обслуживание статических файлов
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    app.use(express.static(path.join(__dirname, '../public')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
}

module.exports = app;