import React, {  useEffect } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { isLoggedIn } from "@/helpers/authHelper";
import Image from "next/image";
import Link from "next/link";
Modal.setAppElement("#__next");
import { updateOrganizationNotification } from "@/api/organizations";

const ConfirmationModal = ({ isOpen1, closeModal1, connectedOrganization }) => {
  const user = isLoggedIn();
  const closeModalbutton1 = async () => {
    closeModal1();
  };
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      boxShadow: "0 0.5rem 1rem #00000026",
    },
  };

  useEffect(() => {
    const reqId = connectedOrganization.map((item) => item._doc._id);
    updateOrganizationNotification(user, reqId);
  }, []);

  return (
    <Modal
      isOpen={isOpen1}
      onRequestClose={closeModal1}
      contentLabel="Documents Upload"
      className={
        "relative bg-white rounded-lg shadow dark:bg-gray-700 md:py-[24px] md:px-[32px] py-[13px] px-[15px] sm:w-[400px] w-[280px] md:w-[696px]"
      }
      style={customStyles}
    >
      <div className="bg-white flex flex-col justify-center">
        <div className="flex items-center justify-center flex-col mb-[24px]">
          <h3 className="text-themecolor sm:text-[25px] text-[20px] md:text-[40px] font-[700] text-center mb-[10px]">
            Congrats!
          </h3>
          <div className="flex justify-center items-center">
            <strong className="block md:text-[24px] sm:text-[18px] text-[14px] text-[#43515C] font-[700] mb-[10px] text-center">
              You’ve been accepted into the organization
            </strong>
          </div>
          <span className="block md:text-[16px] text-[13px] text-center text-[#43515C] font-[400]">
            You can Toggle back and forth from your personal dashboard and the
            organizations dashboard.
          </span>
        </div>
        {connectedOrganization ? (
          connectedOrganization &&
          connectedOrganization.map((org) => (
            <div className="md:px-[24px] md:py-[16px] py-[16px] px-[16px] bg-[#FAFAFA] border border-[#4066b033]  flex flex-col justify-center items-center mb-[20px] rounded-[6px]">
              <div className="flex md:justify-between justify-center items-center flex-wrap w-full">
                <div>
                  <div className="flex gap-[8px] items-center">
                    <div className="w-[38px] h-[38px]">
                      <Image
                        className="w-full h-full"
                        src={`${process.env.CLOUDINARY_IMAGE_URL}${org?.organizationData?.logo}`}
                        width={100}
                        height={100}
                        alt="logo"
                      />
                    </div>
                    <span className="block md:text-[16px] text-[13px] text-center text-[#43515C] font-[400]">
                      {org?.organizationData?.name}
                    </span>
                  </div>
                </div>
                <div>
                  <Link
                    href={"/dashboard"}
                    className="md:text-[16px] text-[13px] btn btn-theme border border-themecolor bg-transparent text-themecolor hover:text-[#fff] hover:bg-themecolor  flex items-center px-[10px] py-[5px] sm:px-[20px] sm:py-[8px] rounded-4"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
        <div className="flex justify-center items-center">
          <Link
            className="text-[13px] md:text-[16px] text-themecolor underline"
            href={""}
          >
            Later
          </Link>
        </div>
        <MdClose
          size={24}
          onClick={closeModalbutton1}
          className="absolute top-[12px] right-[12px] cursor-pointer"
        />
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
