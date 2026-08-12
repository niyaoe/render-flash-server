const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, username, verificationUrl) => {
  await transporter.sendMail({
    from: `"RenderFlash" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "Verify your RenderFlash account",

    html: `
      <!DOCTYPE html>

      <html>
        <head>
          <meta charset="UTF-8" />

          <style>
            body {
              margin: 0;
              padding: 0;
              background: #0b0b0b;
              font-family: Arial, sans-serif;
              color: #ffffff;
            }

            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #151515;
              border: 1px solid #292929;
              border-radius: 12px;
              padding: 40px;
            }

            .logo {
              color: #621eff;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 30px;
            }

            h1 {
              font-size: 26px;
              margin-bottom: 15px;
            }

            p {
              color: #b5b5b5;
              line-height: 1.6;
            }

            .button {
              display: inline-block;
              margin-top: 20px;
              padding: 14px 24px;
              background: #621eff;
              color: white !important;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
            }

            .link {
              margin-top: 25px;
              padding: 15px;
              background: #0f0f0f;
              border-radius: 6px;
              word-break: break-all;
              font-size: 12px;
              color: #777;
            }

            .footer {
              margin-top: 30px;
              color: #555;
              font-size: 12px;
            }
          </style>
        </head>

        <body>

          <div class="container">

            <div class="logo">
              renderFlash
            </div>

            <h1>
              Verify your email
            </h1>

            <p>
              Hi ${username},
            </p>

            <p>
              Welcome to RenderFlash!
              Please verify your email address to activate your account.
            </p>

            <a
              href="${verificationUrl}"
              class="button"
            >
              Verify Email
            </a>

            <p>
              This verification link will expire in 1 hour.
            </p>

            <div class="link">
              ${verificationUrl}
            </div>

            <div class="footer">
              If you didn't create a RenderFlash account,
              you can safely ignore this email.
            </div>

          </div>

        </body>
      </html>
    `,
  });
};

module.exports = {
  sendVerificationEmail,
};