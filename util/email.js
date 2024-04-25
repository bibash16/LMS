const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ETHEREAL_USERNAME,
                pass: process.env.ETHEREAL_PASSWORD
            }
        });
    }

    async sendEmail(emailOptions, template) {
        try {
            const emailContent = await this.renderTemplate(template, emailOptions);
            
            await this.transporter.sendMail({
                ...emailOptions,
                ...emailContent
            });
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    async renderTemplate(template, data) {
       try {
        const { name } = data;
        const templatePath = path.join(__dirname, '..','public', 'html','emailHTML',`${template}.ejs`);
        const templateFile = fs.readFileSync(templatePath, 'utf-8');
        const html = await ejs.render(templateFile, data);
        return { html };
       }catch(error){
            console.error('Error rendering template:', error);
            throw error; 
        }
    }

}

module.exports = EmailService;
