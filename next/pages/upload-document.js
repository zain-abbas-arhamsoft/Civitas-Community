import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Layout from "@/Layouts/layout3";
import { uploadDocuments } from "@/api/users";
import { isLoggedIn } from "@/helpers/authHelper";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import FullPageLoader from "@/components/fullPageLoader";
import { useRouter } from "next/router";
import { getUserData } from "@/api/users";
function UploadDocument() {
  const user = isLoggedIn();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    image: null, // Store the selected image as a File object
  });
  // Prepare form data to send file
  const uploadUserDocuments = async () => {
    if (file === null) {
      Swal.fire("oops", "Please upload a file", "error");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      // Attempt to upload documents
      const response = await uploadDocuments(user, formData);
      if (response && response.statusCode === 200) {
        Swal.fire("Good Job", response.message, "success");
        setLoading(false);
        setFile(null); // Reset the file state after successful upload
      } else {
        // Show error message if upload fails
        Swal.fire("oops", response.message, "error");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  // Function to handle file change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
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
    setLoading(true);
    let response = await getUserData(user);
    if (response) {
      let { statusCode, image, userData } = response;
      if (statusCode === 200) {
        setFormData({
          ...formData,
          image: image,
          username: userData?.username,
        });
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading ? (
        <FullPageLoader />
      ) : (
        <>
          <Layout image={formData?.image}>
            <div className="wrapper flex">
              <div className="bg-grey2 w-full">
                <div className="p-8">
                  <div className="hading-card p-[24px] border border-[#000] bg-white items-center flex flex-wrap justify-between mb-[56px]">
                    <div>
                      <h2 className="text-[18px] md:text-[24px] font-bold mb-[10px]">
                        Documents
                      </h2>
                      <p className=" text-[14px] lg:text-[16px] font-[400]">
                        View and manage your documents.
                      </p>
                    </div>
                    <div>
                      <span className="icon-dots">
                        <FontAwesomeIcon
                          className="text-[24px]"
                          icon={faEllipsis}
                        />
                      </span>
                    </div>
                  </div>
                  <div className="p-[24px] border border-[#000] bg-white flex flex-col justify-center mb-[64px]">
                    <div className="mb-[30px]">
                      <h2 className="text-[18px] md:text-[24px] font-bold mb-[10px] me-[10px]">
                        Upload Documents
                      </h2>
                    </div>
                    <div className="p-[16px] border border-[#000] flex flex-col justify-center mb-[24px] bg-[#F4F4F4]">
                      <h2 className="text-[16px] md:text-[20px] font-bold mb-[10px]">
                        Upload any documents needed for your profile.
                      </h2>
                    </div>
                    <div className="px-[12px] py-[16px] border border-[#000] bg-white flex flex-col justify-center items-center mb-[24px] rounded-[6px]">
                      <div className="mb-[10px] mt-[12px]">
                        <span className="text-[16px] text-[#000] opacity-[0.3] font-[400] block">
                          Drag files to upload
                        </span>
                        <span className="text-[16px] text-[#000] opacity-[0.3] font-[400] block text-center">
                          or
                        </span>
                      </div>
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
                      <div className="text-center mb-[12px]">
                        <p className="text-[14px] text-[#000] opacity-[0.3] font-[500] block">
                          Max file size: <strong>50MB</strong> Supported file
                          types: <strong>JPG, PNG, PDF, SVG</strong>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={uploadUserDocuments}
                      className="py-[8px] px-[20px] border-[#000] border-[1px] text-[16px] text-[#000] font-[400] hover:bg-[#000] hover:text-[#fff]"
                    >
                      Submit
                      {loading ? <Loader className="mr-3" /> : null}
                    </button>
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
export default UploadDocument;
