import Image from "next/image";
import { useState, useEffect } from "react";
import { isLoggedIn } from "../helpers/authHelper";
import SampleImg from "../assets/images/sample-img.png";
import { useRouter } from "next/router";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import Layout from "@/Layouts/layout3";
import { updateProfile, getUserData, updateWalletAddress } from "@/api/users";
import Loader from "@/components/Loader";
import FullPageLoader from "@/components/fullPageLoader";
import { configureWallets } from "@/components/wallet/WalletConfig"; // Import wallet configuration
import WalletConnection from "@/components/wallet/WalletConnection"; // Import WalletConnection component
import { profileConnectedWithOrganization } from "@/api/organizations";
const Profile = () => {
  const options = [
    { value: "Email", label: "Email", id: 1 },
    { value: "Phone", label: "Phone", id: 2 },
  ];
  const [loading, setLoading] = useState(false);
  const [fullPage, setFullPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    phone: "",
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    walletAddress: "",
    referralCode: "",
    image: null, // Store the selected image as a File object
  });
  const [userData, setUserData] = useState({
    phone: "",
    email: "",
  });
  const [check, setCheck] = useState(0); // Use null initially, or you can initialize with the default image
  const [selectedOption, setSelectedOption] = useState([]);
  const [connectedOrganization, setConnectedOrganization] = useState([]);
  const [pendingOrganization, setPendingOrganization] = useState([]);
  const user = isLoggedIn();
  const router = useRouter();
  // Use the wallet configuration
  const { chains, wagmiConfig } = configureWallets();
  // Function to handle changes in the selected profile image
  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setCheck(1);
    if (selectedImage) {
      setFormData({ ...formData, image: selectedImage });
    }
  };
  useEffect(() => {
    // Check if the user is not logged in and redirect to the home page
    if (!user || !user?.token) {
      router.push("/");
    } else {
      //Fetch user data if the user is logged in
      getUser();
    }
  }, []);

  //Function to fetch the user's profile Data
  const getUser = async () => {
    setFullPageLoading(true);
    let response = await getUserData(user);
    const connectWithOrganization = await profileConnectedWithOrganization(
      user
    );
    if (response) {
      let { statusCode, image, userData } = response;
      setCheck(0);
      if (statusCode === 200) {
        if (
          userData?.contactPrefernce &&
          userData.contactPrefernce.length > 0
        ) {
          setSelectedOption(userData.contactPrefernce);
        }
        setFullPageLoading(false);
        setFormData({
          ...formData,
          image: image,
          referralCode: userData?.referralCode,
          username: userData?.username,
        });
        setUserData({
          phone: userData?.phone !== undefined ? userData?.phone : "n/a",
          email: userData?.email,
        });
      }
    }
    if (connectWithOrganization) {
      const { updatedOrganizationUserData } = connectWithOrganization;

      const filteredByStatus0 = updatedOrganizationUserData.filter(
        (userData) => userData._doc.status === 0
      );
      const filteredByStatus1 = updatedOrganizationUserData.filter(
        (userData) => userData._doc.status === 1
      );

      setConnectedOrganization(filteredByStatus1);
      setPendingOrganization(filteredByStatus0);
    }
  };

  // Function to handle wallet address changes
  const handleAddressChange = async (address) => {
    const data = {
      address,
    };
    await updateWalletAddress(user, data);
    setFormData({ ...formData, walletAddress: address });
  };

  // Function to update user profile
  const updateUserProfile = async (image) => {
    setLoading(true);
    const { email, phone, currentPassword, newPassword } = formData;
    const selectedOptionJSON = JSON.stringify(selectedOption); // Encode as JSON string
    const obj = {
      email,
      phone,
      currentPassword,
      newPassword,
      image,
      selectedOption: selectedOptionJSON,
    };
    const updatedFormData = new FormData();
    for (const key in obj) {
      updatedFormData.append(key, obj[key]);
    }
    const response = await updateProfile(user, updatedFormData);
    if (response) {
      if (response?.error) {
        Swal.fire("oops", response?.error, "error");
        setLoading(false);
      }
      const { statusCode, message, userData } = response;
      if (statusCode === 200) {
        setUserData({
          email: userData?.email,
          phone: userData?.phone !== undefined ? userData?.phone : "",
        });
        setLoading(false);
        Swal.fire("Good Job", message, "success");
      }
      if (statusCode === 400) {
        setLoading(false);
        Swal.fire("Oops", message, "error");
      }
    }
  };

  // Function to handle form submission and update user profile
  const submitForm = async (e) => {
    // Handle the form submission here
    e.preventDefault();
    // Access email and phone from formData
    const { image } = formData;
    updateUserProfile(image);
  };

  // Define the onHandleChange function
  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Function to handle checkbox selection
  const handleCheckboxChange = (value) => {
    setSelectedOption([value?.value]);
  };

  const redirectToConnectOrganization = () => {
    router.push("/connect-organization");
  };
  return fullPage ? (
    <FullPageLoader />
  ) : (
    <Layout image={formData?.image}>
      <div className="wrapper h-full">
        <div className="bg-grey2 overflow-hidden">
          <div className="p-8">
            <div className="hading-card py-[24px] px-[32px] mb-[32px] ">
              <h2 className="m-0 text-[24px] leading-[33px] font-[700] text-themecolor">
                Edit Your Profile
              </h2>
              <div className="flex justify-between">
                <p className="m-0 text-[16px] leading-[24px]">
                  View and manage your information.
                </p>
                <span className="icon-dots">
                  <FontAwesomeIcon icon={faEllipsis} className="text-[20px]" />
                </span>
              </div>
            </div>
            <div className="flex">
              <div className="w-full">
                <div className="flex flex-wrap lg:flex-nowrap gap-[16px]">
                  <div className="lg:w-[75%] w-full">
                    <div className="p-[32px] border-[1px] shadow-[#00000040] shadow-sm rounded-[10px] mb-[24px] bg-[#fff]">
                      <div className="flex flex-wrap lg:flex-nowrap gap-[32px]">
                        <div className="lg:w-[20%] w-[100%] lg:flex-none flex flex-col  items-center">
                          <div className="w-[120px] h-[120px] rounded-full overflow-hidden object-fill mb-[14px]">
                            {formData?.image ? (
                              <Image
                                src={
                                  check === 1
                                    ? URL.createObjectURL(formData?.image)
                                    : `${process.env.CLOUDINARY_IMAGE_URL}${formData.image}`
                                }
                                alt={
                                  check === 1
                                    ? "User Profile Image"
                                    : "User Profile Image1"
                                }
                                width={300}
                                height={200}
                              />
                            ) : (
                              <Image
                                src={SampleImg}
                                alt="Fallback User Profile Image"
                                width={300}
                                height={200}
                              />
                            )}
                          </div>

                          <div className="file-btn-holder relative w-[120px] h-[50px]">
                            <input
                              type="file"
                              className="w-[120] h-[40px] text-0 leading-0 opacity-0 absolute left-0 top-0 z-10 "
                              onChange={handleImageChange}
                            />
                            <span className="file-btn absolute cursor-pointer w-full h-[50px] border border-themecolor bg-[transparent] hover:bg-themecolor hover:text-white file-btn-holder-hover:bg-white text-themecolor file-btn-holder-hover:text-themecolor px-[20px] py-[8px] rounded-4 flex justify-center items-center">
                              Upload
                            </span>
                          </div>
                        </div>
                        <div className="lg:w-[80%] w-[100%]">
                          <h2 className="md:text-[40px] text-[30px] font-[700] mb-[15px]">
                            {formData?.username}
                          </h2>
                          <form>
                            <div className="mb-[12px]">
                              <label className="text-[16px] font-[400] mb-[12px] block">
                                {userData?.email}
                              </label>
                              <input
                                type="email"
                                name="email"
                                className="p-[12px] border-[1px] w-[100%] bg-[#FAFAFA] border-[#4066b033]"
                                placeholder="email@domain.com"
                                defaultValue={formData?.email}
                                onChange={onHandleChange}
                              />
                            </div>
                            <div className="mb-[12px]">
                              <label className="text-[16px] font-[400] mb-[12px] block">
                                Phone: {userData?.phone}
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                className="p-[12px] border-[1px] w-[100%] bg-[#FAFAFA] border-[#4066b033]"
                                placeholder="Phone Number"
                                defaultValue={formData?.phone}
                                onChange={onHandleChange}
                              />
                            </div>
                            <div className="mb-[12px]">
                              <label className="text-[16px] font-[400] mb-[12px] block">
                                Contact Preference:
                              </label>
                              <Select
                                defaultValue={selectedOption}
                                classNamePrefix="custom-select"
                                onChange={handleCheckboxChange}
                                size="small"
                                className="w-full text-[#000]"
                                placeholder="Select One."
                                sx={{ minWidth: 150 }}
                                options={options}
                              ></Select>
                            </div>

                            <div className="mb-[12px]">
                              <label className="text-[16px] font-[400] mb-[12px] block">
                                Password
                              </label>
                              <input
                                type="password"
                                name="currentPassword"
                                className="p-[12px] border-[1px] w-[100%] bg-[#FAFAFA] border-[#4066b033]"
                                placeholder="Current Password"
                                defaultValue={formData?.currentPassword}
                                onChange={onHandleChange}
                              />
                            </div>
                            <div className="mb-[12px]">
                              <input
                                type="password"
                                name="newPassword"
                                className="p-[12px] border-[1px] w-[100%] bg-[#FAFAFA] border-[#4066b033]"
                                placeholder="New Password"
                                defaultValue={formData?.newPassword}
                                onChange={onHandleChange}
                              />
                            </div>
                            <div className="mb-[24px] flex justify-end gap-[10px] flex-wrap">
                              <button
                                className="bg-themecolor text-[#fff] py-[8px] px-[20px] rounded-[4px] border-[1px] border-[solid] border-themecolor hover:bg-[transparent] hover:text-themecolor"
                                onClick={(e) => submitForm(e)}
                              >
                                Update
                                {loading ? <Loader className="mr-3" /> : null}
                              </button>
                              <button className="py-[8px] px-[20px] rounded-[4px] border-[1px] text-themecolor border-themecolor hover:bg-themecolor hover:text-[#fff]">
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    {connectedOrganization.length > 0 ||
                    pendingOrganization.length > 0 ? (
                      <div>
                        <div>
                          {connectedOrganization.length > 0 && (
                            <div className="shadow-[#00000040] shadow-sm rounded-[10px] p-[24px] bg-[#fff] border-[1px]">
                              <div className="mb-[28px]">
                                <h2 className="md:text-[24px] text-[18px] font-[700] text-themecolor">
                                  Connected Organization
                                </h2>
                              </div>
                              {connectedOrganization.map((org, index) => (
                                <div className="p-[12px] border-[1px] border-[#4066b033]">
                                  <div className="flex justify-between flex-wrap">
                                    <p className="text-[#505050] text-[16px] text-[400]">
                                      {org?.organizationData.name}
                                    </p>
                                    <FontAwesomeIcon icon={faEllipsis} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <br></br>
                          {pendingOrganization.length > 0 && (
                            <div className="shadow-[#00000040] shadow-sm rounded-[10px] p-[24px] bg-[#fff] border-[1px]">
                              <div className="mb-[28px]">
                                <h2 className="md:text-[24px] text-[18px] font-[700] text-themecolor">
                                  Pending Organization
                                </h2>
                              </div>
                              {pendingOrganization.map((org, index) => (
                                <div className="p-[12px] border-[1px] border-[#4066b033]">
                                  <div className="flex justify-between flex-wrap">
                                    <p className="text-[#505050] text-[16px] text-[400]">
                                      {org?.organizationData.name}
                                    </p>
                                    <FontAwesomeIcon icon={faEllipsis} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="shadow-[#00000040] shadow-sm rounded-[10px] p-[24px] bg-[#fff] mb-[24px] border-[1px]">
                        <div className="flex justify-between flex-wrap mb-[19px]">
                          <h2 className="md:text-[24px] text-[18px] font-[700] me-[4px] text-themecolor">
                            Connect to an Organization
                          </h2>
                          <button
                            onClick={redirectToConnectOrganization}
                            className="py-[8px] px-[20px] border-[1px] md:text-[16px] text-[13px] text-themecolor rounded-[4px] border-[solid] border-themecolor hover:bg-themecolor hover:text-[#fff]"
                          >
                            Search for Organization
                          </button>
                        </div>
                        <p>
                          Associated with an Organization, Send a request to
                          link your account to the specified organization. The
                          request will be reviewed and you’ll have access to be
                          a member of the Organization’s dashboard.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="wallet-card shadow-[#00000040] shadow-sm rounded-[10px] py-[24px] px-[32px] grow bg-white mb-4 border lg:w-[25%] w-full h-full">
                    <div className="flex justify-between flex-wrap mb-[24px]">
                      <h2 className="md:text-[24px] font-[700] text-[18px] text-themecolor">
                        My Wallet
                      </h2>
                    </div>

                    <div className="metamask-card bg-[#0ACF83]/[.19] p-[16px] mb-[16px]">
                      <h2 className="mt-0 mb-2 lg:text-[20px] xl-[16px] leading-[28px] font-bold">
                        MetaMask
                      </h2>
                      <p className="text-[16px] leading-[24px] break-words">
                        Connected:{" "}
                        {formData?.walletAddress
                          ? formData?.walletAddress
                          : "0x0"}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <WagmiConfig config={wagmiConfig}>
                        <RainbowKitProvider chains={chains}>
                          <WalletConnection
                            onAddressChange={handleAddressChange}
                          />
                        </RainbowKitProvider>
                      </WagmiConfig>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Profile;
