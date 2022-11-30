
const nodemailer = require("nodemailer");

async function sendEmail({email, password, token}) {
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "6a96ef7063c505",
            pass: "3fcebe90ee5c20"
        },
    });

    const url = `http://localhost:3000/api/users/verify/${token}`
    const emails = {
        from: 'testing@gmail.com', 
        to: email, 
        subject: "Please veryfy your email", 
        text: 'Please veryfy your email', 
        html: `<b>Open this link <a href=${url} >${url}</a>,</b>`, 
    };
        
    await transporter.sendMail(emails)
}


module.exports = {
  sendEmail,
};