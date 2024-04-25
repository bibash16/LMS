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

    async sendEmail(emailOptions, template, data) {
        try {
            const emailContent = await this.renderTemplate(template, data);
            
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
        //const { name } = data;
        const templatePath = path.join(__dirname, '..','public', 'html','emailHTML',`${template}.ejs`);
        const templateFile = fs.readFileSync(templatePath, 'utf-8');
        const html = await ejs.render(templateFile, data);
        return { html };
       }catch(error){
            console.error('Error rendering template:', error);
            throw error; 
        }
    }

    async sendWelcomeEmail(user) {
        const emailOptions = {
            from: `LMS ADMIN <${process.env.ETHEREAL_USERNAME}>`,
            to: user.email,
            subject: 'Welcome to Your Leave Management System',
        };

        const data = {
            name: user.name
        };

        await this.sendEmail(emailOptions, 'welcome', data);
    }

    async sendRejectLeaveEmail(user, leaveId) {
        const emailOptions = {
            from: `LMS ADMIN <${process.env.ETHEREAL_USERNAME}>`,
            to: user.email,
            subject: 'Leave Request Rejected',
        };

        const data = {
            name: user.name,
            leaveId: leaveId
        };

        await this.sendEmail(emailOptions, 'rejected', data);
    }

    async sendAcceptLeaveEmail(user, leaveId) {
        const emailOptions = {
            from: `LMS ADMIN <${process.env.ETHEREAL_USERNAME}>`,
            to: user.email,
            subject: 'Leave Request Accepted',
        };

        const data = {
            name: user.name,
            leaveId: leaveId
        };

        await this.sendEmail(emailOptions, 'accepted', data);
    }
}

module.exports = EmailService;
