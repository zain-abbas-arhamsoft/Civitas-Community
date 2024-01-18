const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const { verifyToken } = require("../middleware/auth");
const { imageUpload, cpUpload } = require("../util/upload");
router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.post("/authorize-user-referral", userControllers.authorizeReferralCode);
router.post(
  "/register-user-with-referral-code",
  userControllers.registerUserWithReferralCode
);
router.post(
  "/upload-documents",
  cpUpload,
  verifyToken,
  userControllers.uploadDocuments
);
router.post(
  "/fetch-document-detail",
  verifyToken,
  userControllers.fetchDocumentDetail
);

router.get("/get-user-data", verifyToken, userControllers.getUserData);
router.get(
  "/get-adminuser-count",
  verifyToken,
  userControllers.getAdminUserCount
);
router.put(
  "/update-user-status",
  verifyToken,
  userControllers.updateUserToAdmin
);
router.get("/complete-profile", verifyToken, userControllers.completeProfile);
router.get("/rewards-details", verifyToken, userControllers.rewardDeatil);
router.put("/rewards-update", verifyToken, userControllers.rewardUpdate);
router.put("/rewards-update-all", verifyToken, userControllers.rewardUpdateAll);
router.get("/random", userControllers.getRandomUsers);
router.post("/fetch-documents", userControllers.fetchDocuments);
router.get("/:username", userControllers.getUser);
router.put(
  "/update-profile",
  imageUpload,
  verifyToken,
  userControllers.updateUserprofile
);

router.put(
  "/update-wallet-address",
  verifyToken,
  userControllers.updateWalletAddress
);
router.put(
  "/review-application-status",
  verifyToken,
  userControllers.reviewApplicationStatus
);


module.exports = router;
