import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Layout from "@/Layouts/layout3";
import AvatarSampleImg from "../../assets/images/sample-img.png";
import { isLoggedIn } from "@/helpers/authHelper";
import { useRouter } from "next/router";
import { fetchDocumentDetail } from "@/api/users";
import FullPageLoader from "@/components/fullPageLoader";
import Swal from "sweetalert2";

function DocumentDetails() {
  const user = isLoggedIn();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // useState() manages the state of the 'document' which holds fetched document details
  const [document, setDocument] = useState([]);
  // documentDetail() fetches details of the specified document based on the router query parameters
  const documentDetail = async (params) => {
    setLoading(true);
    const response = await fetchDocumentDetail(user, params);
    if (response) {
      const { statusCode, modifiedDocument, message } = response;
      if (statusCode === 200) {
        setDocument(modifiedDocument[0]);
      }
      if (statusCode === 404) {
        setDocument(modifiedDocument[0]);
        Swal.fire("oops", message, "error");
      }
      setLoading(false);
    }
  };
  // useEffect() performs side effects based on the changing router query
  useEffect(() => {
    // Redirects the user to the login page if not authenticated
    if (!user.token) {
      router.push("/");
      return;
    }
    // Fetches document details when there are query parameters in the router

    if (Object.keys(router.query).length !== 0) {
      documentDetail(router.query);
    }
  }, [router.query]);
  /**
   * renderDocument() renders the document content based on its file type.
   * It generates different views for PDF, image files (jpg, png, jpeg), or other file types.
   * If the file type is not supported, a default message is shown.
   */
  const renderDocument = () => {
    const fileExtension = document?.file?.split(".").pop();
    if (fileExtension === "pdf") {
      return (
        <iframe
          src={`${process.env.CLOUDINARY_IMAGE_URL}${document?.file}`}
          width="100%"
          height="600px"
          title="PDF Document"
        ></iframe>
      );
    } else if (
      fileExtension === "jpg" ||
      fileExtension === "png" ||
      fileExtension === "jpeg"
    ) {
      return (
        <img
          src={`${process.env.CLOUDINARY_IMAGE_URL}/${document?.file}`}
          alt="Document"
        />
      );
    } else {
      return <p>No preview available for this file type.</p>;
    }
  };
  return (
    <>
      {loading ? (
        <FullPageLoader />
      ) : (
        <>
          <Layout image={AvatarSampleImg}>
            <div className="wrapper">
              <div className=" bg-grey2">
                <div className="p-8">
                  <div className="hading-card p-[24px] border border-[#000] bg-white items-center flex flex-wrap justify-between mb-[56px]">
                    <div>
                      <h2 className="text-[18px] md:text-[24px] text-[18px font-bold">
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
                  <div className="p-[24px] border-[1px] border-[#000] bg-[#fff] flex flex-col justify-center mb-[64px]">
                    <h2 className="text-[18px] md:text-[24px] text-[18px font-bold mb-[24px]">
                      {document?.name}
                    </h2>
                    <div className="border-[#000] p-[16px] bg-[#F4F4F4] border-[1px]">
                      <h3 className="text-[16px] md:text-[20px] text-[18px font-bold mb-[24px]">
                        Record note from CC Health Clinic
                      </h3>
                      <p className=" text-[14px] lg:text-[16px] font-[400] mb-[30px]">
                        Date of visitation {document?.updatedAt}
                      </p>
                      <div className="mb-[200px]">{renderDocument()}</div>

                      <p className=" text-[14px] lg:text-[16px] font-[400]">
                        Signed off by Dr. Mendoza MD
                      </p>
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
export default DocumentDetails;
