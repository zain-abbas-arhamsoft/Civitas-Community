import React, { useState, useEffect } from "react";
import Image from "next/image";
import iconDots from "../../assets/images/icon-dots.png";
import Reload from "../../assets/images/reload.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Layout from "@/Layouts/layout3";
import clipboardCopy from "clipboard-copy";
import AddMemberModal from "./../../components/admin/add-member-modal";
import { getAdminUserCount } from "@/api/users";
import { isLoggedIn } from "../../helpers/authHelper";
import FullPageLoader from "@/components/fullPageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
function AdminManageTeam() {
  const router = useRouter();
  const currentUser = isLoggedIn();
  const [memberCount, setMemberCount] = useState(0);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [member, setMember] = useState([]);
  const [memberAdmin, setMemberAdmin] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [urlToCopy, setUrlToCopy] = React.useState("");
  const [loading, setLoading] = useState(true);
  const notify = () => toast.success("link Copied!", { autoClose: 200 });
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

  const getMemberCount = async () => {
    const res = await getAdminUserCount(currentUser);
    let { statusCode } = res;
    if (statusCode === 403) {
      router.push("/");
    }
    if (res && res?.statusCode === 200) {
      setMemberCount(res.adminUserCount);
      if (res.data) {
        const membersData = res.data.map((item) => item.user);
        setMember(membersData);
      }
      if (res.usersWithAdminRole) {
        const AdminsData = res.usersWithAdminRole.map((item) => item);
        setMemberAdmin(AdminsData);
      }
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setRefreshFlag(true);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  useEffect(() => {
    if (!currentUser || !currentUser?.token) {
      router.push("/");
    } else {
      getMemberCount();
    }
  }, []);

  useEffect(() => {
    if (refreshFlag) {
      setRefreshFlag(false);
      getMemberCount();
    }
  }, [refreshFlag]);

  return (
    <>
      {loading ? (
        <FullPageLoader />
      ) : (
        <>
          <Layout image={iconDots}>
            <div className="wrapper flex">
              <div className="bg-grey2">
                <div className="p-8">
                  <div className="hading-card py-[24px] px-[32px] flex items-center justify-between mb-[16px]">
                    <div>
                      <h2 className="text-themecolor text-[18px] mb-[16px] md:text-[24px] leading-[33px] font-[700]">
                        SolacePRO Admin Dashboard
                      </h2>
                      <p className="md:text-[16px] text-[13px] font-[400]">
                        You have admin access to manage your Solace Members,
                        view data analytics, and distribute rewards to
                        organizations.
                      </p>
                    </div>
                    <span className="icon-dots">
                      <Image src={iconDots} width="44" height-="44" alt="" />
                    </span>
                  </div>

                  <div className="p-[24px] flex flex-col justify-center flex-wrap">
                    <div className="flex gap-[24px] flex-wrap xl:flex-nowrap mb-[24px]">
                      <div className="p-[16px] md:py-[24px] md:px-[32px] rounded-[16px] bg-white shadow-[#00000040] shadow-sm xxl:w-[18%] xl:w-[25%] w-[100%] flex-wrap ">
                        <strong className="lg:text-[24px] md:text-[18px] text-[14px] font-[700] block mb-[10px] text-themecolor">
                          {memberCount} Solace Members Admin
                        </strong>
                        {memberAdmin.map((member) => (
                          <div key={member.id} className="mb-[16px]">
                            <div className="p-[16px] px-[24px] rounded-[16px] bg-[#FAFAFA] border border-[#4066b033] shadow-[#00000040] shadow-sm flex w-full justify-between items-center">
                              <div className="flex items-center flex-wrap">
                                <div className="me-2 w-[64px] h-[64px] object-fill rounded-[100%] overflow-hidden">
                                  {member?.image ? (
                                    <Image
                                      className="w-full h-full rounded-[100%] overflow-hidden"
                                      src={`${process.env.CLOUDINARY_IMAGE_URL}${member.image}`}
                                      alt="avatar"
                                      height={120}
                                      width={60}
                                    />
                                  ) : (
                                    <Image src={Reload} alt="reload" />
                                  )}
                                </div>
                                <span className="text-[14px] lg:text-[16px] font-[400]">
                                  {member.username}
                                </span>
                              </div>
                              <div>
                                <FontAwesomeIcon
                                  icon={faEllipsis}
                                  className="md:text-[24px] text-[18px] text-[#000]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className=" flex-wrap xxl:w-[88%] w-[100%] xl:w-[75%]">
                        <div className="p-[16px] md:py-[24px] md:px-[32px] rounded-[16px] bg-white shadow-[#00000040] shadow-sm  mb-[16px] min-h-[65px] flex-wrap">
                          <div className="flex justify-between flex-wrap mb-[10px]">
                            <h2 className="text-[16px] md:text-[24px] text-themecolor leading-[33px] font-bold">
                              Invite Users to be a SolacePro Member
                            </h2>
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
                          <p className="m-0 lg:text-[16px] text-[14px] font-[400] leading-[24px]">
                            Copy link and send it to your wanted members of the
                            organization. After the link is received, the user
                            creates an account, it can be seen and managed under
                            this main admin account.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[16px] md:text-[20px] mb-[22px] leading-[33px] font-bold">
                        Your team will have access to:
                      </h2>
                      <div className="flex flex-wrap xl:flex-nowrap mb-[80px]">
                        <div className="py-[8px] px-[25px] xl:border-r-[1px] xl:border-[#000]">
                          <span className="m-0 lg:text-[16px] text-themecolor text-[13px] leading-[24px] font-500 block mb-[12px]">
                            Instant Access to{" "}
                            <strong className="text-themecolor">Funding</strong>
                          </span>
                          <p className="m-0 lg:text-[15px] text-[13px] leading-[24px] font-500">
                            This will give the user access to managing Grants,
                            Reports, and Applications. This should be paired
                            with access to the wallet and explorer.{" "}
                          </p>
                        </div>
                        <div className="py-[8px] px-[25px] xl:border-r-[1px] xl:border-[#000]">
                          <span className="m-0 lg:text-[16px] text-[13px] leading-[24px] font-500 block mb-[12px] text-themecolor">
                            Ai assisted{" "}
                            <strong className="text-themecolor">
                              Grant Searches
                            </strong>
                          </span>
                          <p className="m-0 lg:text-[15px] text-[13px] leading-[24px] font-500">
                            This will give the user access to managing Grants,
                            Reports, and Applications. This should be paired
                            with access to the wallet and explorer.{" "}
                          </p>
                        </div>
                        <div className="py-[8px] px-[25px]">
                          <span className="m-0 lg:text-[16px] text-[13px] leading-[24px] font-500 block mb-[12px] text-themecolor">
                            Tracking & Reporting of{" "}
                            <strong className="text-themecolor">Grants</strong>
                          </span>
                          <p className="m-0 lg:text-[15px] text-[13px] leading-[24px] font-500">
                            This will give the user access to managing Grants,
                            Reports, and Applications. This should be paired
                            with access to the wallet and explorer.{" "}
                          </p>
                        </div>
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
export default AdminManageTeam;
