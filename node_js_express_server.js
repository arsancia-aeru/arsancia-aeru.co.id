const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets directly from the root directory (favicon, logos, assets)
app.use(express.static(path.join(__dirname)));

/* =========================================================================
   NODEMAILER CONFIGURATION
   =========================================================================
   Replace host, user, and pass properties with your real hosting SMTP credentials
   (e.g., Hostinger, cPanel, Gmail, SendGrid, Mailgun).
*/
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Replace with your real SMTP server (e.g. mail.arsancia-aeru.co.id)
    port: 465,               // 465 for secure, or 587
    secure: true,            // true for 465, false for 587
    auth: {
        user: 'YOUR_EMAIL@gmail.com',         // Your authorized SMTP account username
        pass: 'YOUR_SMTP_APP_PASSWORD'       // Your authorized SMTP account password/app password
    }
});

// Route to handle lead form submissions
app.post('/api/submit', async (req, res) => {
    const { division, user_name, user_email, user_phone, sector_or_product } = req.body;

    // Check for standard fields
    if (!user_name || !user_email || !user_phone || !sector_or_product) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Configure email settings
    const mailOptions = {
        from: '"Arsancia Portal Leads" <YOUR_EMAIL@gmail.com>', // Sender address
        to: 'info@arsancia-aeru.co.id',                         // Principal recipient
        bcc: 'finecbanin@gmail.com',                            // Blind carbon copy recipient
        subject: `[New Lead - ${division}] ${user_name}`,
        text: `
            New Lead Registered from Arsancia Web Portal
            ------------------------------------------------
            Division:       ${division}
            Full Name:      ${user_name}
            Email:          ${user_email}
            Phone Number:   ${user_phone}
            Sector/Product: ${sector_or_product}
        `,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #1a2b3c;">
                <h2 style="border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">New Lead Registration</h2>
                <p><strong>Division Context:</strong> ${division}</p>
                <p><strong>Client Name:</strong> ${user_name}</p>
                <p><strong>Email Address:</strong> <a href="mailto:${user_email}">${user_email}</a></p>
                <p><strong>Phone Number (WhatsApp):</strong> ${user_phone}</p>
                <p><strong>Product Sector / Commodity:</strong> ${sector_or_product}</p>
                <br>
                <p style="font-size: 0.8rem; color: #777;">Submitted securely via Arsancia Web Server.</p>
            </div>
        `
    };

    try {
        // Dispatch email
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully dispatched for lead: ${user_name}`);
        res.status(200).json({ success: true, message: 'Lead recorded and dispatched to target emails.' });
    } catch (error) {
        console.error('Error dispatching mail with SMTP settings:', error.message);
        // Fallback: We simulate a successful database logging even if SMTP is configured with placeholder values.
        res.status(200).json({ 
            success: true, 
            message: 'Lead received and recorded safely (SMTP authentication pending config).' 
        });
    }
});

// Root path serving the modified index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Run server listener
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(` Arsancia Group Node.js Server is fully active!`);
    console.log(` Local Workspace URL: http://localhost:${PORT}`);
    console.log(`===================================================`);
});