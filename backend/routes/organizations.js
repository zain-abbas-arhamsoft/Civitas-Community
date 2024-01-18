const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationControllers");
const { verifyToken } = require("../middleware/auth");
const { imageUpload } = require("../util/upload");
router.post(
  "/submit-contact-details",
  verifyToken,
  organizationController.submitContactDetails
);
router.post(
  "/rewards-details-org",
  verifyToken,
  organizationController.rewardDeatilInOrganization
);

router.post(
  "/rewards-collection-org",
  verifyToken,
  organizationController.rewardSumInOrganization
);

router.put(
  "/update-contact-details",
  verifyToken,
  organizationController.updateContactDetails
);
router.post(
  "/get-user-organization",
  verifyToken,
  organizationController.GetUserOrgnization
);
router.post(
  "/create-organization",
  imageUpload,
  verifyToken,
  organizationController.createOrganization
);
router.put(
  "/update-user-appliction-status",
  verifyToken,
  organizationController.updateUserStatusWithOrganization
);
router.post(
  "/connect-user-with-organization",
  verifyToken,
  organizationController.connectUserWithOrganization
);
router.post(
  "/send-code-via-phone",
  verifyToken,
  organizationController.sendCodeWithPhone
);
router.post(
  "/send-code-via-email",
  verifyToken,
  organizationController.sendCodeWithEmail
);
router.post(
  "/send-code-via-mail",
  verifyToken,
  organizationController.sendCodeWithMail
);
router.post(
  "/verify-email-code",
  verifyToken,
  organizationController.verifyEmailCode
);
router.post(
  "/verify-mail-code",
  verifyToken,
  organizationController?.verifyMailCode
);
router.post(
  "/verify-phone-code",
  verifyToken,
  organizationController?.verifyPhoneCode
);
router.post(
  "/verify-user-with-organization",
  verifyToken,
  organizationController?.verifyUserWithOrganization
);
router.post(
  "/submit-application-resource",
  verifyToken,
  organizationController?.submitApplicationResource
);
router.post("/read-csv-file", organizationController.readCsvFile);
router
  .route("/create-organization-type")
  .post(organizationController.createOrganizationType);

  
  router.post(
    "/count-organization-members",
    verifyToken,
    organizationController.countOrganizationMembers
  );
router.post(
  "/owner-of-organization",
  verifyToken,
  organizationController.ownerOforganization
);
router.post(
  "/check-application-status",
  verifyToken,
  organizationController.checkApplicationStatus
);

router.post(
  "/review-user-application",
  verifyToken,
  organizationController.reviewUserApplication
);
router
  .route("/count-organization-members")
  .post(organizationController.countOrganizationMembers);

router.post(
  "/owner-of-organization",
  verifyToken,
  organizationController.ownerOforganization
);
router.get(
  "/search-organization",
  verifyToken,
  organizationController.searchOrganization
);

router.get(
  "/profile-connected-with-organization",
  verifyToken,
  organizationController.profileConnectedWithOrganization
);

router.put(
  "/update-organization-notification",
  verifyToken,
  organizationController.updateNotificationWithOrganization
);

router.get("/list/currentPage", organizationController.list);
router.get("/detail/", organizationController.organizationDeatil);
router.get(
  "/unverified-mail-id",
  verifyToken,
  organizationController?.unverifiedMailId
);
router.get("/type/list", organizationController.typeList);
router.get(
  "/list",
  verifyToken,
  organizationController.adminTypeList
);
router.get("/filter/zip-code", organizationController.filterZipCode);
router.get("/filter/type", organizationController.filterType);
router.get("/filter/org-name", organizationController.filterOrganizationName);
router.get(
  "/get-organization-details",
  organizationController.viewOrganizationDetails
);

router.get(
  "/get-similar-organizations-id",
  organizationController.getSimilarOrganizationId
);

module.exports = router;
