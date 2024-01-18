import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import { uploadDocuments } from "@/api/users";
import { isLoggedIn } from "@/helpers/authHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation, faLocationDot } from "@fortawesome/free-solid-svg-icons";
Modal.setAppElement("#__next");
import Select from "react-select";

const FilterModal = ({
  isOpen,
  closeModal,
  organizationType,
  filterOrganizationsByType,
  selectedOptions,
  searchByZipCode,
  zipCode,
  handleCheckboxChange,
  workingHours,
  ClearAll,
  clearZip,
  clearType,
  clearhours,
  submitButton,
}) => {
  const [organizationType1, setOrganizationType] = useState([]);
  const [workingHours1, setWorkingHours] = useState([]);
  const closeModalbutton = async () => {
    closeModal();
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
    setOrganizationType(organizationType);
  }, [organizationType]);

  useEffect(() => {
    setWorkingHours(workingHours);
  }, [workingHours]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      organizationType={organizationType}
      filterOrganizationsByType={filterOrganizationsByType}
      selectedOptions={selectedOptions}
      searchByZipCode={searchByZipCode}
      zipCode={zipCode}
      handleCheckboxChange={handleCheckboxChange}
      workingHours={workingHours}
      submitButton={submitButton}
      contentLabel="Documents Upload"
      className={
        "relative bg-white rounded-lg shadow dark:bg-gray-700 md:py-[24px] md:px-[32px] py-[13px] px-[15px] sm:w-[400px] w-[280px] md:w-[696px]"
      }
      style={customStyles}
    >
      <div className="bg-white flex flex-col justify-center">
        <div className="flex justify-center flex-col mb-[24px]">
          <div className="pt-[14px]">
            <div className="flex justify-between flex-wrap">
              <h2 className="md:text-[24px] text-[18px] text-themecolor font-[700]">
                Filtres
              </h2>
              <button
                className="md:text-[13px] text-[12px] text-black font-[400]"
                onClick={ClearAll}
              >
                Clear all
              </button>
            </div>
            <span className="md:text-[14px] text-[13px] text-black font-[400] border-b border-b-[#4066b033] block pb-[16px]">
              Showing 0 of 100
            </span>
            <div className="pb-[16px] border-b border-b-[#4066b033]">
              <div className="flex justify-between flex-wrap mb-[10px]">
                <h2 className="md:text-[16px] text-[14px] text-black font-[700]">
                  Zipcode
                </h2>
                <button
                  className="md:text-[13px] text-[12px] text-black font-[400]"
                  onClick={clearZip}
                >
                  Clear
                </button>
              </div>
              <div className="relative">
                <div className="absolute top-[8px] left-[10px]">
                  <FontAwesomeIcon icon={faLocationDot} />
                </div>
                <input
                  className="py-[8px] px-[25px] border border-[#4066b033] rounded-[4px] gap-[8px] flex w-full"
                  type="text"
                  placeholder="Zip"
                  value={zipCode}
                  onChange={searchByZipCode}
                />
              </div>
            </div>
            <div className="pb-[16px] border-b border-b-[#4066b033]">
              <div className="flex justify-between flex-wrap mb-[10px]">
                <h2 className="md:text-[16px] text-[14px] text-black font-[700]">
                  Primary Services
                </h2>
                <button
                  className="md:text-[13px] text-[12px] text-black font-[400]"
                  onClick={() => clearType()}
                >
                  Clear
                </button>
              </div>
              <div>
                <Select
                  options={[
                    { value: "", label: "Select" },
                    ...(organizationType1 &&
                      organizationType1.map((option) => ({
                        value: option._id,
                        label: option.name,
                      }))),
                  ]}
                  onChange={filterOrganizationsByType}
                  value={selectedOptions}
                  classNamePrefix="custom-select"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between flex-wrap mb-[15px]">
                <h2 className="md:text-[16px] text-[14px] text-black font-[700]">
                  Hours of Operation
                </h2>
                <button
                  className="md:text-[13px] text-[12px] text-black font-[400]"
                  onClick={() => clearhours()}
                >
                  Clear
                </button>
              </div>
              <ul>
                <li className="mb-[22px]">
                  <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                    <input
                      id="checkbox1"
                      type="checkbox"
                      value="Weekdays 8am- 5pm"
                      class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={
                        workingHours1.includes("Weekdays 8am- 5pm")
                          ? true
                          : false
                      }
                      onChange={handleCheckboxChange}
                    />
                    <label
                      for="checkbox1"
                      class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                    >
                      Weekdays 8am- 5pm
                    </label>
                  </div>
                </li>
                <li className="mb-[22px]">
                  <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                    <input
                      id="checkbox2"
                      type="checkbox"
                      value="Weekdays After 5pm"
                      class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={handleCheckboxChange}
                      checked={
                        workingHours1.includes("Weekdays After 5pm")
                          ? true
                          : false
                      }
                    />
                    <label
                      for="checkbox2"
                      class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                    >
                      Weekdays After 5pm
                    </label>
                  </div>
                </li>
                <li className="mb-[22px]">
                  <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                    <input
                      id="checkbox3"
                      type="checkbox"
                      value="Weekends 8am- 5pm"
                      class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={handleCheckboxChange}
                      checked={
                        workingHours1.includes("Weekends 8am- 5pm")
                          ? true
                          : false
                      }
                    />
                    <label
                      for="checkbox3"
                      class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                    >
                      Weekends 8am- 5pm{" "}
                    </label>
                  </div>
                </li>
                <li className="mb-[22px]">
                  <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                    <input
                      id="checkbox4"
                      type="checkbox"
                      value="Weekends After 5pm"
                      class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={handleCheckboxChange}
                      checked={
                        workingHours1.includes("Weekends After 5pm")
                          ? true
                          : false
                      }
                    />
                    <label
                      for="checkbox4"
                      class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                    >
                      Weekends After 5pm
                    </label>
                  </div>
                </li>
                <li className="mb-[22px]">
                  <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                    <input
                      id="checkbox5"
                      type="checkbox"
                      value="24/7"
                      class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={handleCheckboxChange}
                      checked={workingHours1.includes("24/7") ? true : false}
                    />
                    <label
                      for="checkbox5"
                      class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                    >
                      24/7
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <button
            className="btn btn-theme border min-w-[160px] justify-center border-themecolor hover:border-themecolor bg-themecolor text-white hover:text-themecolor hover:bg-transparent  flex items-center px-[20px] py-[8px] rounded-4"
            onClick={submitButton}
          >
            <span>Submit</span>
          </button>
        </div>

        <MdClose
          size={24}
          onClick={closeModalbutton}
          className="absolute top-[12px] right-[12px] cursor-pointer"
        />
      </div>
    </Modal>
  );
};

export default FilterModal;
