import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "../helpers/authHelper";
import Layout from "@/Layouts/layout1";
import FullPageLoader from "@/components/fullPageLoader";
import Image from "next/image";
import Select from "react-select";
import { organizationList } from "@/api/organizations";
import { connectUserWithOrganization } from "@/api/organizations";
import { searchOrganization } from "@/api/organizations";
import Swal from "sweetalert2";
const connectOrganization = () => {
  const user = isLoggedIn();
  const router = useRouter();
  const [fullPage, setFullPageLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchTermOption, setSearchTermOption] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [referralCode, setreferralCode] = useState();
  const [formData, setFormData] = useState({
    name: "",
    street1: "",
    logo: "",
  });
  let query = { all: "1" }; // Initialize the variable

  const [exsistingOrganization, setExsistingOrganization] = useState(false);
  const [hideSteps, setHideSteps] = useState(false);
  const [referralCodeOrganization, setReferralCodeOrganization] =
    useState(false);

  const getOrganizationData = async () => {
    setFullPageLoading(true);
    const getOrganizationResponse = await organizationList(query);
    if (getOrganizationResponse) {
      const { organizations } = getOrganizationResponse?.data;
      setOrganizations(organizations);
    }
    setFullPageLoading(false);
  };
  useEffect(() => {
    if (!user && !user?.token) {
      router.push("/");
    }
    getOrganizationData();
  }, []);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleChange = (e) => {
    setreferralCode(e.target.value);
  };
  // Handle search input change
  const handleSearchChange = async (selectedOption) => {
    if (selectedOption) {
      setSearchTermOption(selectedOption);
      // Trigger the search API call here using the debounced function
      debouncedSearchOrganization(user, { id: selectedOption.value });
    }
  };
  // Use debounce to create a debounced version of search organization
  const debouncedSearchOrganization = debounce(async (user, searchTerm) => {
    const response = await searchOrganization(user, searchTerm);
    if (response) {
      const { organizations } = response;
      setFormData({
        name: organizations[0]?.name,
        street1: organizations[0]?.street1,
        logo: organizations[0]?.logo,
      });
    }
  }, 300);
  // User can select the uptp 3 organizations types
  const handleSelectChange = (selected) => {
    if (selected && selected.length > 3) {
      // If more than 3 options are selected, remove the last option
      selected.pop();
    }
    setSelectedOptions(selected);
  };
  // Connect user with organization
  const makeConnectionWithUserOrganization = async () => {
    const obj = {
      organizationId: selectedOptions?.value,
      userId: user?.userId,
      referralCode,
    };
    setFullPageLoading(true);
    const connectResponse = await connectUserWithOrganization(user, obj);
    if (connectResponse) {
      setFullPageLoading(false);
      let { statusCode, message } = connectResponse;
      if (statusCode === 400) {
        Swal.fire("oops", message, "error");
        return;
      }
      if (statusCode === 500) {
        Swal.fire("oops", message, "error");
        return;
      }
      router.push("/request-sent");
    }
  };

  const organizationPart = () => {
    setExsistingOrganization(true);
    setReferralCodeOrganization(false);
    setHideSteps(true);
  };
  const referralOrganization = () => {
    setReferralCodeOrganization(true);
    setExsistingOrganization(false);
    setHideSteps(true);
  };

  const makeConnectionWithOrganization = async () => {
  
    const obj = {
      organizationId: searchTermOption?.value,
      userId: user?.userId,
      referralCode,
    };
    setFullPageLoading(true);
    const connectResponse = await connectUserWithOrganization(user, obj);
    if (connectResponse) {
      setFullPageLoading(false);
      let { statusCode, message } = connectResponse;
      if (statusCode === 400) {
        Swal.fire("oops", message, "error");
        return;
      }
      if (statusCode === 500) {
        Swal.fire("oops", message, "error");
        return;
      }
      router.push("/request-sent");
    }
  };

  const stepToOrganization = () => {
    setHideSteps(false);
    setExsistingOrganization(false);
    setReferralCodeOrganization(false);
  };

  return fullPage ? (
    <FullPageLoader />
  ) : (
    <>
      <Layout user={user}>
        {/* Connect to an Organization */}
        <div>
          <div className="py-30 custom-container mx-auto">
            {!hideSteps ? (
              <div className="auth-form-holder">
                <h5 className="md:text-48 text-30 font-[700] mb-[32px]">
                  Connect to an Organization
                </h5>
                <div className="sm:w-[630px] w-full">
                  <p className="text-[13px] md:text-[16px] font-[400] mb-[32px] text-center">
                    We’ll use this step to personalize your experience. How do
                    you want to find your organization?
                  </p>

                  <div className="mb-[32px]">
                    <button
                      onClick={organizationPart}
                      className="border mb-[16px] border-[#000] w-full px-[24px] py-[12px] hover:bg-themecolor hover:text-[#fff] hover:border-themecolor"
                    >
                      Look to be a part of an existing organization
                    </button>
                    <button
                      onClick={referralOrganization}
                      className="border mb-[16px] border-[#000] w-full px-[24px] py-[12px] hover:bg-themecolor hover:text-[#fff] hover:border-themecolor"
                    >
                      I have a Referral code
                    </button>
                    <button
                      onClick={organizationPart}
                      className="border mb-[16px] border-[#000] w-full px-[24px] py-[12px] hover:bg-themecolor hover:text-[#fff] hover:border-themecolor"
                    >
                      I own an organization
                    </button>
                  </div>
                </div>
                <span className="text-[13px] md:text-[16px] font-[400] block mb-[10px]">
                  Skip{" "}
                  <Link className="underline" href={"/dashboard"}>
                    Go to Dashboard
                  </Link>
                </span>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        {/* Connect to an Organization Step 1  */}
        {referralCodeOrganization ? (
          <div>
            <div className="py-30 custom-container mx-auto">
              <div className="flex flex-col justify-center items-center">
                <h5 className="md:text-48 text-30 font-[700] mb-[42px]">
                  Connect to an Organization
                </h5>
                <div className="sm:w-login-form w-full">
                  <div className="mb-[32px] flex gap-[10px] flex-wrap md:flex-nowrap">
                    <div className="w-full md:w-[66%]">
                      <label className="text-[13px] md:text-[16px] font-[400] block mb-[10px]">
                        Select one organization to send a request to.{" "}
                      </label>
                      <div>
                        <Select
                          classNamePrefix="custom-select"
                          placeholder="Organizations"
                          onChange={handleSelectChange}
                          value={selectedOptions}
                          options={organizations.map((org) => ({
                            label: org.name,
                            value: org._id,
                          }))}
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-[34%]">
                      <label className="text-[13px] md:text-[16px] font-[400] block mb-[10px]">
                        OR Enter Referral Code
                      </label>
                      <input
                        className="border border-[#000] p-[12px] w-full"
                        placeholder="000 - 000"
                        value={referralCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mb-[32px]">
                    <button
                      onClick={makeConnectionWithUserOrganization}
                      className="border mb-[16px] border-[#000] w-full px-[24px] py-[12px] hover:bg-themecolor hover:text-[#fff] hover:border-themecolor"
                    >
                      Next
                    </button>
                  </div>
                </div>
                <span className="text-[13px] md:text-[16px] font-[400] block mb-[10px]">
                  Skip{" "}
                  <Link className="underline" href={"/"}>
                    Go to Dashboard
                  </Link>
                </span>
              </div>
              <button
                onClick={stepToOrganization}
                className="border mb-[16px] border-[#000] px-[24px] py-[12px] hover:bg-themecolor hover:text-[#fff] hover:border-themecolor"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/*  Connect to an Organization Step 3 */}
        {exsistingOrganization ? (
          <div>
            <div className="py-30 custom-container mx-auto">
              <div className="flex flex-col justify-center items-center">
                <h5 className="md:text-48 text-30 font-[700] mb-[32px]">
                  Connect to an Organization
                </h5>
                <div className="sm:w-[630px] w-full">
                  <div className="mb-[32px]">
                    <div className="w-full">
                      <label className="text-[13px] md:text-[16px] font-[400] block mb-[10px]">
                        We might already have your organization in our system!
                      </label>
                      <div className="relative">
                        <Select
                          classNamePrefix="custom-select"
                          placeholder="Select Organizations"
                          onChange={handleSearchChange}
                          value={searchTermOption}
                          options={organizations.map((org) => ({
                            label: org.name,
                            value: org._id,
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-[32px] p-[16px] rounded-[16px] bg-[#FAFAFA] border">
                    <div className="flex justify-between items-center flex-wrap md:flex-nowrap">
                      {formData.name || formData.street1 || formData.logo ? (
                        <>
                          <div className="md:mb-0 mb-[12px]">
                            <div className="items-center flex gap-[16px] flex-wrap md:flex-nowrap">
                              <div className="w-[40px] h-[40px] object-fill overflow-hidden rounded-[100%]">
                                <Image
                                  alt="avatar"
                                  src={`${process.env.CLOUDINARY_IMAGE_URL}${formData?.logo}`}
                                  width="120"
                                  height="120"
                                  className="w-[100%] h-[100%] object-fill overflow-hidden rounded-[100%]"
                                />
                              </div>
                              <div>
                                <strong className="md:text-20 text-17 font-[700] mb-[4px] block">
                                  {formData.name}
                                </strong>
                                <span className="md:text-13 text-12 font-[400] text-[#43515C] block">
                                  {formData.street1}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col md:justify-end">
                            <div className="flex md:justify-end mb-[10px]">
                              <button
                                onClick={makeConnectionWithOrganization}
                                className="py-[8px] px-[20px] hover:bg-transparent hover:text-themecolor bg-themecolor border border-themecolor text-white text-[14px] md:text-[16px] rounded-[4px]"
                              >
                                Claim
                              </button>
                            </div>
                            <span className="md:text-13 text-12 font-[400] text-[#43515C] block">
                              This organization has not been claimed
                            </span>
                          </div>
                        </>
                      ) : (
                        <p>No data available</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-[32px]"></div>
                </div>
                <span className="text-[13px] md:text-[16px] font-[400] block mb-[10px]">
                  Can’t find what you’re looking for?{" "}
                  <Link className="underline" href={"/create-org"}>
                    Create a New Organization Listing
                  </Link>
                </span>
              </div>
              <button
                onClick={stepToOrganization}
                className="border mb-[16px] border-[#000] px-[24px] py-[12px] hover:bg-themecolor hover:text-[#fff] hover:border-themecolor"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </Layout>
    </>
  );
};

export default connectOrganization;
