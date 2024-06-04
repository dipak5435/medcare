const nodemailer = require("nodemailer");

const mailSender = async (email, title, drugs) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: 'StudyNotion || CodeHelp - by Babbar',
            to: email,
            subject: title,
            html: `
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Drug Recommendation Confirmation</title>
                        <style>
                            body {
                                background-color: #ffffff;
                                font-family: Arial, sans-serif;
                                font-size: 16px;
                                line-height: 1.4;
                                color: #333333;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                text-align: center;
                            }
                            .logo {
                                max-width: 200px;
                                margin-bottom: 20px;
                            }
                            .message {
                                font-size: 18px;
                                font-weight: bold;
                                margin-bottom: 20px;
                            }
                            .body {
                                font-size: 16px;
                                margin-bottom: 20px;
                            }
                            .support {
                                font-size: 14px;
                                color: #999999;
                                margin-top: 20px;
                            }
                            .highlight {
                                font-weight: bold;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <a href="https://studynotion-edtech-project.vercel.app">
                                <img class="logo" src="https://www.shutterstock.com/image-vector/client-loyalty-customer-satisfaction-icon-260nw-2174562919.jpg" alt="StidyNotion Logo">
                            </a>
                            <div class="message">Drug Recommend Confirmation</div>
                            <div class="body">
                                <p>Hey ${drugs},</p>
                                <p>Your Drug has been successfully sent for the email <span class="highlight">${email}</span>.</p>
                                <p>If you did not request this , please contact us immediately to secure your account.</p>
                            </div>
                            <div class="support">If you have any questions or need further assistance, please feel free to reach out to us at
                                <a href="mailto:info@studynotion.com">info@studynotion.com</a>. We are here to help!
                            </div>
                        </div>
                    </body>
                </html>
            `,
        });
        console.log(info);
        return info;
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = mailSender;
