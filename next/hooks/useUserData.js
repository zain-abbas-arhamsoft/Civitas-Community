import { useState, useEffect } from "react";
/**
 * Custom React hook to manage user data and organization types
 * @param {Object} isLoggedIn - User authentication status and token
 * @param {Function} getUserData - Function to fetch user data
 * @param {Object} router - React router for navigation
 * @param {Function} organizationTypeList - Function to get organization types
 * @returns {Object} - Object containing user data and organization type
 */
const useUserData = (
  isLoggedIn,
  getUserData,
  router,
  organizationTypeList,
) => {
  const [userData, setUserData] = useState({
    email: "",
    image: "",
  });
  // State to manage organization types (initially an empty array)
  const [organizationType, setOrganizationType] = useState([]);
  const [loaded, setLoaded] = useState(true);

  // Fetch user data and organization types on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoggedIn || !isLoggedIn?.token) {
        router.push("/");
      } else {
        try {
          // Fetch user data based on authentication status
          let response = await getUserData(isLoggedIn);
          if (response) {
            const { statusCode, userData } = response;
            if (statusCode === 200) {
              // Set user data (email and image) if fetched successfully
              setUserData({
                ...userData,
                email: userData?.email,
                image: userData?.image,
              });
            }
          }
          // Fetch organization types list
          let getOrganizationType = await organizationTypeList();
          if (getOrganizationType) {
            const { statusCode, data } = getOrganizationType;
            if (statusCode === 200) {
              // Map fetched organization types to required options format
              const options = data?.organizationType?.map((option) => ({
                value: option._id,
                label: option.name,
              }));
              setOrganizationType(options);
            }
          }
          setLoaded(false);
        } catch (error) {
          setLoaded(false);
          // Handle errors or set a default state if necessary
        }
      }
    };
    fetchUserData();
  }, []);
  // Return the user data and organization type for use within the component
  return { userData, organizationType, loaded };
};

export default useUserData;
