import Layout from "@/Layouts/layout2";
import { faEllipsis, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { getOrganizationServerSideProps } from "@/components/ServerSideRendering/OrganizationProps";
import { useEffect, useState } from "react";
import {
  countOrganizationMembers,
  checkApplicationStatus,
  UpdateUserApplicationStatus,
} from "@/api/organizations";

import Link from "next/link";
import { isLoggedIn } from "@/helpers/authHelper";
import FullPageLoader from "@/components/fullPageLoader";

function OrgUserOverview({ organizations }) {
  const [countMembers, setCountMembers] = useState(0);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loaded, setLoading] = useState(true);
  const user = isLoggedIn();
  const [userMembers, setUserMembers] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [userApplications, setUserApplications] = useState([]);

  const getMembers = async () => {
    setLoading(true);
    const obj = {
      organizationId: organizations?._doc?._id,
      userId: user?.userId,
    };
    const response = await countOrganizationMembers(user, obj);
    const checkStatusResponse = await checkApplicationStatus(user, obj);
    const { memberCount, users, pendingRequest } = response;
    if (checkStatusResponse) {
      const { getStatus } = checkStatusResponse;
      setUserApplications(getStatus);
    }
    setUserMembers(users);
    setPendingUsers(pendingRequest);
    setLoading(false);

    setCountMembers(memberCount);
  };

  useEffect(() => {
    if (!user || !user?.token) {
      router.push("/");
    } else {
      getMembers();
    }
  }, []);

  useEffect(() => {
    if (refreshFlag) {
      setRefreshFlag(false);
      getMembers();
    }
  }, [refreshFlag]);
  const getLink = () => {
    const referralLink = `http://localhost:3000/connect-organization?referralCode=${organizations?._doc?.referralCode}`;
    // Create a temporary input element to copy the link to the clipboard
    const tempInput = document.createElement("input");
    tempInput.value = referralLink;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    // Notify the user that the link has been copied
  };

  const submitApprove = async (member) => {
    const obj = {
      appId: member._id,
      status: 1,
    };

    var response = await UpdateUserApplicationStatus(user, obj);
    if (response) {
      var { statusCode } = response;
      if (statusCode === 200) {
        setRefreshFlag(true);
        Swal.fire("Good job!", "Status Updated", "success");
      } else if (statusCode === 401) {
        Swal.fire("Oops...", "Please go to login page", "error");
      } else if (statusCode === 500) {
        Swal.fire("Oops...", `${response?.message}`, "error");
      } else if (statusCode === 400) {
        Swal.fire("Oops...", `${response?.message}`, "error");
      }
    }
  };

  const submitReject = async (member) => {
    const obj = {
      appId: member._id,
      status: 2,
    };
    var response = await UpdateUserApplicationStatus(user, obj);

    if (response) {
      var { statusCode } = response;
      if (statusCode === 200) {
        setRefreshFlag(true);
        Swal.fire("Good job!", "Status Updated", "success");
      } else if (statusCode === 400) {
        Swal.fire("Oops...", `${response?.message}`, "error");
      }
    }
  };

  return (
    <>
      {loaded ? (
        <FullPageLoader />
      ) : (
        <>
          <Layout>
            <div className="wrapper flex">
              <div className="bg-grey2 w-full min-h-[900px]">
                <div className="md:p-8 p-6 h-full">
                  <div className="hading-card md:p-6 p-3 shadow-[#00000040] shadow-sm rounded-[10px] bg-white flex items-start justify-between mb-[56px]">
                    <div className="flex flex-wrap gap-[32px]">
                      <div className="md:w-[120px] md:h-[120px] w-[85px] h-[85px] rounded-full object-fill overflow-hidden">
                        <Image
                          alt="logo-img"
                          className="w-[120px] h-[120px] rounded-full object-fill overflow-hidden"
                          src={`${process.env.CLOUDINARY_IMAGE_URL}${organizations?._doc.logo}`}
                          width="120"
                          height="120"
                        />
                      </div>
                      <div>
                        <h2 className="text-[15px] sm:text-[25px] md:text-[40px] leading-[33px] font-bold mb-[10px]">
                          {organizations?._doc?.name}
                        </h2>
                        <div>
                          <div className="flex gap-[12px] mb-[10px] flex-wrap">
                            <FontAwesomeIcon
                              className="md:text-[16px] text-[13px]"
                              icon={faLocationDot}
                            />
                            <p className="text-[13px] md:text-[16px] font-[400]">
                              {organizations?._doc?.street1}
                            </p>
                          </div>
                          <ul className="flex flex-wrap gap-[12px]">
                            {organizations &&
                              organizations?._doc.type.map((organization) => (
                                <>
                                  <li className="mb-[8px]">
                                    <span className="tag py-[4px] px-[8px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center md:min-w-[90px] min-w-full">
                                      {organization?.name}
                                    </span>
                                  </li>
                                </>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <span className="icon-dots">
                      <FontAwesomeIcon icon={faEllipsis} />
                    </span>
                  </div>
                  <div className="flex gap-[32px] flex-wrap xl:flex-nowrap">
                    <div className="w-full xl:w-[70%]">
                      <div className="md:p-[24px] py-[24px] px-[13px] pb-[14px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white mb-[16px]">
                        <h2 className="text-[16px] md:text-[24px] font-[700] mb-[10px] text-themecolor">
                          Manage Team
                        </h2>
                        <div className="flex flex-wrap md:flex-nowrap gap-[16px]">
                          <div className="bg-[#F4F4F4] md:p-[24px] py-[24px] px-[13px] pb-[14px] shadow-[#00000040] shadow-sm rounded-[10px] mb-[16px] md:w-[50%] w-full">
                            <h2 className="text-[16px] md:text-[20px] font-[700]">
                              {countMembers} Team Members
                            </h2>
                          </div>
                          <div className="bg-[#F4F4F4] md:p-[24px] py-[24px] px-[13px] pb-[14px] shadow-[#00000040] shadow-sm rounded-[10px] mb-[16px] md:w-[50%] w-full flex flex-wrap justify-between">
                            <h2 className="text-[16px] md:text-[20px] font-[700] me-[16px]">
                              Invite
                            </h2>
                            <div className="flex gap-[10px] flex-wrap">
                              <div className="flex gap-[10px] flex-wrap">
                                <button className="py-[8px] px-[20px] border-[1px] border-[solid] border-themecolor text-[16px] font-[500] text-themecolor hover:bg-themecolor rounded-[4px] hover:text-[#fff]">
                                  Learn More
                                </button>
                                <button
                                  onClick={getLink}
                                  className="py-[8px] px-[20px] border-[1px] border-[solid] border-themecolor bg-themecolor text-[16px] font-[500] text-[#fff] hover:bg-transparent hover:text-themecolor rounded-[4px]"
                                >
                                  Get Link
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#fff] md:p-[24px] py-[24px] px-[13px] pb-[14px] shadow-[#00000040] shadow-sm rounded-[10px] mb-[16px]">
                        <h2 className="text-[16px] md:text-[20px] font-[700] text-themecolor">
                          Users Application Status
                        </h2>
                      </div>
                      <div className="bg-[#fff] md:p-[24px] py-[24px] px-[13px] pb-[14px] shadow-[#00000040] shadow-sm rounded-[10px] mb-[16px]">
                        <h2 className="text-[16px] md:text-[20px] font-[700] text-themecolor">
                          Joining Application
                        </h2>
                        <div className="table-responsive overflow-auto">
                          <table className="border-collapse mt-4 w-full">
                            <thead>
                              <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-[11px] py-2 text-[13px] md:text-[16px]">
                                  Applicant Name
                                </th>
                                <th className="border border-gray-400 px-[11px] py-2 text-[13px] md:text-[16px]">
                                  Email
                                </th>
                                <th className="border border-gray-400 px-[11px] py-2 text-[13px] md:text-[16px]">
                                  Status
                                </th>
                                <th className="border border-gray-400 px-[11px] py-2 text-[13px] md:text-[16px]">
                                  Date
                                </th>
                                <th className="border border-gray-400 px-[11px] py-2 text-[13px] md:text-[16px]">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {userMembers.map((member, index) => (
                                <tr
                                  className={
                                    index % 2 === 0
                                      ? "bg-gray-100"
                                      : "bg-white text-[12px] md:text-[15px] text-center"
                                  }
                                  key={index}
                                >
                                  <td className="border border-gray-400 px-[11px] py-2 text-[12px] md:text-[15px] text-center">
                                    {member?.userId?.username}
                                  </td>
                                  <td className="border border-gray-400 px-[11px] py-2 text-[12px] md:text-[15px] text-center">
                                    {member?.userId?.username}
                                  </td>
                                  <td className="border border-gray-400 px-[11px] py-2 text-[12px] md:text-[15px] text-center">
                                    {member.status === 0
                                      ? "Pending"
                                      : member.status === 1
                                        ? "Approved"
                                        : member.status === 2
                                          ? "Rejected"
                                          : "Unknown"}
                                  </td>
                                  <td className="border border-gray-400 px-[11px] py-2 text-[12px] md:text-[15px] text-center">
                                    {member.createdAt}
                                  </td>
                                  <td className="border border-gray-400 px-[11px] py-2 text-[12px] md:text-[15px] text-center">
                                    <div className="flex gap-[8px] justify-center items-center">
                                      {member.status === 0 && (
                                        <>
                                          <button
                                            onClick={() =>
                                              submitApprove(member)
                                            }
                                            className="md:py-[8px] md:px-[15px] py-[4px] px-[12px] border-[1px] border-[solid] border-green-700 bg-green-700 text-[13px] font-[500] text-[#fff] hover:bg-transparent hover:text-green-700 hover:border-green-700 rounded-[4px]"
                                          >
                                            Approve
                                          </button>
                                          <button
                                            onClick={() => submitReject(member)}
                                            className="md:py-[8px] md:px-[15px] py-[4px] px-[12px] border-[1px] border-[solid] border-red-600 bg-red-600 text-[13px] font-[500] text-[#fff] hover:bg-transparent hover:text-red-600 rounded-[4px]"
                                          >
                                            Reject
                                          </button>
                                        </>
                                      )}
                                      {member.status === 1 && (
                                        <button className="md:py-[8px] md:px-[15px] py-[4px] px-[12px] border-[1px] border-[solid] border-green-700 bg-green-700 text-[13px] font-[500] text-[#fff] hover:bg-transparent hover:text-green-700 hover:border-green-700 rounded-[4px]">
                                          Approved
                                        </button>
                                      )}
                                      {member.status === 2 && (
                                        <button className="md:py-[8px] md:px-[15px] py-[4px] px-[12px] border-[1px] border-[solid] border-red-600 bg-red-600 text-[13px] font-[500] text-[#fff] hover:bg-transparent hover:text-red-600 rounded-[4px]">
                                          Rejected
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="wallet-card shadow-[#00000040] shadow-sm rounded-[10px] p-6 grow w-full bg-white">
                        {userApplications?.length > 0 ? (
                          userApplications.map((application, index) => (
                            <div
                              key={index}
                              className="p-[16px] border border-[#4066b033] flex flex-col justify-center mb-[24px] bg-[#F4F4F4]"
                            >
                              <div className="flex flex-wrap justify-between">
                                <div>
                                  <h2 className="text-[16px] md:text-[20px] font-bold mb-[10px]">
                                    hey {application?.userId?.username}
                                  </h2>
                                  <p className=" text-[14px] lg:text-[16px] font-[400]">
                                    {application?.message}
                                  </p>
                                </div>
                                <p className=" text-[14px] lg:text-[16px] font-[400]">
                                  {application?.appointmentTime}{" "}
                                  {application?.appointmentDay}{" "}
                                  {application?.appointmentDate}
                                </p>
                                <Link
                                  href={`/overview-application/${application?._id}`}
                                >
                                  <FontAwesomeIcon icon={faEllipsis} />
                                </Link>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-[16px] md:text-[24px] font-[700] mb-[10px] text-themecolor">
                            No documents available.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full xl:w-[30%]">
                      <div className="md:p-[24px] py-[24px] px-[13px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white mb-[16px]">
                        <h2 className="text-[16px] md:text-[24px] font-[700] mb-[10px] text-themecolor">
                          Notifications
                        </h2>
                        {pendingUsers.length > 0 &&
                          pendingUsers.slice(0, 3).map((user, index) => (
                            <div
                              className="flex flex-col gap-[16px]"
                              key={index}
                            >
                              <div className="py-[16px] px-[24px] bg-[#FAFAFA] rounded-[4px] border-[#4066b033] border mb-[16px]">
                                <div>
                                  <p className="text-[17px] md:text-[20px] mb-[16px] font-[700]">
                                    {user?.userId?.username} is requesting to
                                    link their profile to the organization.
                                  </p>
                                  <button className="py-[8px] px-[20px] border border-themecolor text-themecolor hover:text-white hover:bg-themecolor rounded-[4px]">
                                    View
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Layout>
        </>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const id = query.id;
  // Use the imported function to get props
  return {
    props: await getOrganizationServerSideProps(id),
  };
}
export default OrgUserOverview;
