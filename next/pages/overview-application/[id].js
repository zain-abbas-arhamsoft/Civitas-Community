import React from "react";
import Image from "next/image";
import { reviewUserApplication } from "@/api/organizations";
import { useState, useEffect } from "react";
import { isLoggedIn } from "@/helpers/authHelper";
import { useRouter } from "next/router";
import { reviewApplicationStatus } from "@/api/users";
function OverviewApplication() {
  const user = isLoggedIn();
  const router = useRouter();
  const [applicationDetail, setApplicationDetail] = useState("");
  const [userPrefernce, setUserPreference] = useState([]);
  const getApplicationReview = async (params) => {
    let applicationStatus = await reviewUserApplication(user, {
      applicationId: params.id,
    });
    if (applicationStatus) {
      const { getStatus } = applicationStatus;
      if (getStatus) {
        setApplicationDetail(getStatus[0]);
        setUserPreference(
          getStatus[0]?.userId?.contactPrefernce
            ? getStatus[0]?.userId?.contactPrefernce
            : "n/a"
        );
      }
    }
  };
  useEffect(() => {
    getApplicationReview(router.query);
  }, [router.asPath]);

  const approveApplicationStatus = async () => {
    const obj = {
      status: 1,
      applicationId: router.query.id,
    };
    reviewApplicationStatus(user, obj);
  };
  const rejectApplicationStatus = async () => {
    const obj = {
      status: 2,
      applicationId: router.query.id,
    };
    reviewApplicationStatus(user, obj);
  };
  return (
    <>
      <div className="wrapper flex org-confirm">
        <div className="bg-grey2 w-full min-h-[900px]">
          <div className="p-8 h-full">
            <div className="xl:py-[32px] xl:px-[80px] py-[20px] px-[25px] mb-[16px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white">
              <h2 className="text-[18apx] md:text-[24px] font-[700] text-themecolor mb-[10px]">
                Overview Application
              </h2>
              <div className="bg-[#FAFAFA] flex justify-between border border-[#4066b033] rounded-[4px] py-[24px] px-[32px] mb-[16px]">
                <div className="flex gap-[48px] flex-wrap">
                  <div className="w-[75px] h-[75px] rounded-full overflow-hidden">
                    <Image
                      alt="logo"
                      src={`${process.env.CLOUDINARY_IMAGE_URL}${applicationDetail?.userId?.image}`}
                      width="120"
                      height="120"
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <strong className="mb-[12px] block text-[18px] md:text-[20px] font-[700]">
                      {applicationDetail?.userId?.username}
                    </strong>
                    <span className="mb-[10px] text-[14px] md:text-[16px] font-[400] block">
                      {applicationDetail?.userId?.email}
                    </span>
                    <span className="mb-[10px] text-[14px] md:text-[16px] font-[400] block">
                      Phone: {applicationDetail?.userId?.phone}
                    </span>
                    <span className="mb-[10px] text-[15px] md:text-[16px] font-[400] block">
                      Contact Preference:{" "}
                      {Array.isArray(userPrefernce)
                        ? userPrefernce.map((preference, index) => (
                            <span key={index}>{preference}</span>
                          ))
                        : userPrefernce}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-[#FAFAFA] border border-[#4066b033] rounded-[4px] py-[24px] px-[32px] mb-[16px]">
                <strong className="text-[16px] md:text-[20px] font-[700] text-black block mb-[10px]">
                  Service Applied For
                </strong>
                <span className="text-[13px] md:text-[16px] font-[400] text-black block">
                  Rent & Utility Assistance
                </span>
              </div>
              <div className="bg-[#FAFAFA] border border-[#4066b033] rounded-[4px] py-[24px] px-[32px] mb-[16px]">
                <strong className="text-[16px] md:text-[20px] font-[700] text-black block mb-[10px]">
                  Selected Appointment Time
                </strong>
                <div className="bg-[#F6F9FF] rounded-[4px] items-end border border-[#4066b033] py-[16px] px-[24px] flex flex-wrap gap-[16px] justify-between">
                  <div>
                    <strong className="block text-[16px] text-themecolor font-[700] mb-[10px]">
                      {applicationDetail?.appointmentDay}
                    </strong>
                    <span className="block text-[16px] text-themecolor font-[400]">
                      {applicationDetail?.appointmentDate}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[16px] text-black font-[400]">
                      {applicationDetail?.appointmentTime}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-[#FAFAFA] border border-[#4066b033] rounded-[4px] py-[24px] px-[32px] mb-[16px]">
                <strong className="text-[16px] md:text-[20px] font-[700] text-black block mb-[10px]">
                  {applicationDetail?.message}
                </strong>
                <span className="text-[13px] md:text-[16px] font-[400] text-black block">
                  Hi, I’m looking for assistance due to recent job loss. I will
                  be needing assistance for next months rent.
                </span>
              </div>
              <button
                onClick={approveApplicationStatus}
                className="bg-themecolor text-white text-[16px] py-[8px] px-[20px] hover:bg-transparent border border-themecolor hover:text-themecolor rounded-[4px]"
              >
                Approve
              </button>
              {""}
              <button
                onClick={rejectApplicationStatus}
                className="bg-themecolor text-white text-[16px] py-[8px] px-[20px] hover:bg-transparent border border-themecolor hover:text-themecolor rounded-[4px]"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OverviewApplication;
