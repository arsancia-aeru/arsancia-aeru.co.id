require('dotenv').config(); // Load environment variables securely
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

// ... (keep the rest of your express setup as it is) ...

// Inside your nodemailer transporter configuration, replace your email strings with variables:
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Will read from your secret file
        pass: process.env.EMAIL_PASS  // Will read from your secret file
    }
});
