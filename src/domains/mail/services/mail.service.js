// mail.service.js

const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail.config');
const config = require("../../../../config");
const { MailServiceError } = require('../../../common/error/error');


class MailService {
    constructor() {
      this.defaultMailOptions = mailConfig.mailOptions;
      this.defaultTransporterOptions = mailConfig.transporterOptions;
    }
  
    async send(customMailOptions = {}, customTransporterOptions = {}) {
      const mergedMailOptions = { ...this.defaultMailOptions, ...customMailOptions };
      const mergedTransporterOptions = { ...this.defaultTransporterOptions, ...customTransporterOptions };
  
      const transporter = nodemailer.createTransport(mergedTransporterOptions);
  
      try {
        await transporter.sendMail(mergedMailOptions);
      } catch (error) {
        console.log("error",error)
        throw new MailServiceError('Email sending failed', 500);
      }
    }

    static async sendOTP(email, otp, purpose) {
        const mailOptions = {
          to: email,
          subject:  `[${purpose}] Your OTP Code`,
          text: `Your OTP code is: ${otp}. Valid for ${config.otp.expirationHour} hour`,
        };
    
        try {
          const mailService = new MailService();
          await mailService.send(mailOptions);
        } catch (error) {
          throw new MailServiceError('OTP Sending failed', 500);
        }
    }
    
  }

module.exports = MailService;
