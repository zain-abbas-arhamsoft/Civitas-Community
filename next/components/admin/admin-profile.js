import React, { useState, useEffect } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import AvatarCircleImg from "../../assets/images/avatar.png";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useContractWrite, useContractRead } from "wagmi";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import distributeRewardsContractABI from "../../config/abis/distruteRewardsAbi.json";
import tokenABI from "../../config/abis/contractAbi.json";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import Layout from "@/Layouts/layout3";
import PersonAvatar from "../../assets/images/person-avatar.png";
import { isLoggedIn } from "../../helpers/authHelper";
import clipboardCopy from "clipboard-copy";
import Swal from "sweetalert2";
library.add(faGoogle);
import {
  getAdminUserCount,
  getUserData,
  getRewardDetails,
  updateUserReward,
  updateUserRewardAll,
} from "@/api/users";
import AddMemberModal from "./add-member-modal";
import FullPageLoader from "@/components/fullPageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminProfilePage() {
  const currentUser = isLoggedIn();
  const [memberCount, setMemberCount] = useState(0);
  const [member, setMember] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    image: "",
    email: "",
    phone: "",
  });
  const [userPendingReward, setUserPendingReward] = useState([]);
  const [userRecivedReward, setUserRecivedReward] = useState([]);
  const [allUser, setAllUser] = useState(false);
  const [totalRecievedReward, setTotalRecievedReward] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [urlToCopy, setUrlToCopy] = React.useState("");
  const [userRewardId, SetUserRewardId] = useState("");
  const router = useRouter();

  const [approveTokenAmt, setApprovedTokenAmt] = useState(0);

  const [_recipients, setRecipients] = useState([]);
  const [_amounts, setAmounts] = useState([]);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  const { disconnect } = useDisconnect();

  const notify = () => toast.success("link Copied!", { autoClose: 200 });

  const createRewards = async () => {
    if (_recipients === "") {
      Swal.fire(
        "Oops",
        `Wallet Address: ${_recipients || "Not Connected"}`,
        "error"
      ).then(() => {
        Swal.fire({
          title: "Connect Wallet",
          text: "Please go to your profile and connect with your wallet address.",
          icon: "info",
        });
      });
      return;
    }

    setLoading(true);
    isApprovedFn(_amounts);
  };

  // Get the approved usdt amount from usdt contract
  const { data } = useContractRead({
    contracts: [
      {
        address: process.env.TOKEN_CONTRACT_ADDRESS,
        abi: tokenABI,
        functionName: "allowance",
        args: [
          "0x28FB7720CA68a7F674e38629533F13dd64197857",
          "0xF17b1488eEddEEc4404579AE6436c2E10d41fC7e",
        ],
        onError(error) {
          console.log(error)
        },
        onSuccess(data) {
          setApprovedTokenAmt(data);
        },
      },
    ],
  });
  const GiveReward = async () => {
    if (!isConnected) connect();
    else {
      createRewards();
    }
  };

  // Deposit Fund useContractWrite hook
  const { write: distributeRewardsFn } = useContractWrite({
    address: "0xF17b1488eEddEEc4404579AE6436c2E10d41fC7e",
    abi: distributeRewardsContractABI,
    functionName: "distributeRewards",
    args: [[_recipients], [_amounts]],
    onError(error) {
      setLoading(false);
    },
    onSuccess: async (data) => {
      if (allUser) {
        const response = await updateUse
        rRewardAll(currentUser);
        if (response.success === true) {
          setRefreshFlag(true);
          setLoading(true);
        }
      } else {
        const response = await updateUserReward(currentUser, {
          rewardId: userRewardId,
          status: 1,
        });
        if (response.success === true) {
          setRefreshFlag(true);
          setLoading(true);
        }
      }
      // After confirmation, you can perform additional actions
      disconnect();
      return data;
    },
  });

  // getApproval token contract useCreateHook
  const { write: ApprovalFn } = useContractWrite({
    address: "0xaCF9Ba88cf9a29D26aE47e4ad2D0C9fA68e4c600",
    abi: tokenABI,
    functionName: "approve",
    args: [
      "0xF17b1488eEddEEc4404579AE6436c2E10d41fC7e",
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
    ],
    from: address,
    onError(error) {
      console.log(error);
      setLoading(false);
    },

    onSuccess: async () => {
      const receiveHash = await distributeRewardsFn();
      return receiveHash;
    },
  });

  // if check whether approved amount is greater than token amount
  const isApprovedFn = async (amountToBeApproved) => {
    if (amountToBeApproved === null) {
      return;
    }
    if (parseFloat(amountToBeApproved) > parseFloat(approveTokenAmt)) {
      ApprovalFn();
    } else {
      distributeRewardsFn();
    }
  };
  useEffect(() => {
    if (isConnected) {
      createRewards();
    }
  }, [isConnected]);

  useEffect(() => {
    // This code will run only in the browser
    setUrlToCopy(window.location.href);
  }, []);

  const handleCopy = () => {
    clipboardCopy(urlToCopy)
      .then(() => {
        notify();
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  const getUser = async () => {
    let res = await getUserData(currentUser);
    if (res) {
      let { statusCode, userData } = res;
      if (statusCode === 403) {
        router.push("/");
      }
      if (statusCode === 200) {
        setUserData({
          username: userData?.username,
          image: userData?.image,
          email: userData?.email,
          phone: userData?.phone,
        });
        return;
      }
    }
  };

  const getReward = async () => {
    const res = await getRewardDetails(currentUser);
    if (res) {
      let {
        statusCode,
        rewardDeatilsPending,
        rewardDeatilsRecieved,
        totalRecievedReward,
      } = res;
      if (statusCode === 403) {
        router.push("/");
      }
      if (statusCode === 200) {
        setUserPendingReward(rewardDeatilsPending);
        setUserRecivedReward(rewardDeatilsRecieved);
        setTotalRecievedReward(totalRecievedReward[0]?.totalMoney);
        return;
      }
    }
  };

  const handleTeamClick = () => {
    router.push("/admin/manage-team");
  };

  const acceptReward = async (A) => {
    setAmounts(A.payoutAmount);
    setRecipients(A.userInfo.wallet);
    setAllUser(false);
    SetUserRewardId(A._id);
    GiveReward();
  };

  const acceptAll = async () => {
    const _recipients = [];
    const _amounts = [];
    for (const item of userPendingReward) {
      const { userInfo, payoutAmount } = item;
      _recipients.push(userInfo.wallet);
      _amounts.push(payoutAmount);
    }
    setAmounts(_amounts);
    setRecipients(_recipients);

    setAllUser(true);
    GiveReward();
  };

  const rejectReward = async (A) => {
    setRefreshFlag(true);
    const response = await updateUserReward(currentUser, {
      rewardId: A,
      status: 2,
    });
    if (response.success === true) {
      setRefreshFlag(true);
      setLoading(true);
    }
  };
  const handleViewOrgClick = () => {
    router.push("/admin/viewing-org");
  };
  const getMemberCount = async () => {
    const res = await getAdminUserCount(currentUser);
    let { statusCode } = res;
    if (statusCode === 403) {
      router.push("/");
    }
    if (res && res?.statusCode === 200 && res?.data) {
      setMemberCount(res.adminUserCount);
      if (res.data) {
        const A = res.data.map((item) => item.user);
        setMember(A);
      }
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setLoading(true);
    setRefreshFlag(true);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  useEffect(() => {
    if (!currentUser || !currentUser?.token) {
      router.push("/");
    } else {
      getUser();
      getMemberCount();
      getReward();
    }
  }, []);

  useEffect(() => {
    if (refreshFlag) {
      setRefreshFlag(false);
      getUser();
      getMemberCount();
      getReward();
    }
  }, [refreshFlag]);

  return (
    <>
      {loading ? (
        <FullPageLoader />
      ) : (
        <>
          <Layout>
            {/* Wrapper to hold the entire admin profile section */}
            <div className="wrapper flex">
              {/* Sidebar section for admin profile */}
              <div className=" w-full">
                {/* Heading section for the admin profile */}
                <div className="hading-card lg:py-[24px] lg:px-[32px] py-[15px] px-[20px] flex flex-col justify-center">
                  {/* Title and description for the profile section */}
                  <h2 className="text-[18px] md:text-[24px] leading-[33px] font-bold text-themecolor">
                    My SolacePRO Profile
                  </h2>
                  {/* Section description and options */}
                  <div className="flex justify-between items-center">
                    {/* Details and additional options */}
                    <p className="m-0 lg:text-[18px] text-[16px] leading-[24px]">
                      You have admin access to manage your Solace users, view
                      data analytics, and distribute rewards to organizations
                    </p>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap lg:flex-nowrap gap-[32px]">
                    <div className="w-full lg:w-[73%]">
                      <div className="lg:py-[24px] lg:px-[32px] py-[15px] px-[20px] rounded-[16px] bg-white shadow-[#00000040] shadow-sm flex flex-col justify-center mb-[16px]">
                        <h2 className="text-themecolor text-[18px] mb-[16px] md:text-[24px] leading-[33px] font-[700]">
                          Manage Team
                        </h2>
                        <div className="flex gap-[24px] flex-wrap xl:flex-nowrap">
                          <div
                            className="p-[16px] rounded-[4px] bg-[#FAFAFA] shadow-[#00000040] shadow-sm flex flex-col justify-center xl:w-[50%] w-[100%] border border-[#4066b033]"
                            onClick={handleTeamClick}
                          >
                            <strong className="lg:text-[20px] md:text-[16px] text-[14px]  font-[700]">
                              {memberCount} Solace Members
                            </strong>
                          </div>
                          <div className="p-[16px] rounded-[px] shadow-[#00000040] shadow-sm flex flex-col justify-center xl:w-[50%] w-[100%]  flex-wrap bg-[#FAFAFA] border border-[#4066b033]">
                            <div className="flex justify-between items-center flex-wrap">
                              <strong className="lg:text-[20px] md:text-[16px] text-[14px]  font-[700]">
                                Invite{" "}
                              </strong>
                              <div className="flex gap-[8px] flex-wrap">
                                <button
                                  className="rounded-[4px] py-[8px] px-[20px] border-[1px] border-[solid] text-white border-themecolor bg-themecolor hover:bg-transparent hover:text-themecolor"
                                  onClick={openModal}
                                >
                                  Add Member
                                </button>
                                <button
                                  className="rounded-[4px] py-[8px] px-[20px] text-themecolor bg-transparent border-[1px] border-[solid] border-themecolor hover:bg-themecolor hover:text-[#fff]"
                                  onClick={handleCopy}
                                >
                                  Get Link
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:py-[24px] lg:px-[32px] py-[15px] px-[20px] rounded-[16px] bg-white shadow-[#00000040] shadow-sm flex flex-col justify-center flex-wrap">
                        <div className="flex flex-wrap justify-between items-center mb-[24px]">
                          <h2 className="text-themecolor text-[18px] mb-[16px] md:text-[24px] leading-[33px] font-[700]">
                            Distribute Rewards to Users
                          </h2>
                          <button
                            className="py-[8px] px-[20px] border-[1px] border-[solid] border-themecolor text-[16px] font-[500] text-themecolor hover:bg-themecolor rounded-[4px] hover:text-[#fff]"
                            onClick={handleViewOrgClick}
                          >
                            Manage Organizations
                          </button>
                        </div>
                        <div className="flex gap-[24px] flex-wrap xl:flex-nowrap ">
                          <div
                            className="sm:p-[16px] p-[10px] rounded-[16px] bg-[#FAFAFA] border border-[#4066b033] shadow-[#00000040] shadow-sm 
                        
                          h-full flex flex-col  xxl:w-[18%] xl:w-[25%] w-[100%] flex-wrap "
                          >
                            <div className="flex justify-center mb-[18px]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="70"
                                height="71"
                                viewBox="0 0 70 71"
                                fill="none"
                              >
                                <g clip-path="url(#clip0_2577_15421)">
                                  <path
                                    d="M22.3563 39.9508C23.2859 39.9508 24.2266 39.9398 25.1344 39.907L25.4187 39.8961L25.3422 39.6227C24.8281 37.6867 24.5656 35.6633 24.5656 33.607C24.5656 32.2289 24.6859 30.8836 24.9047 29.6039L24.9484 29.3523L24.6859 29.3414C23.9531 29.3195 23.1766 29.3086 22.3453 29.3086C9.55938 29.3086 0 32.1195 0 34.6352C0 37.1398 9.55938 39.9508 22.3563 39.9508Z"
                                    fill="url(#paint0_linear_2577_15421)"
                                  />
                                  <path
                                    d="M7.75469 48.1207C11.8891 49.0285 17.0734 49.5316 22.3563 49.5316C24.9484 49.5316 27.5078 49.4113 29.9688 49.1707L30.3953 49.127L30.1219 48.7988C28.3627 46.7304 26.9817 44.3683 26.0422 41.8207L25.9875 41.6676L25.8234 41.6785C24.6969 41.7223 23.5266 41.7441 22.3563 41.7441C12.7094 41.7441 4.06875 40.1582 0.35 37.7082L0 37.4785V44.227C0 45.0363 1.62969 46.7754 7.75469 48.1207Z"
                                    fill="url(#paint1_linear_2577_15421)"
                                  />
                                  <path
                                    d="M32.0469 50.8334L31.9703 50.7568L31.8609 50.7678C28.9078 51.1287 25.7141 51.3146 22.3563 51.3146C16.9094 51.3146 11.5938 50.8006 7.37187 49.86C5.25 49.4006 2.31875 48.5803 0.35 47.3115L0 47.0928V53.7975C0 56.0178 8.50938 59.1021 22.3563 59.1021C29.925 59.1021 36.7281 58.1615 41.0266 56.5209L41.6281 56.2912L41.0156 56.0943C37.6906 55.0553 34.5953 53.2396 32.0469 50.8334Z"
                                    fill="url(#paint2_linear_2577_15421)"
                                  />
                                  <path
                                    d="M48.1797 11.7754C36.1484 11.7754 26.3594 21.5645 26.3594 33.6066C26.3594 45.6379 36.1484 55.427 48.1797 55.427C60.2109 55.427 70 45.6379 70 33.6066C70 21.5754 60.2109 11.7754 48.1797 11.7754Z"
                                    fill="url(#paint3_linear_2577_15421)"
                                  />
                                  <path
                                    d="M51.0009 32.4548L53.6155 30.9806C53.7991 30.8773 54.0254 30.8773 54.209 30.9806L55.73 31.8384C55.9136 31.9417 56.1399 31.9417 56.3235 31.8384L58.2558 30.7487C58.4393 30.6454 58.5528 30.4535 58.5528 30.2463V28.0669C58.5528 27.8598 58.44 27.6685 58.2558 27.5646L56.3235 26.4749C56.1399 26.3716 55.9136 26.3716 55.73 26.4749L54.1791 27.3491C53.9956 27.4524 53.7692 27.4524 53.5857 27.3491L51.0002 25.8914C50.8167 25.7881 50.7032 25.5961 50.7032 25.389V23.6582C50.7032 23.451 50.5903 23.2597 50.4061 23.1558L48.4751 22.0667C48.2916 21.9634 48.0652 21.9634 47.8816 22.0667L45.9494 23.1564C45.7658 23.2597 45.6523 23.4516 45.6523 23.6588V25.3909C45.6523 25.598 45.5395 25.7894 45.3552 25.8933L42.7698 27.351C42.5863 27.4543 42.3599 27.4543 42.1763 27.351L40.6255 26.4768C40.4419 26.3735 40.2155 26.3735 40.032 26.4768L38.101 27.5652C37.9175 27.6685 37.804 27.8604 37.804 28.0676V30.247C37.804 30.4541 37.9168 30.6454 38.101 30.7493L39.637 31.6154C39.8205 31.7187 39.934 31.9106 39.934 32.1178V35.0751C39.934 35.2823 39.8212 35.4736 39.637 35.5775L38.101 36.4436C37.9175 36.5469 37.804 36.7388 37.804 36.946V39.1254C37.804 39.3325 37.9168 39.5238 38.101 39.6278L40.0333 40.7174C40.2168 40.8207 40.4432 40.8207 40.6268 40.7174L42.1705 39.847C42.3541 39.7437 42.5804 39.7437 42.764 39.847L45.3565 41.3092C45.5401 41.4124 45.6536 41.6044 45.6536 41.8116V43.5436C45.6536 43.7508 45.7665 43.9421 45.9507 44.046L47.8829 45.1357C48.0665 45.239 48.2929 45.239 48.4764 45.1357L50.4087 44.046C50.5922 43.9428 50.7058 43.7508 50.7058 43.5436V41.8116C50.7058 41.6044 50.8186 41.4131 51.0028 41.3092L53.5954 39.847C53.7789 39.7437 54.0053 39.7437 54.1889 39.847L55.7326 40.7174C55.9162 40.8207 56.1425 40.8207 56.3261 40.7174L58.2584 39.6278C58.4419 39.5245 58.5554 39.3325 58.5554 39.1254V36.946C58.5554 36.7388 58.4426 36.5475 58.2584 36.4436L56.3261 35.3539C56.1425 35.2506 55.9162 35.2506 55.7326 35.3539L54.2044 36.2155C54.0209 36.3188 53.7945 36.3188 53.611 36.2155L51.0035 34.7451C50.8199 34.6418 50.7064 34.4498 50.7064 34.2427V32.9572C50.7064 32.7501 50.8193 32.5587 51.0035 32.4548H51.0009ZM53.2049 39.1703L50.6052 40.6363C50.4217 40.7396 50.1953 40.7396 50.0117 40.6363L48.8721 39.9933C48.6885 39.89 48.575 39.6981 48.575 39.4909V36.5583C48.575 36.3511 48.6879 36.1598 48.8721 36.0559L50.0117 35.4128C50.1953 35.3096 50.4217 35.3096 50.6052 35.4128L53.2049 36.8788C53.3885 36.9821 53.502 37.1741 53.502 37.3812V38.6667C53.502 38.8738 53.3891 39.0652 53.2049 39.1691V39.1703ZM53.2049 30.3179L50.6046 31.7839C50.421 31.8872 50.1946 31.8872 50.0111 31.7839L48.8714 31.1415C48.6879 31.0382 48.5744 30.8463 48.5744 30.6391V27.7065C48.5744 27.4993 48.6872 27.308 48.8714 27.2041L50.0111 26.5617C50.1946 26.4584 50.421 26.4584 50.6046 26.5617L53.2049 28.0277C53.3885 28.1309 53.502 28.3229 53.502 28.5301V29.8155C53.502 30.0227 53.3891 30.214 53.2049 30.3179ZM47.7824 27.7071V30.6397C47.7824 30.8469 47.6695 31.0382 47.4853 31.1421L46.3476 31.7839C46.1641 31.8878 45.9377 31.8872 45.7535 31.7839L43.1519 30.3147C42.9683 30.2108 42.8554 30.0195 42.8554 29.813V28.532C42.8554 28.3248 42.9683 28.1335 43.1525 28.0296L45.7529 26.5636C45.9364 26.4603 46.1628 26.4603 46.3463 26.5636L47.486 27.206C47.6695 27.3092 47.7831 27.5012 47.7831 27.7084L47.7824 27.7071ZM42.7452 30.9781L45.3559 32.4523C45.5395 32.5562 45.6523 32.7475 45.6523 32.9541V34.2211C45.6523 34.4296 45.5375 34.6222 45.3527 34.7248L42.7082 36.1952C42.5253 36.2972 42.3002 36.2966 42.118 36.1933L41.0224 35.5756C40.8389 35.4724 40.7254 35.2804 40.7254 35.0732V32.1159C40.7254 31.9087 40.8382 31.7174 41.0224 31.6135L42.151 30.9768C42.3346 30.8729 42.561 30.8735 42.7452 30.9768V30.9781ZM43.1551 36.8376L45.7366 35.4021C45.9196 35.3001 46.1446 35.3007 46.3269 35.404L47.4853 36.0571C47.6689 36.1604 47.7824 36.3524 47.7824 36.5595V39.4922C47.7824 39.6993 47.6695 39.8907 47.4853 39.9946L46.3457 40.6376C46.1621 40.7409 45.9358 40.7409 45.7522 40.6376L43.1525 39.1716C42.969 39.0683 42.8554 38.8764 42.8554 38.6692V37.3426C42.8554 37.1341 42.9703 36.9415 43.1551 36.8389V36.8376Z"
                                    fill="url(#paint4_linear_2577_15421)"
                                  />
                                </g>
                                <defs>
                                  <linearGradient
                                    id="paint0_linear_2577_15421"
                                    x1="12.7094"
                                    y1="29.3086"
                                    x2="12.7094"
                                    y2="39.9508"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stop-color="#406AB3" />
                                    <stop offset="1" stop-color="#81D2E8" />
                                  </linearGradient>
                                  <linearGradient
                                    id="paint1_linear_2577_15421"
                                    x1="15.1977"
                                    y1="37.4785"
                                    x2="15.1977"
                                    y2="49.5316"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stop-color="#406AB3" />
                                    <stop offset="1" stop-color="#81D2E8" />
                                  </linearGradient>
                                  <linearGradient
                                    id="paint2_linear_2577_15421"
                                    x1="20.8141"
                                    y1="47.0928"
                                    x2="20.8141"
                                    y2="59.1021"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stop-color="#406AB3" />
                                    <stop offset="1" stop-color="#81D2E8" />
                                  </linearGradient>
                                  <linearGradient
                                    id="paint3_linear_2577_15421"
                                    x1="48.1797"
                                    y1="11.7754"
                                    x2="48.1797"
                                    y2="55.427"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stop-color="#406AB3" />
                                    <stop offset="1" stop-color="#81D2E8" />
                                  </linearGradient>
                                  <linearGradient
                                    id="paint4_linear_2577_15421"
                                    x1="50.3005"
                                    y1="48.4335"
                                    x2="48.3428"
                                    y2="26.5493"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stop-color="#294C8F" />
                                    <stop offset="1" stop-color="#81D2E8" />
                                  </linearGradient>
                                  <clipPath id="clip0_2577_15421">
                                    <rect
                                      width="70"
                                      height="70"
                                      fill="white"
                                      transform="translate(0 0.444336)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                              <strong className="lg:text-[20px] md:text-[16px] text-[14px]  font-[700] block w-[180px] text-center">
                                {totalRecievedReward} Rewards Given
                              </strong>
                              <span className="lg:text-[14px] md:text-[13px] text-[12px]  font-[700] block mb-[16px] text-center text-themecolor">
                                Top Active Users
                              </span>
                            </div>

                            {userRecivedReward &&
                              userRecivedReward
                                .slice(0, 4)
                                .map((data, index) => (
                                  <div className="flex justify-between items-center mb-[16px] flex-wrap">
                                    <div className="flex items-center">
                                      <div className="me-2">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="28"
                                          height="29"
                                          viewBox="0 0 28 29"
                                          fill="none"
                                        >
                                          <circle
                                            cx="13.8604"
                                            cy="14.3047"
                                            r="11.3604"
                                            stroke="#81D2E8"
                                            stroke-width="5"
                                          />
                                          <circle
                                            cx="22.7653"
                                            cy="5.67714"
                                            r="3.18788"
                                            fill="#4066B0"
                                          />
                                        </svg>
                                      </div>
                                      <span className=" text-[14px] lg:text-[16px]  font-[400]">
                                        {data.userInfo.username}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                          </div>
                          <div className=" flex-wrap xxl:w-[88%] w-[100%] xl:w-[75%]">
                            {userPendingReward &&
                              userPendingReward
                                .slice(0, 4)
                                .map((data, index) => (
                                  <div className="p-[16px] rounded-[16px] bg-[#9747ff26] shadow-[#00000040] shadow-sm flex justify-between   mb-[12px] min-h-[65px] flex-wrap">
                                    <div className="flex sm:gap-[80px] gap-[20px] flex-wrap">
                                      <div className="flex items-center">
                                        <div className="w-[25px] h-[25px] me-2 mb-2 lg:mb-0">
                                          {data.userInfo?.image ? (
                                            <Image
                                              className="w-full h-full rounded-[100%] overflow-hidden"
                                              src={`${process.env.CLOUDINARY_IMAGE_URL}${data.userInfo.image}`}
                                              alt="avatar"
                                              height={120}
                                              width={60}
                                            />
                                          ) : (
                                            <Image
                                              src={AvatarCircleImg}
                                              className="w-full h-full"
                                              alt="Avatar"
                                            />
                                          )}
                                        </div>
                                        <span className=" text-[14px] lg:text-[16px]  font-[400]">
                                          {data.userInfo.username}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className=" text-[14px] lg:text-[16px]  font-[400]">
                                          {data.actionPerformed}{" "}
                                          <strong>{data.payoutAmount}</strong>
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex gap-[16px]">
                                      <div onClick={() => acceptReward(data)}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="25"
                                          viewBox="0 0 24 25"
                                          fill="none"
                                        >
                                          <path
                                            d="M12 1.96777C5.94107 1.96777 1.02368 6.88516 1.02368 12.9441C1.02368 19.003 5.94107 23.9204 12 23.9204C18.0589 23.9204 22.9763 19.003 22.9763 12.9441C22.9763 6.88516 18.0589 1.96777 12 1.96777ZM12 21.7251C7.15944 21.7251 3.21895 17.7846 3.21895 12.9441C3.21895 8.10354 7.15944 4.16304 12 4.16304C16.8406 4.16304 20.7811 8.10354 20.7811 12.9441C20.7811 17.7846 16.8406 21.7251 12 21.7251ZM16.2588 8.87188L9.80474 15.326L7.74119 13.2624C7.53596 13.0572 7.2576 12.9419 6.96736 12.9419C6.67711 12.9419 6.39876 13.0572 6.19353 13.2624C5.9883 13.4676 5.873 13.746 5.873 14.0362C5.873 14.3265 5.9883 14.6048 6.19353 14.8101L9.03639 17.6529C9.46447 18.081 10.156 18.081 10.5841 17.6529L17.8174 10.4195C17.9192 10.318 17.9999 10.1974 18.055 10.0646C18.1101 9.93181 18.1384 9.78946 18.1384 9.64571C18.1384 9.50195 18.1101 9.35961 18.055 9.22683C17.9999 9.09404 17.9192 8.97342 17.8174 8.87188C17.3894 8.4438 16.6869 8.4438 16.2588 8.87188Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </div>
                                      <div
                                        onClick={() => rejectReward(data._id)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="25"
                                          viewBox="0 0 24 25"
                                          fill="none"
                                        >
                                          <path
                                            d="M19.2015 7.26499C19.3968 7.06973 19.3968 6.75315 19.2015 6.55789L18.3868 5.7432C18.1916 5.54794 17.875 5.54794 17.6797 5.7432L12.3536 11.0693C12.1584 11.2646 11.8418 11.2646 11.6465 11.0693L6.32041 5.7432C6.12515 5.54794 5.80857 5.54794 5.61331 5.7432L4.79862 6.55789C4.60336 6.75315 4.60336 7.06973 4.79862 7.26499L10.1247 12.5911C10.32 12.7864 10.32 13.1029 10.1247 13.2982L4.79862 18.6243C4.60336 18.8196 4.60336 19.1361 4.79862 19.3314L5.61331 20.1461C5.80857 20.3414 6.12515 20.3414 6.32041 20.1461L11.6465 14.82C11.8418 14.6247 12.1584 14.6247 12.3536 14.82L17.6797 20.1461C17.875 20.3414 18.1916 20.3414 18.3868 20.1461L19.2015 19.3314C19.3968 19.1361 19.3968 18.8196 19.2015 18.6243L13.8754 13.2982C13.6802 13.1029 13.6802 12.7864 13.8754 12.5911L19.2015 7.26499Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            {userPendingReward &&
                              userPendingReward?.length > 1 && (
                                <div className="flex justify-end">
                                  <button
                                    className="py-[8px] px-[20px] text-white bg-themecolor text-[16px] font-[400] hover:bg-[transparent] hover:text-themecolor rounded-[4px] border-[1px] border-[solid] border-themecolor"
                                    onClick={() => acceptAll()}
                                  >
                                    Approve all
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-[27%]">
                      <div className="lg:py-[16px] lg:px-[24px] py-[18px] px-[10px] rounded-[16px] bg-white shadow-[#00000040] flex-wrap shadow-sm flex gap-[24px] justify-center mb-[16px]">
                        <div className="w-[100px] h-[100px] overflow-hidden object-cover rounded-[100%]">
                          {userData?.image ? (
                            <Image
                              className="w-full h-full rounded-[100%] overflow-hidden"
                              src={`${process.env.CLOUDINARY_IMAGE_URL}${userData.image}`}
                              alt="avatar"
                              width={300}
                              height={200}
                            />
                          ) : (
                            <Image
                              className="w-full h-full rounded-[100%] overflow-hidden"
                              src={PersonAvatar}
                              alt="avatar"
                            />
                          )}
                        </div>
                        <div>
                          <strong className="lg:text-[20px] md:text-[16px] text-[14px]  font-[700] block mb-[10px] text-black">
                            {userData?.username ? (
                              <>{userData.username}</>
                            ) : (
                              <></>
                            )}
                          </strong>
                          <span className="lg:text-[13px] md:text-[16px] text-[12px]  font-[400] block mb-[10px] text-black">
                            Email:{" "}
                            {userData?.email ? <>{userData.email}</> : <></>}
                          </span>
                          <span className="lg:text-[13px] md:text-[16px] text-[12px]  font-[400] block mb-[10px] text-black">
                            Phone:{" "}
                            {userData?.phone ? <>{userData.phone}</> : <></>}
                          </span>
                        </div>
                        <div>
                          <FontAwesomeIcon icon={faEllipsis} />
                        </div>
                      </div>
                      <div className="lg:py-[24px] lg:px-[32px] py-[15px] px-[20px] rounded-[16px] h-auto lg:h-full justify-start bg-white shadow-[#00000040] shadow-sm flex flex-col mb-[16px]">
                        <div className="flex justify-between flex-wrap gap-[4px]">
                          <div>
                            <h2 className="text-themecolor text-[18px] mb-[16px] md:text-[24px] leading-[33px] font-[700]">
                              Notifications
                            </h2>
                          </div>
                        </div>
                        {userPendingReward &&
                          userPendingReward.map((data, index) => (
                            <div className="p-[16px] mt-[24px] px-[24px] rounded-[16px] bg-[#FAFAFA] border border-[#4066b033] shadow-[#00000040] shadow-sm flex flex-col flex-wrap ">
                              <strong className="lg:text-[20px] md:text-[16px] text-[14px]  font-[700] block mb-[10px] text-black">
                                Rewards Need to be Approved
                              </strong>
                              <p className="md:text-[16px] text-[13px] font-[400] text-black">
                                +{data.payoutAmount} {"  "}
                                {data.actionPerformed} to
                                {"  "}
                                {data.userInfo.username}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ToastContainer />
            <AddMemberModal
              isOpen={modalIsOpen}
              closeModal={closeModal}
              member={member}
            />
          </Layout>
        </>
      )}
    </>
  );
}
export default AdminProfilePage;
