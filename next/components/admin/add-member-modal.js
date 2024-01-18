import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import { isLoggedIn } from "@/helpers/authHelper";
import { updateUserToAdmin } from "../../api/users";
import Select from "react-select";

Modal.setAppElement("#__next");

const AddMemberModal = ({ isOpen, closeModal, member }) => {
  const user = isLoggedIn();
  const [selectedOption, setSelectedOption] = useState(null);
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  let formattedOptions = [];

  const closeModalbutton1 = async () => {
    closeModal();
    setSelectedOption(null);
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

  const customStylesForSelect = {
    width: "100%",
  };

  if (Array.isArray(member) && member.length > 0) {
    formattedOptions = member.map((option) => ({
      value: option._id,
      label: option.username,
    }));
  }

  const handleCaptureSelection = async () => {
    if (selectedOption) {
      const response = await updateUserToAdmin(user, {
        memberId: selectedOption.value,
      });
      if (response) {
        var { statusCode } = response;
        if (statusCode === 200) {
          Swal.fire("Good job!", "Status Updated", "success");
        } else if (statusCode === 500) {
          Swal.fire("Oops...", `${response?.message}`, "error");
        } else if (statusCode === 400) {
          Swal.fire("Oops...", `${response?.message}`, "error");
        }
        closeModalbutton1();
      } else {
        console.log("No user selected");
      }
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Documents Upload"
      className={
        "relative bg-white rounded-lg shadow dark:bg-gray-700 md:py-[24px] md:px-[32px] py-[13px] px-[15px] sm:w-[400px] w-[280px] md:w-[696px]"
      }
      style={customStyles}
    >
      <div className="bg-white flex flex-col justify-center">
        <div className="flex items-center justify-center flex-col mb-[24px]">
          <h3 className="text-themecolor sm:text-[25px] text-[20px] md:text-[40px] font-[700] text-center mb-[10px]">
            Add Member!
          </h3>
          <div className="flex justify-center items-center mb-[16px]">
            <strong className="block md:text-[24px] sm:text-[18px] text-[14px] text-[#43515C] font-[700] mb-[10px] text-center">
              Promote a Member to Admin of organization
            </strong>
          </div>
          <div className="w-full">
            <Select
              style={customStylesForSelect}
              value={selectedOption}
              onChange={handleChange}
              options={formattedOptions}
              classNamePrefix="custom-select"
              placeholder="Select Member..."
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="btn btn-theme border border-[#4066b033] min-w-[200px] justify-center bg-themecolor text-white hover:text-themecolor hover:bg-transparent hover:border-themecolor  flex items-center px-[20px] py-[8px]  rounded-4"
            onClick={handleCaptureSelection}
          >
            Add
          </button>
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

export default AddMemberModal;
