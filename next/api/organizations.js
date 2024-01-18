import { BASE_URL } from "../config";

// Fetches a list of organizations
const organizationList = async (query) => {
  try {
    const res = await fetch(
      BASE_URL +
        "api/organizations/list/currentPage?" +
        new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {}
};
// Fetches a list of organizations
const organizationDeatil = async (query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/detail/?" + new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {}
};

const getRewardDetailsofOrg = async (user, organizationId) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/rewards-details-org",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify({ organizationId }),
      }
    );
    return res.json();
  } catch (err) {}
};

const getRewardCollectionInOrg = async (user, organizationId) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/rewards-collection-org",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify({ organizationId }),
      }
    );
    return res.json();
  } catch (err) {}
};
// Fetches a list of organization types
const organizationTypeList = async () => {
  try {
    const res = await fetch(BASE_URL + "api/organizations/type/list");
    return res.json();
  } catch (err) {}
};
// Filters organizations by zip code
const filterOrganizationZipCode = async (query) => {
  try {
    const res = await fetch(
      BASE_URL +
        "api/organizations/filter/zip-code?" +
        new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {}
};
// Filters organizations by type
const filterOrganizationType = async (query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/filter/type?" + new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {}
};

// Filters admin organizations by type
const filterAdminOrganizationType = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/organizations/list", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
    });
    return res.json();
  } catch (err) {}
};
// Filters organizations by name
const filterByOrganizationName = async (query) => {
  try {
    const res = await fetch(
      BASE_URL +
        "api/organizations/filter/org-name?" +
        new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {}
};
// Filters organization details by ID
const filterByOrganizationId = async (query) => {
  try {
    const res = await fetch(
      BASE_URL +
        "api/organizations/get-organization-details?" +
        new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {}
};
// Retrieves similar organization IDs
const getSimilarOrganizationId = async (query) => {
  try {
    const res = await fetch(
      BASE_URL +
        "api/organizations/get-similar-organizations-id?" +
        new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {}
};
// Submits user details to the server
const submitUserDetails = async (user, query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/submit-contact-details",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify(query),
      }
    );
    return res.json();
  } catch (err) {}
};
// Submits user details to the server
const submitApplicationAction = async (user, query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/update-contact-details",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify(query),
      }
    );
    return res.json();
  } catch (err) {}
};

// Submits user details to the server
const getUserOrganization = async (user) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/get-user-organization",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify(user),
      }
    );
    return res.json();
  } catch (err) {}
};

// Submits UpdateUserApplicationStatus details to the server
const UpdateUserApplicationStatus = async (user, query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/update-user-appliction-status",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify(query),
      }
    );
    return res.json();
  } catch (err) {}
};
// Creates a new organization
const createOrganization = async (user, formData) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/create-organization",
      {
        method: "POST",
        headers: {
          "x-access-token": user?.token,
        },
        body: formData,
      }
    );
    return await res.json();
  } catch (err) {}
};
// Creates a new organization type
const createOrganizationType = async (formData) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/create-organization-type",
      {
        method: "POST",
        body: formData,
      }
    );
    return await res.json();
  } catch (err) {}
};
// Reads a CSV file for organizations
const readCsvFile = async (formData) => {
  try {
    const res = await fetch(BASE_URL + "api/organizations/read-csv-file", {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch (err) {}
};
// Connect user with organization
const connectUserWithOrganization = async (user, formData) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/connect-user-with-organization",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify(formData),
      }
    );
    return await res.json();
  } catch (err) {}
};
// search organization in Organization Join Request Model
const searchOrganization = async (user, formData) => {
  try {
    const res = await fetch(
      BASE_URL +
        "api/organizations/search-organization?" +
        new URLSearchParams(formData),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
      }
    );
    return await res.json();
  } catch (err) {}
};

// send code through phone
const sendCodeViaPhone = async (user, formData) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/send-code-via-phone",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify(formData),
      }
    );
    return await res.json();
  } catch (err) {}
};

// send code through email
const sendCodeViaEmail = async (user, formData) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/send-code-via-email",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify(formData),
      }
    );
    return await res.json();
  } catch (err) {}
};

// send code through email
const sendCodeViaMail = async (user, formData) => {
  try {
    const res = await fetch(BASE_URL + "api/organizations/send-code-via-mail", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch (err) {}
};

// verify email code which was sent to user's email
const verifyEmailCode = async (user, formData) => {
  try {
    const res = await fetch(BASE_URL + "api/organizations/verify-email-code", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch (err) {}
};

// verify email code which was sent to user's email
const verifyMailCode = async (user, formData) => {
  try {
    const res = await fetch(BASE_URL + "api/organizations/verify-mail-code", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch (err) {}
};

// verify email code which was sent to user's email
const verifyPhoneCode = async (user, formData) => {
  try {
    const res = await fetch(BASE_URL + "api/organizations/verify-phone-code", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user?.token,
      },
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch (err) {}
};

// get unverified id
const unverifiedMailId = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/organizations/unverified-mail-id", {
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

// verify user whether user has created respective organization or not or user is compromised
const verifyUserWithOrganization = async (user, formData) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/verify-user-with-organization",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify(formData),
      }
    );
    return await res.json();
  } catch (err) {}
};

// verify user whether user has created respective organization or not or user is compromised
const profileConnectedWithOrganization = async (user) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/profile-connected-with-organization",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
      }
    );
    return await res.json();
  } catch (err) {}
};

// update the status notification
const updateOrganizationNotification = async (user, reqId) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/update-organization-notification",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify({ reqId }),
      }
    );
    return await res.json();
  } catch (err) {}
};

// check wthether user is the owner of organization or not
const ownerOforganization = async (user, formData) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/owner-of-organization",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify(formData),
      }
    );
    return await res.json();
  } catch (err) {}
};

// count organization memeber
const countOrganizationMembers = async ( user,formData) => {

  try {
    const res = await fetch(
      BASE_URL + "api/organizations/count-organization-members",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify(formData),
      }
    );
    return await res.json();
  } catch (err) {}
};

// submit application resource
const submitApplicationResource = async (user, formData) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/submit-application-resource",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify(formData),
      }
    );
    return await res.json();
  } catch (err) {}
};
// submit application resource
const checkApplicationStatus = async (user, formData) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/check-application-status",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify(formData),
      }
    );
    return await res.json();
  } catch (err) {}
};

// review  user application
const reviewUserApplication = async (user, formData) => {
  try {
    const res = await fetch(
      BASE_URL + "api/organizations/review-user-application",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user?.token,
        },
        body: JSON.stringify(formData),
      }
    );
    return await res.json();
  } catch (err) {}
};
export {
  organizationList,
  organizationDeatil,
  getRewardDetailsofOrg,
  getRewardCollectionInOrg,
  organizationTypeList,
  filterOrganizationZipCode,
  filterOrganizationType,
  filterByOrganizationName,
  filterByOrganizationId,
  submitUserDetails,
  submitApplicationAction,
  getUserOrganization,
  createOrganization,
  UpdateUserApplicationStatus,
  getSimilarOrganizationId,
  createOrganizationType,
  readCsvFile,
  connectUserWithOrganization,
  searchOrganization,
  sendCodeViaPhone,
  sendCodeViaEmail,
  verifyEmailCode,
  sendCodeViaMail,
  unverifiedMailId,
  verifyUserWithOrganization,
  verifyMailCode,
  verifyPhoneCode,
  profileConnectedWithOrganization,
  updateOrganizationNotification,
  ownerOforganization,
  countOrganizationMembers,
  submitApplicationResource,
  checkApplicationStatus,
  reviewUserApplication,
  filterAdminOrganizationType,
};
