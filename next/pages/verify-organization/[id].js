import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { isLoggedIn } from "../../helpers/authHelper";
import Layout from "@/Layouts/layout1";
import Image from "next/image";
import {
  sendCodeViaPhone,
  sendCodeViaEmail,
  verifyEmailCode,
  sendCodeViaMail,
  verifyMailCode,
} from "@/api/organizations";
import { getOrganizationServerSideProps } from "@/components/ServerSideRendering/OrganizationProps";
import Swal from "sweetalert2";
import { verifyUserWithOrganization } from "@/api/organizations";
const verifyOrganization = ({ organizations }) => {
  const user = isLoggedIn();
  const router = useRouter();
  const [emailToOrganization, setEmailNotification] = useState(false);
  const [phoneToOrganization, setPhoneCode] = useState(false);
  const [mailToOrganization, setMailCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState();
  const [isVerified, setVerified] = useState(false);
  const [showOnlyField, setShowOnlyField] = useState(false);
  const verifyUser = async () => {
    const obj = {
      userId: organizations?._doc.ownerId,
      organizationId: organizations?._doc._id,
    };
    const verifyResponse = await verifyUserWithOrganization(user, obj);
    if (verifyResponse) {
      const { statusCode } = verifyResponse;
      if (statusCode === 200) setVerified(true);
      if (statusCode === 400) setVerified(false);
    }
  };
  useEffect(() => {
    if (!user && !user?.token) {
      router.push("/");
    }
    verifyUser();
  }, []);

  useEffect(() => {
    setShowOnlyField(router.query?.codeSent);
  }, [router.query]);

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
  };

  // Sent 6 digit code to user's phone
  const sentCodeThoughPhone = async () => {

    if (isVerified) {
      setPhoneCode(true);
      setEmailNotification(false);
      setMailCode(false);
      const obj = {
        organizationId: organizations?._doc._id,
        userId: organizations?._doc.ownerId,
      };
      await sendCodeViaPhone(user, obj); // call an api
    } else {
      Swal.fire("oops", "Please create organization first", "error");
    }
  };
  // Sent 6 digit code to user's email
  const sentCodeThoughEmail = async () => {

    if (isVerified) {
      setPhoneCode(false);
      setMailCode(false);
      setEmailNotification(true);
      const obj = {
        organizationId: organizations?._doc._id,
        userId: organizations?._doc.ownerId,
      };

      const emailVerificationResponse = await sendCodeViaEmail(user, obj);

      if (emailVerificationResponse) {
        let { statusCode, message } = emailVerificationResponse;
        if (statusCode === 400) {
          Swal.fire("oops", message, "error");
          return;
        }
      }
    } else {
      Swal.fire("oops", "Please create organization first", "error");
    }
  };
  // Sent 6 digit code to user's mail
  const sentCodeThroughMail = async () => {
    if (isVerified) {
      setPhoneCode(false);
      setEmailNotification(false);
      setMailCode(true);
      const obj = {
        organizationId: organizations?._doc._id,
        userId: organizations?._doc.ownerId,
      };
      const mailResponse = await sendCodeViaMail(user, obj);
      if (mailResponse) {
        let { statusCode, message } = mailResponse;
        if (statusCode === 400) {
          Swal.fire("oops", message, "error");
          router.push("/dashboard");
        }
      }
    } else {
      Swal.fire("oops", "Please create organization first", "error");
    }
  };

  // Verify email if user entered right verification code
  const verifyEmail = async () => {
    const obj = {
      organizationId: organizations?._doc._id,
      userId: organizations?._doc.ownerId,
      verificationCode,
    };
    const emailVerificationResponse = await verifyEmailCode(user, obj);
    if (emailVerificationResponse) {
      let { statusCode, message } = emailVerificationResponse;
      if (statusCode === 400) {
        Swal.fire("oops", message, "error");
        return;
      }
      if (statusCode === 200) {
        Swal.fire("Great Job", message, "success");
        router.push(`/org-confirmation/${organizations?._doc._id}`);
      }
    }
  };

  // Verify Mail if user entered right verification code
  const verifyMail = async () => {
    const obj = {
      organizationId: organizations?._doc._id,
      userId: organizations?._doc.ownerId,
      verificationCode,
    };
    const mailVerificationResponse = await verifyMailCode(user, obj);
    if (mailVerificationResponse) {
      let { statusCode, message } = mailVerificationResponse;
      if (statusCode === 400) {
        Swal.fire("oops", message, "error");
      }
      if (statusCode === 200) {
        Swal.fire("Great Job", message, "success");
        router.push(`/org-confirmation/${organizations?._doc?._id}`);
      }
    }
  };
  // Verify phone if user entered right verification code
  const verifyPhone = async () => { };

  // Router user to dashboard page if user clicks on Sent Code through Mail button
  const getMailCode = (event) => {
    event.preventDefault();
    router.push("/dashboard");
  };

  return (
    <>
      <Layout>
        <div>
          <div className="py-30 custom-container mx-auto">
            {!showOnlyField ? (
              <div className="flex flex-col justify-center items-center">
                <h5 className="md:text-48 text-30 font-[700] mb-[32px]">
                  Verify your Organization
                </h5>

                <div className="sm:w-[630px] w-full">
                  <div className="mb-[32px] p-[16px] rounded-[16px] bg-[#FAFAFA] border">
                    <div className="flex justify-between items-center flex-wrap md:flex-nowrap">
                      <div className="md:mb-0 mb-[12px]">
                        <div className="items-center flex gap-[16px] flex-wrap md:flex-nowrap">
                          <div className="w-[40px] h-[40px] object-fill overflow-hidden rounded-[100%]">
                            <Image
                              alt="avatar"
                              src={`${process.env.CLOUDINARY_IMAGE_URL}${organizations?._doc.logo}`}
                              width="120"
                              height="120"
                              className="w-[100%] h-[100%] object-fill overflow-hidden rounded-[100%]"
                            />
                          </div>
                          <div>
                            <strong className="md:text-20 text-17 font-[700] mb-[4px] block">
                              {organizations?._doc.name}
                            </strong>
                            <span className="md:text-13 text-12 font-[400] text-[#43515C] block">
                              {organizations?._doc.street1}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center md:text-16 text-13 font-[400] mb-[32px]">
                    Choose a way to verify your organization. All verifications,
                    must match with the Organization on file.
                  </p>
                  <div className="mb-[32px]">
                    <button
                      onClick={sentCodeThoughPhone}
                      className="border mb-[16px] border-[#000] w-full px-[24px] py-[12px] hover:bg-themecolor hover:text-[#fff] hover:border-themecolor"
                    >
                      Phone
                    </button>
                    <button
                      onClick={sentCodeThoughEmail}
                      className="border mb-[16px] border-[#000] w-full px-[24px] py-[12px] hover:bg-themecolor hover:text-[#fff] hover:border-themecolor"
                    >
                      Email
                    </button>
                    <button
                      onClick={sentCodeThroughMail}
                      className="border mb-[16px] border-[#000] w-full px-[24px] py-[12px] hover:bg-themecolor hover:text-[#fff] hover:border-themecolor"
                    >
                      Send code through mail
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        {/*  Verify your Organization through mobile phone  */}

        {phoneToOrganization || showOnlyField ? (
          <div>
            <div className="py-30 custom-container mx-auto">
              <div className="flex flex-col justify-center items-center">
                <h5 className="md:text-48 text-30 font-[700] mb-[32px] text-center">
                  Verify your Organization
                </h5>
                <div className="sm:w-[630px] w-full">
                  <div className="flex justify-center flex-col mb-[22px]">
                    {!showOnlyField ? (
                      <>
                        <span className="text-center md:text-16 text-13 font-[400] mb-[10px]">
                          Sending a code to your mobile phone now.
                        </span>
                        <span className="text-center md:text-16 text-13 font-[400] mb-[10px]">
                          Sent to phone number ending in{" "}
                          <strong>***0506</strong>
                        </span>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex flex-col justify-center mb-[32px]">
                    <span className="text-center md:text-16 text-13 font-[400] mb-[10px] block">
                      Enter 6- Digit Code
                    </span>
                    <div className="flex justify-center">
                      <input
                        className="border border-black p-[12px] w-[175px]"
                        placeholder="000 - 000"
                        onChange={handleChange}
                        value={verificationCode}
                      />
                    </div>
                  </div>
                  <div className="mb-[32px]">
                    <button
                      onClick={showOnlyField ? verifyMail : verifyPhone}
                      className="border mb-[16px] border-[#000] w-full px-[24px] py-[12px] hover:bg-themecolor hover:text-[#fff] hover:border-themecolor"
                    >
                      Submit
                    </button>
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/*  Verify your Organization through email  */}
        {emailToOrganization ? (
          <div>
            <div className="py-30 custom-container mx-auto">
              <div className="flex flex-col justify-center items-center">
                <h5 className="md:text-48 text-30 font-[700] mb-[32px] text-center">
                  Verify your Organization
                </h5>
                <div className="sm:w-[630px] w-full">
                  <div className="flex justify-center flex-col mb-[22px]">
                    <span className="text-center md:text-16 text-13 font-[400] mb-[10px]">
                      Sending a code to your email now.
                    </span>
                    <span className="text-center md:text-16 text-13 font-[400] mb-[10px]">
                      Sent to email ending in{" "}
                      <strong>****456@frontstep.org</strong>
                    </span>
                  </div>
                  <div className="flex flex-col justify-center mb-[32px]">
                    <span className="text-center md:text-16 text-13 font-[400] mb-[10px] block">
                      Enter 6- Digit Code
                    </span>
                    <div className="flex justify-center">
                      <input
                        className="border border-black p-[12px] w-[175px]"
                        placeholder="000 - 000"
                        value={verificationCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mb-[32px]">
                    <button
                      onClick={verifyEmail}
                      className="border mb-[16px] border-[#000] w-full px-[24px] py-[12px] hover:bg-themecolor hover:text-[#fff] hover:border-themecolor"
                    >
                      Submit
                    </button>
                  </div>
              
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* Verify your Organization through mail*/}
        {mailToOrganization ? (
          <div>
            <div className="py-30 custom-container mx-auto">
              <div className="flex flex-col justify-center items-center">
                <h5 className="md:text-48 text-30 font-[700] mb-[32px] text-center">
                  Verify your Organization
                </h5>
                <div className="sm:w-[630px] w-full">
                  <div className="flex justify-center flex-col mb-[22px]">
                    <p className="text-center md:text-16 text-13 font-[400] mb-[10px]">
                      Sending a code through the address that is associated with
                      the organization. You’ll receive instructions and a code
                      on a post card within 3 - 5 business days
                    </p>
                  </div>
                  <div className="mb-[32px]">
                    <button
                      onClick={getMailCode}
                      className="border mb-[16px] border-[#000] w-full px-[24px] py-[12px] hover:bg-themecolor hover:text-[#fff] hover:border-themecolor"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </Layout>
    </>
  );
};

export async function getServerSideProps(context) {
  const { query } = context;
  const id = query.id;
  // Use the imported function to get props
  return {
    props: await getOrganizationServerSideProps(id),
  };
}
export default verifyOrganization;
