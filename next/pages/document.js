import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Layout from "@/Layouts/layout3";
import AvatarSampleImg from "../assets/images/sample-img.png";
import FileUploadModal from "./document-upload";
import Link from "next/link";
import { isLoggedIn } from "@/helpers/authHelper";
import useFetchDocuments from "@/hooks/usefetchDocuments";
import FullPageLoader from "@/components/fullPageLoader";
function Document() {
  const user = isLoggedIn();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [renderFlag, setRenderFlag] = useState(false);

  const { documents, loading } = useFetchDocuments(user, renderFlag);
  const openModal = () => {
    setModalIsOpen(true);
    setRenderFlag(false);
  };
  // close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setRenderFlag(true);
  };
  return (
    <>
      {loading ? (
        <FullPageLoader />
      ) : (
        <>
          <Layout image={AvatarSampleImg}>
            <div className="wrapper flex">
              <div className=" bg-[#FAFAFA] w-full">
                <div className="p-8">
                  <div className="hading-card p-[24px] md:py-[24px] md:px-[32px] items-center flex flex-wrap justify-between">
                    <div>
                      <h2 className="text-[18px] md:text-[24px] font-[700] text-themecolor">
                        Your Documents
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

                  <div className="flex gap-[32px] flex-wrap lg:flex-nowrap">
                    <div className="w-[100%] xl:w-[70%]">
                      <div className="p-[24px] md:py-[24px] px-[32px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white flex flex-col justify-center mb-[64px]">
                        <div className="flex justify-between flex-wrap mb-[30px]">
                          <h2 className="text-[18px] md:text-[24px] font-bold mb-[10px] me-[10px] text-themecolor">
                            Documents
                          </h2>
                          <div>
                            <button onClick={openModal}>
                              <label className="btn btn-theme border border-themecolor bg-themecolor text-white hover:text-themecolor hover:bg-transparent hover:border-themecolor gap-[12px] flex items-center px-[20px] py-[8px]  rounded-4">
                                <span>Upload</span>
                                <FontAwesomeIcon
                                  className="text-[16px]"
                                  icon={faPlusCircle}
                                />
                              </label>
                            </button>
                          </div>
                        </div>
                        {documents?.length > 0 ? (
                          documents.map((document, index) => (
                            <div
                              key={index}
                              className="p-[16px] shadow-[#00000040] shadow-sm rounded-[10px] border border-[#4066b033] flex flex-col justify-center mb-[24px] bg-[#FAFAFA]"
                            >
                              <div className="flex flex-wrap justify-between">
                                <div>
                                  <h2 className="text-[12px] sm:[16px] md:text-[20px] font-bold mb-[10px]">
                                    {document?.name}
                                  </h2>
                                  <p className=" text-[14px] lg:text-[16px] font-[400]">
                                    {document?.updatedAt}
                                  </p>
                                </div>
                                <Link
                                  href={`/document-detail/${document?._id}`}
                                >
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
                    <div className="p-[24px] h-[730px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white justify-start flex flex-col mb-[64px] w-[100%] xl:w-[30%]">
                      <h2 className="text-[18px] md:text-[24px] font-bold mb-[10px] text-themecolor">
                        Needs Review
                      </h2>
                      <div className="p-[16px] shadow-[#00000040] shadow-sm rounded-[10px] border border-[#4066b033] flex flex-col justify-center mb-[24px] bg-[#FAFAFA]">
                        <h3 className="text-[12px] sm:[16px] md:text-[20px] font-bold mb-[10px]">
                          Documents Requested
                        </h3>
                        <p className=" text-[14px] lg:text-[16px] font-[400]">
                          Proof of Income Requested by Family Counseling
                          Services
                        </p>
                      </div>
                      <div className="p-[16px] shadow-[#00000040] shadow-sm rounded-[10px] border border-[#4066b033] flex flex-col justify-center mb-[24px] bg-[#FAFAFA]">
                        <h3 className="text-[12px] sm:[16px] md:text-[20px] font-bold mb-[10px]">
                          Treatment Record{" "}
                        </h3>
                        <p className=" text-[14px] lg:text-[16px] font-[400]">
                          Updated 10/9/23
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <FileUploadModal isOpen={modalIsOpen} closeModal={closeModal} />
          </Layout>
        </>
      )}
    </>
  );
}

export default Document;
