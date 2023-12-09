// // otp.spec.js
// const { expect } = require('chai');
// const supertest = require('supertest');
// const app = require("../../../src/index"); // Assurez-vous que le chemin est correct

// describe('🧪 OTP Management', () => {
//   it('should generate a valid OTP', async () => {

    
// before(async () => {
//   app.listen(5005, () => {
//     console.log(`Test Server running on port 5005`)
//   })
// });

//     const response = await supertest(app)
//       .post('/otp/generate')
//       .send({ email: 'test@example.com' });
//     console.log('response sould1 : ',response)
//     expect(response.status).to.equal(200);
//     expect(response.body).to.have.property('otp');
//     // Vous pouvez ajouter d'autres assertions ici en fonction de vos besoins
//   });

//   it('should validate a valid OTP', async () => {
//     // Générez d'abord un OTP valide (simulez le processus de génération)
//     const generatedOtp = await supertest(app)
//       .post('/otp/generate')
//       .send({ email: 'test@example.com' })
//       .then((response) => response.body.otp);

//     const response = await supertest(app)
//       .post('/otp/validate')
//       .send({ email: 'test@example.com', otp: generatedOtp });

//     expect(response.status).to.equal(200);
//     expect(response.body).to.have.property('isValid', true);
//     // Ajoutez d'autres assertions ici si nécessaire
//   });

//   it('should invalidate an expired OTP', async () => {
//     // Générez d'abord un OTP, puis attendez son expiration
//     const generatedOtp = await supertest(app)
//       .post('/otp/generate')
//       .send({ email: 'test@example.com' })
//       .then((response) => response.body.otp);

//     // Attendez l'expiration (simulez l'attente de l'OTP)
//     await new Promise((resolve) => setTimeout(resolve, 60000));

//     const response = await supertest(app)
//       .post('/otp/validate')
//       .send({ email: 'test@example.com', otp: generatedOtp });

//     expect(response.status).to.equal(200);
//     expect(response.body).to.have.property('isValid', false);
//     // Ajoutez d'autres assertions ici si nécessaire
//   });
// });
