import React, { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "react-modal";
import Image from "next/image";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { isLoggedIn } from "@/helpers/authHelper";
import { useRouter } from "next/router";
import { getUserData, updateWalletAddress } from "@/api/users";
import "@rainbow-me/rainbowkit/styles.css";
import "flowbite";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import FullPageLoader from "@/components/fullPageLoader";
import { configureWallets } from "@/components/wallet/WalletConfig"; // Import wallet configuration
import WalletConnection from "@/components/wallet/WalletConnection"; // Import WalletConnection component
import Layout from "@/Layouts/layout3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import useFetchDocuments from "@/hooks/usefetchDocuments";
import FileUploadModal from "./document-upload";
import {
  unverifiedMailId,
  profileConnectedWithOrganization,
  ownerOforganization,
  checkApplicationStatus,
} from "@/api/organizations";
import ConfirmationModal from "@/components/confirmation-modal";
library.add(faGoogle);
Modal.setAppElement("#__next");
const Dashboard = () => {
  const user = isLoggedIn();
  const router = useRouter();
  const [fullPage, setFullPageLoading] = useState(true);
  const [renderFlag, setRenderFlag] = useState(false);
  const [isConnectedtoOrganization, setIsConnectedToOrganization] =
    useState(false);
  const [isUserOwn, setIsOwnUser] = useState({
    success: false,
    organizationId: "",
  });

  const [applicationStatus, setApplicationStatus] = useState([]);
  const [mailOrganizationId, setMailOrganizationId] = useState();
  const [userData, setUserData] = useState({
    phone: "",
    email: "",
    username: "",
    image: "",
    walletAddress: "",
    totalPayout: "",
  });
  const { chains, wagmiConfig } = configureWallets();
  const { documents } = useFetchDocuments(user, renderFlag);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [connectedOrganization, setConnectedOrganization] = useState([]);
  const [modalIsOpen1, setModalIsOpen1] = useState(false);
  //Function to fetch the user's profile Data
  const getUser = async () => {
    setFullPageLoading(true);
    const response = await getUserData(user);
    const unverifiedResponse = await unverifiedMailId(user);
    const connectWithOrganization = await profileConnectedWithOrganization(
      user
    );
    const isOwnerOfOrganization = await ownerOforganization(user);
    const checkStatus = await checkApplicationStatus(user);
    if (response) {
      let { statusCode, userData } = response;
      const { unVerifiedMailId } = unverifiedResponse;
      if (statusCode === 200) {
        setFullPageLoading(false);
        setMailOrganizationId(unVerifiedMailId?.organizationId);
        setUserData({
          ...userData,
          phone: userData?.phone !== undefined ? userData?.phone : "n/a",
          email: userData?.email,
          username: userData?.username,
          image: userData?.image,
          walletAddress: userData?.wallet,
          totalPayout:
            userData?.totalPayout !== null ? userData?.totalPayout : 0,
        });
      }
    }
    if (isOwnerOfOrganization) {
      const { statusCode, success, matchUserWithOrganization } =
        isOwnerOfOrganization;
      if (matchUserWithOrganization) {
        const { _id } = matchUserWithOrganization;
        if (statusCode === 200) {
          setIsOwnUser({
            success: success,
            organizationId: _id,
          });
        } else {
          setIsOwnUser({
            success: false,
            organizationId: "",
          });
        }
      } else {
        setIsOwnUser({
          ...isUserOwn,
          organizationId: "",
        });
      }
    }
    const { statusCode, success, updatedOrganizationUserData } =
      connectWithOrganization;
    if (statusCode === 200) {
      setIsConnectedToOrganization(success);
    }
    if (statusCode === 400) {
      setIsConnectedToOrganization(success);
    }

    if (updatedOrganizationUserData) {
      const filteredByStatus1 = updatedOrganizationUserData.filter(
        (userData) =>
          userData._doc.status === 1 && userData._doc.notification == true
      );
      setConnectedOrganization(filteredByStatus1);
      if (filteredByStatus1 && filteredByStatus1.length > 0) {
        setModalIsOpen1(true);
      }
    }
    if (checkStatus) {
      const { getStatus } = checkStatus;
      setApplicationStatus(getStatus);
    }
    setFullPageLoading(false);
  };
  // Function to handle wallet address changes
  const handleAddressChange = async (address) => {
    const data = {
      address,
    };
    updateWalletAddress(user, data);
    setUserData({ ...userData, walletAddress: address });
  };
  const verifyMailCode = () => {
    router.push(`/verify-organization/${mailOrganizationId}?codeSent=${true}`);
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

  const connectToOrganization = () => {
    router.push("/connect-organization");
  };

  const gotToOrganizationPage = (event) => {
    event.preventDefault();
    router.push(`/organization-interior/${isUserOwn?.organizationId}`);
  };
  const openModal = () => {
    setModalIsOpen(true);
    setRenderFlag(false);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setRenderFlag(true);
  };

  const openModal1 = () => {
    setModalIsOpen1(true);
    setRenderFlag(false);
  };
  const closeModal1 = () => {
    setModalIsOpen1(false);
    setRenderFlag(true);
  };

  return fullPage ? (
    <FullPageLoader />
  ) : (
    <Layout image={userData?.image}>
      <div className="wrapper flex">
        <div className="bg-grey2 w-full">
          <div className="p-8">
            <div className="hading-card p-6 mb-14">
              <h2 className="mb-[10px] text-[24px] leading-[33px] font-[700] text-[#406AB3]">
                Your Dashboard
              </h2>
              <div className="flex justify-between">
                <p className="m-0 text-[16px] leading-[24px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse varius enim in eros.
                </p>
                <span className="icon-dots">
                  <FontAwesomeIcon className="text-[20px]" icon={faEllipsis} />
                </span>
              </div>
            </div>

            <button
              className="btn btn-theme border border-themecolor bg-themecolor text-white hover:text-themecolor hover:bg-transparent hover:border-themecolor  flex items-center px-[20px] py-[8px]  rounded-4"
              onClick={openModal1}
            >
              Upload
            </button>

            <div className="flex flex-col xl:flex-row">
              <div className="w-full xl:w-[60%] xl:mr-6 mb-6 xl:mb-0">
                <div className="user-card flex flex-col md:flex-row shadow-[#00000040] shadow-sm rounded-[10px] p-6 grow flex-1 bg-white mb-4">
                  <span className="rounded-full w-[120px] h-[120px] overflow-hidden mr-0 md:mr-8 mb-5 md:mb-0 border-[1px]">
                    <Image
                      src={`${process.env.CLOUDINARY_IMAGE_URL}${userData?.image}`}
                      width="120"
                      height="120"
                      alt="User Image"
                      className="w-full h-full"
                    />
                  </span>
                  <div className="flex flex-col grow">
                    <h2 className="mt-0 mb-4 sm:text-[25px] text-[18px] md:text-[40px] leading-[48px] font-bold">
                      {userData?.username}
                    </h2>
                    <div className="flex flex-col sm:flex-row md:items-end justify-between">
                      <ul className="text-[16px] leading-[24px] mb-3 md:mb-0">
                        <li className="mb-2">
                          Email:{" "}
                          <a href="duenes77@gmail.com">{userData?.email}</a>
                        </li>
                        <li>
                          Phone: <a href="tel:3612330450"> {userData?.phone}</a>
                        </li>
                      </ul>
                      <Link
                        className="btn btn-theme justify-center border border-themecolor bg-transparent text-themecolor hover:text-[#fff] hover:bg-themecolor  flex items-center px-[20px] py-[8px] ms-3 rounded-4"
                        href="/profile"
                      >
                        <span>Edit Profile</span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="wallet-card shadow-[#00000040] shadow-sm rounded-[10px] p-6 grow w-full bg-white mb-4">
                  <div className="flex justify-between mb-6 flex-col sm:flex-row flex-wrap">
                    <h2 className="text-[24px] leading-[34px] font-bold text-themecolor">
                      My Wallet
                    </h2>
                    <WagmiConfig config={wagmiConfig}>
                      <RainbowKitProvider chains={chains}>
                        <WalletConnection
                          onAddressChange={handleAddressChange}
                        />
                      </RainbowKitProvider>
                    </WagmiConfig>
                  </div>

                  {userData?.walletAddress ? (
                    <div className="metamask-card bg-[#0ACF83]/[.19] p-4">
                      <h2 className="mt-0 mb-2 text-[20px] font-[700]">
                        MetaMask
                      </h2>
                      <p className="text-[16px] leading-[24px]">
                        Connected:
                        {userData?.walletAddress
                          ? userData?.walletAddress
                          : "Not Connected"}
                      </p>
                    </div>
                  ) : (
                    <div className="metamask-card bg-[#CF0A24]/[.19] p-4">
                      <h2 className="mt-0 mb-2 text-[20px] font-[700]">
                        MetaMask
                      </h2>
                      <p className="text-[16px] leading-[24px]">
                        Connected:
                        {userData?.walletAddress
                          ? userData?.walletAddress
                          : "Not Connected"}
                      </p>
                    </div>
                  )}
                </div>
                <div className="wallet-card shadow-[#00000040] shadow-sm rounded-[10px] p-6 grow w-full bg-white">
                  <div className="flex justify-between mb-6 flex-col sm:flex-row">
                    <h2 className="mt-0 mb-2 text-[24px] leading-[34px] font-bold text-themecolor">
                      My Documents
                    </h2>
                    <div className="flex flex-wrap gap-[12px]">
                      <Link
                        className="btn btn-theme border border-themecolor bg-transparent text-themecolor hover:text-[#fff] hover:bg-themecolor  flex items-center px-[20px] py-[8px] rounded-4"
                        href="/document"
                      >
                        <span>View All</span>
                      </Link>
                      <button
                        className="btn btn-theme border border-[#4066b033] bg-themecolor text-white hover:text-themecolor hover:bg-transparent hover:border-themecolor  flex items-center px-[20px] py-[8px]  rounded-4"
                        onClick={openModal}
                      >
                        Upload
                        <span className="ms-3">
                          <FontAwesomeIcon icon={faCirclePlus} />
                        </span>
                      </button>
                    </div>
                  </div>
                  {documents?.length > 0 ? (
                    documents.slice(0, 2).map((document, index) => (
                      <div
                        key={index}
                        className="p-[16px] border border-[#4066b033] flex flex-col justify-center mb-[24px] bg-[#F4F4F4]"
                      >
                        <div className="flex flex-wrap justify-between">
                          <div>
                            <p className=" text-[14px] lg:text-[16px] font-[400]">
                              {document?.updatedAt}
                            </p>
                          </div>
                          <Link href={`/document-detail/${document?._id}`}>
                            <FontAwesomeIcon icon={faEllipsis} />
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[14px] font-[400]">
                      No documents available.
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full xl:w-[40%] shadow-[#00000040] shadow-sm rounded-[10px] p-6 bg-white">
                <h2 className="m-0 text-[24px] leading-[33px] font-bold mb-2.5 text-themecolor">
                  Notifications
                </h2>

                <div className="activity-block bg-[#FAFAFA] p-4 mb-6 shadow-[#00000040] shadow-sm rounded-[10px] border border-[#4066b033]">
                  {isConnectedtoOrganization == true ? (
                    <>
                      <h2 className="mb-[10px] text-[20px] leading-[28px] font-bold">
                        Connect your Profile to an Organization
                      </h2>
                      <p>Pending Request</p>
                    </>
                  ) : (
                    <>
                      <h2 className="mb-[10px] text-[20px] leading-[28px] font-bold">
                        Connect your Profile to an Organization
                      </h2>
                      <div className="flex flex-wrap gap-[8px]">
                        <button
                          onClick={connectToOrganization}
                          className="btn btn-theme border border-themecolor bg-themecolor text-white hover:text-themecolor hover:bg-transparent  flex items-center px-[20px] py-[8px] rounded-4"
                        >
                          Connect
                        </button>
                        <button className="btn btn-theme border border-themecolor bg-transparent text-themecolor hover:text-[#fff] hover:bg-themecolor flex items-center px-[20px] py-[8px] rounded-4">
                          Dismiss
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {mailOrganizationId ? (
                  <div className="activity-block bg-[#FAFAFA] p-4 mb-6 shadow-[#00000040] shadow-sm rounded-[10px] border border-[#4066b033]">
                    <h2 className="mb-[10px] text-[20px] leading-[28px] font-bold">
                      Verify Organization
                    </h2>
                    <div className="flex flex-wrap gap-[8px]">
                      <button
                        onClick={verifyMailCode}
                        className="btn btn-theme border border-themecolor bg-themecolor text-white hover:text-themecolor hover:bg-transparent  flex items-center px-[20px] py-[8px] rounded-4"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                <div className="activity-block bg-[#FAFAFA] p-4 mb-6 shadow-[#00000040] shadow-sm rounded-[10px] border border-[#4066b033]">
                  <h2 className="m-0 text-[20px] leading-[28px] font-bold mb-2.5">
                    Reward
                  </h2>
                  <p className="m-0 text-[16px] leading-[24px]">
                    {userData?.totalPayout} Celeix Coins
                  </p>
                </div>
                <div className="activity-block bg-[#FAFAFA] p-4 mb-6 shadow-[#00000040] shadow-sm rounded-[10px] border border-[#4066b033]">
                  <h2 className="m-0 text-[20px] leading-[28px] font-bold mb-2.5">
                    Documents Requested
                  </h2>
                  <p className="m-0 text-[16px] leading-[24px]">
                    Proof of Income Requested by Family Counseling Services
                  </p>
                </div>
                {isUserOwn?.success ? (
                  <div className="activity-block bg-[#FAFAFA] p-4 mb-6 shadow-[#00000040] shadow-sm rounded-[10px] border border-[#4066b033]">
                    <h2 className="m-0 text-[20px] leading-[28px] font-bold mb-2.5">
                      Go To Organization Page
                    </h2>
                    <button
                      onClick={gotToOrganizationPage}
                      className="btn btn-theme border border-themecolor bg-themecolor text-white hover:text-themecolor hover:bg-transparent  flex items-center px-[20px] py-[8px] rounded-4"
                    >
                      View Organization
                    </button>
                  </div>
                ) : (
                  <></>
                )}
                {applicationStatus.length > 0 ? (
                  <div className="activity-block bg-[#FAFAFA] p-4 mb-6 shadow-[#00000040] shadow-sm rounded-[10px] border border-[#4066b033]">
                    <h2 className="mb-[10px] text-[20px] leading-[28px] font-bold">
                      Application Status
                    </h2>
                    {applicationStatus.map((applicationStatus, index) => (
                      <>
                        <p> {applicationStatus?.organizationId?.name}</p>
                        {applicationStatus?.status === 0
                          ? "Pending Request"
                          : applicationStatus?.status === 1
                          ? "Approved"
                          : applicationStatus?.status === 2
                          ? "Rejected"
                          : "Unknown Status"}
                      </>
                    ))}
                  </div>
                ) : (
                  <>
                    <h2 className="mb-[10px] text-[20px] leading-[28px] font-bold">
                      No Application Status
                    </h2>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FileUploadModal isOpen={modalIsOpen} closeModal={closeModal} />
      <ConfirmationModal
        isOpen1={modalIsOpen1}
        closeModal1={closeModal1}
        connectedOrganization={connectedOrganization}
      />
    </Layout>
  );
};
export default Dashboard;
