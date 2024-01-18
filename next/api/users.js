import { BASE_URL } from "../config";

// Registers a new user
const signup = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {}
};
// Logs in a user
const login = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {}
};
// Retrieves user details by ID
const getUser = async (params) => {
  try {
    const res = await fetch(BASE_URL + "api/users/" + params.id);
    return res.json();
  } catch (err) {}
};
// Retrieves random users based on specific queries
const getRandomUsers = async (query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/users/random?" + new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {}
};
// Updates user data by ID
const updateUser = async (user, data) => {
  try {
    const res = await fetch(BASE_URL + "api/users/" + user._id, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (err) {}
};
// Updates user profile
const updateProfile = async (user, formData) => {
  try {
    const res = await fetch(BASE_URL + "api/users/update-profile", {
      method: "PUT",
      headers: {
        "x-access-token": user?.token,
      },
      body: formData,
    });
    return res.json();
  } catch (err) {}
};
// Retrieves user data using token authentication
const getUserData = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/get-user-data", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
    });
    return res.json();
  } catch (err) {}
};

const getRewardDetails = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/rewards-details", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
    });
    return res.json();
  } catch (err) {}
};

// Retrieves admin user data using token authentication
const getAdminUserCount = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/get-adminuser-count", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
    });
    return res.json();
  } catch (err) {}
};
// Retrieves admin user data using token authentication
const updateUserToAdmin = async (user, data) => {
  try {
    const res = await fetch(BASE_URL + "api/users/update-user-status", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (err) {}
};

// Retrieves admin user data using token authentication
const updateUserReward = async (user, data) => {
  try {
    const res = await fetch(BASE_URL + "api/users/rewards-update", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (err) {}
};

// Retrieves admin user data using token authentication
const updateUserRewardAll = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/rewards-update-all", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
    });
    return res.json();
  } catch (err) {}
};

// Updates user's wallet address
const updateWalletAddress = async (user, data) => {
  try {
    const res = await fetch(BASE_URL + "api/users/update-wallet-address", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (err) {}
};
// Checks if the user's profile is complete
const isCompleteProfile = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/complete-profile", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
    });
    return await res.json();
  } catch (err) {}
};

// Fetches authorization for user referral
const fetchReferralAuthorization = async (referralCode) => {
  try {
    const res = await fetch(BASE_URL + "api/users/authorize-user-referral", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(referralCode),
    });
    return await res.json();
  } catch (err) {}
};
// Retrieves user payouts
const getUserPayouts = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/payout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
    });
    return res.json();
  } catch (err) {}
};
// Registers a user with a referral code
const registerUserWithReferralCode = async (formData) => {
  try {
    const res = await fetch(
      BASE_URL + "api/users/register-user-with-referral-code",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    return await res.json();
  } catch (err) {}
};

// Uploads user documents
const uploadDocuments = async (user, formData) => {
  try {
    const res = await fetch(BASE_URL + "api/users/upload-documents", {
      method: "POST",
      headers: {
        "x-access-token": user?.token,
      },

      body: formData,
    });
    return await res.json();
  } catch (err) {}
};
// Fetches user documents
const fetchDocuments = async (user) => {
  const userId = user.userId;
  try {
    const res = await fetch(BASE_URL + "api/users/fetch-documents", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
      body: JSON.stringify({ userId }),
    });
    return await res.json();
  } catch (err) {}
};
// Fetches details of a specific document
const fetchDocumentDetail = async (user, params) => {
  try {
    const res = await fetch(BASE_URL + "api/users/fetch-document-detail", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err) {}
};

// Fetches details of a specific document
const reviewApplicationStatus = async (user, params) => {
  try {
    const res = await fetch(BASE_URL + "api/users/review-application-status", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err) {}
};

export {
  signup,
  login,
  getUser,
  getRandomUsers,
  updateUser,
  updateProfile,
  getUserData,
  getRewardDetails,
  getAdminUserCount,
  updateUserToAdmin,
  updateUserReward,
  updateUserRewardAll,
  updateWalletAddress,
  isCompleteProfile,
  fetchReferralAuthorization,
  registerUserWithReferralCode,
  getUserPayouts,
  uploadDocuments,
  fetchDocuments,
  fetchDocumentDetail,
  reviewApplicationStatus,
};
