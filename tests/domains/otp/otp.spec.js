const { expect } = require('chai');
const OTPService = require("../../../src/domains/otp/services/otp.service");
const MailService = require("../../../src/domains/mail/services/mail.service");
const UserService = require("../../../src/domains/user/services/user.services");
const OTPRepository = require("../../../src/domains/otp/repositories/otp.repo");

describe('🧪 OTP Management', () => {
  let testUser = {email:'test@example.com',password:"password"}; // Pour stocker l'utilisateur de test

  // Avant les tests, créez un utilisateur
  // before(async () => {
   
  // });

  // // Après les tests, supprimez l'utilisateur de test
  // after(async () => {
  //   try {
  //     // Supprimez l'utilisateur (vous devez implémenter cette fonctionnalité dans le service utilisateur)
  //     const { success: deleteSuccess, error: deleteError } = await UserService.deleteUser(testUser.email);

  //     if (!deleteSuccess) {
  //       console.error('Error deleting test user:', deleteError);
  //       throw deleteError;
  //     }
  //   } catch (error) {
  //     console.error('Error deleting test user:', error);
  //     throw error;
  //   }
  // });

  // it('should generate a valid OTP', async () => {

  //   try {
  //     // Créez l'utilisateur
  //     const { success: createSuccess, user: createdUser, error: createError } = await UserService.createUser(testUser.email, testUser.password);

  //     if (!createSuccess) {
  //       throw createError;
  //     }

  //     testUser = createdUser; // Stockez l'utilisateur pour une utilisation ultérieure dans les tests
  //     console.log("created user : ",testUser)
  //   } catch (error) {
  //     console.error('Error creating test user:', error);
  //     throw error;
  //   }

  //   try {
  //     // Utilisez directement le service OTP pour générer le code
  //     const { success, otp, error } = await OTPService.generate(testUser.email);

  //     if (!success) {
  //       throw error;
  //     }

  //     // Vérifiez que l'OTP est généré avec succès
  //     expect(otp).to.have.property('code');
  //     expect(otp).to.have.property('expiresAt');
  //     expect(otp).to.have.property('user');

  //     // Utilisez le service de messagerie pour envoyer l'OTP par e-mail (simulé ici)
  //     await MailService.sendOTP(testUser.email, otp.code);

  //     // Vous pouvez ajouter d'autres assertions ici en fonction de vos besoins
  //   } catch (error) {
  //     console.error('Error generating OTP:', error);
  //     throw error;
  //   }
  // });

  it('should validate a valid OTP', async () => {
    try {
      // Créez l'utilisateur
      const { success: createSuccess, user: createdUser, error: createError } = await UserService.createUser(testUser.email, testUser.password);

      if (!createSuccess) {
        throw createError;
      }

      testUser = createdUser; // Stockez l'utilisateur pour une utilisation ultérieure dans les tests
      console.log("created user : ",testUser)
    } catch (error) {
      console.error('Error creating test user:', error);
      throw error;
    }
    try {
      // Générez d'abord un OTP valide en utilisant le service
      const { success: generateSuccess, otp: generatedOtp, error: generateError } = await OTPService.generate(testUser.email);

      if (!generateSuccess) {
        throw generateError;
      }

      // Utilisez le service OTP pour valider l'OTP généré
      const { success: validateSuccess, error: validateError } = await OTPService.validate(testUser.email, generatedOtp.code);

      if (!validateSuccess) {
        throw validateError;
      }

      console.log("otp validated : ")

      // Utilisez le service utilisateur pour marquer l'utilisateur comme vérifié
      const { success: userSuccess, error: userError } = await UserService.markAsVerified(testUser.email);

      if (!userSuccess) {
        throw userError;
      }

      // Vous pouvez ajouter d'autres assertions ici en fonction de vos besoins
    } catch (error) {
      console.error('Error validating OTP:', error);
      throw error;
    }
  });

  // it('should invalidate an expired OTP', async () => {
  //   try {
  //     // Générez d'abord un OTP (ne pas l'utiliser pour simuler l'expiration)
  //     const { success: generateSuccess, otp: generatedOtp, error: generateError } = await OTPService.generate(testUser.email);

  //     if (!generateSuccess) {
  //       throw generateError;
  //     }

  //     // Attendez l'expiration (simulé ici)
  //     await new Promise((resolve) => setTimeout(resolve, 60000));

  //     // Utilisez le service OTP pour valider l'OTP expiré
  //     const { success: validateSuccess, error: validateError } = await OTPService.validate(testUser.email, generatedOtp.code);

  //     if (!validateSuccess) {
  //       throw validateError;
  //     }

  //     // Vous pouvez ajouter d'autres assertions ici en fonction de vos besoins
  //   } catch (error) {
  //     console.error('Error validating expired OTP:', error);
  //     throw error;
  //   }
  // });
});
