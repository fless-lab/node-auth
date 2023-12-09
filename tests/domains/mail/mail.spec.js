// const { expect } = require('chai');
// const MailService = require('../../../src/domains/mail/services/mail.service');

// describe('🧪 Mail Service', () => {
//   it('should send an email successfully', async () => {
//     const mailService = new MailService();
//     const customMailOptions = {
//       to: 'test@example.com',
//       subject: 'Test Subject',
//       text: 'This is a test email.',
//     };

//     try {
//       await mailService.send(customMailOptions);
//       expect(true).to.equal(true);
//     } catch (error) {
//       expect.fail(error.message); 
//     }
//   });

//   it('should send OTP successfully', async () => {
//     const email = 'otp-request@example.com';
//     const otp = '1234';

//     try {
//       await MailService.sendOTP(email, otp);
//       expect(true).to.equal(true);
//     } catch (error) {
//       expect.fail(error.message); 
//     }
//   });
// });
