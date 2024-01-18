const emailTemplates = {
  emailVerificationCode:
    "<p>Hello ${email} :</p><p>${userName}.Your have created the organization ${organizationName}. This is your referral code ${verificationCode}</p>",
};

exports.templates = async (key) => {
  return emailTemplates[key] || "";
};
