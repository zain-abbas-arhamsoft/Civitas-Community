import React, { useState } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import { uploadDocuments } from "@/api/users";
import { isLoggedIn } from "@/helpers/authHelper";
Modal.setAppElement("#__next");

const FileUploadModal = ({ isOpen, closeModal }) => {
  const [file, setFile] = useState(null);
  const user = isLoggedIn();
  const [loading, setLoading] = useState(false);

  // Function to handle file change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const uploadUserDocuments = async () => {
    if (file === null) {
      Swal.fire("oops", "Please upload a file", "error");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await uploadDocuments(user, formData);
      if (response && response.statusCode === 200) {
        Swal.fire("Good Job", response.message, "success");
        closeModal();
      } else {
        Swal.fire("Oops", response.message, "error");
      }
      setLoading(false);
      setFile(null);
    } catch (error) {
      setLoading(false);
    }
  };

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
          <h3 className="text-themecolor sm:text-[25px] text-[20px] md:text-[40px] font-[700] text-center">
            Upload Documents
          </h3>
          <span className="block md:text-[16px] text-[13px] text-[#43515C]">
            Upload any documents needed for your profile.{" "}
          </span>
        </div>
        <div className="px-[12px] py-[16px] bg-[#FAFAFA] border border-[#4066b033]  flex flex-col justify-center items-center mb-[20px] rounded-[6px]">
          <div className="mb-[8px] mt-[10px]">
            <span className="text-[16px] text-[#000] opacity-[0.3] font-[400] block">
              Drag files to upload
            </span>
            <span className="text-[16px] text-[#000] opacity-[0.3] font-[400] block text-center">
              or
            </span>
          </div>
          <div className="mb-[24px]">
            <div className="mb-[34px]">
              <label
                className="py-[8px] px-[20px] border-[#a0a0a0] border-[1px] text-[16px] text-[#000] opacity-[0.5] font-[400] hover:bg-[#000] hover:text-[#fff]"
                htmlFor="file-input"
              >
                Browse Files
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            {file && <span className="ml-2">{file?.type}</span>}
            {file && <span className="ml-2">{file?.name}</span>}
          </div>
          <div className="text-center mb-[10px]">
            <p className="text-[14px] text-[#000] opacity-[0.3] font-[500] block">
              Max file size: <strong>50MB</strong> Supported file types:{" "}
              <strong>JPG, PNG, PDF, SVG</strong>
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <button
            className="btn btn-theme border min-w-[160px] justify-center border-themecolor hover:border-themecolor bg-themecolor text-white hover:text-themecolor hover:bg-transparent  flex items-center px-[20px] py-[8px] rounded-4"
            onClick={uploadUserDocuments}
          >
            <span>Submit</span>
            <span>
              {loading ? (
                <span>
                  <Loader className="mr-3 btn hover:border-themecolor" />{" "}
                </span>
              ) : null}
            </span>
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

export default FileUploadModal;
