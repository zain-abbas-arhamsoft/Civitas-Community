import "flowbite";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import avatar from "../../assets/images/avatar.png";
import { useRouter } from "next/router";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  faChevronDown,
  faEllipsis,
  faLocationDot,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {
  filterByOrganizationId,
  getSimilarOrganizationId,
  ownerOforganization,
} from "@/api/organizations";
import { isLoggedIn } from "@/helpers/authHelper";
import Layout from "@/Layouts/layout4";
function Organization_Interior({
  organizations,
  organizationTypes: propOrganizationTypes,
}) {
  const router = useRouter();
  const user = isLoggedIn();
  const [isUserOwn, setIsOwnUser] = useState(false);
  const goToOrganizationVisitPage = () => {
    router.push(`/organization-visit/${organizations?._doc?._id}`);
  };

  const isOwnerOfOrganization = async () => {
    const obj = {
      organizationId: organizations?._doc?._id,
      userId: user?.userId,
    };
    const response = await ownerOforganization(user, obj);
    if (response) {
      const { success } = response;
      setIsOwnUser(success);
    }
  };
  const goToOrganizationUserOverview = (event) => {
    event.preventDefault();

    router.push(`/org-user-overview/${organizations?._doc?._id}`);
  };

  const goToApplyForResources = (event) => {
    event.preventDefault();
    router.push(`/apply-for-resources/${organizations?._doc?._id}`);
  };
  useEffect(() => {
    isOwnerOfOrganization();
  }, []);
  return (
    <>
      <Layout>
        <div className="wrapper h-[100%]">
          <div className="bg-grey2 overflow-hidden h-[100vh]">
            <div className="p-8">
              <div className="top-head py-[16px] px-[32px] gap-[48px] flex justify-between items-center mb-[34px]">
                <div className="gap-[48px] flex flex-wrap">
                  <Link href={""}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12.0002 19.9902L13.4085 18.582L7.83545 12.999L19.9902 12.999V11.0015L7.83545 11.0015L13.4085 5.41847L12.0002 4.01023L4.01023 12.0002L12.0002 19.9902Z"
                        fill="#43515C"
                      />
                    </svg>
                  </Link>
                  <div>
                    <h2 className="md:text-[24px] text-[18px] text-themecolor font-[700] mb-[10px]">
                      Search for Resources
                    </h2>
                    <p className="md:text-[16px] text-[14px] text-black font-[400]">
                      Find resources in your area. These are all in our
                      community and regularly updated.
                    </p>
                  </div>
                </div>
                <div>
                  <FontAwesomeIcon icon={faEllipsis} />
                </div>
              </div>
              <div className="relative">
                <div className="flex flex-wrap xl:flex-nowrap gap-[16px] xl:relative top-[0] overflow-auto xxl:h-[0px] h-[800px] mb-[10px]">
                  <div className="xl:w-[15%] w-full h-full shadow-[#00000040] shadow-sm rounded-[10px] bg-white py-[24px] px-[32px] flex flex-col gap-[16px]">
                    <div className="flex justify-between flex-wrap">
                      <h2 className="md:text-[16px] text-[14px] text-themecolor font-[700]">
                        Filtres
                      </h2>
                      <span className="md:text-[13px] text-[12px] text-black font-[400]">
                        Clear all
                      </span>
                    </div>
                    <span className="md:text-[14px] text-[13px] text-black font-[400] border-b border-b-[#4066b033] block pb-[16px]">
                      Showing 0 of 100
                    </span>
                    <div className="pb-[16px] border-b border-b-[#4066b033]">
                      <div className="flex justify-between flex-wrap mb-[10px]">
                        <h2 className="md:text-[16px] text-[14px] text-black font-[700]">
                          Zipcode
                        </h2>
                        <span className="md:text-[13px] text-[12px] text-black font-[400]">
                          Clear
                        </span>
                      </div>
                      <div className="py-[8px] px-[12px] border border-[#4066b033] rounded-[4px] gap-[8px] flex">
                        <div>
                          <FontAwesomeIcon icon={faLocationDot} />
                        </div>
                        <span className="md:text-[16px] text-[14px] text-black font-[400]">
                          Zip
                        </span>
                      </div>
                    </div>
                    <div className="pb-[16px] border-b border-b-[#4066b033]">
                      <div className="flex justify-between flex-wrap mb-[10px]">
                        <h2 className="md:text-[16px] text-[14px] text-black font-[700]">
                          Primary Services
                        </h2>
                        <span className="md:text-[13px] text-[12px] text-black font-[400]">
                          Clear
                        </span>
                      </div>
                      <div>
                        <Select
                          classNamePrefix="custom-select"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between flex-wrap mb-[15px]">
                        <h2 className="md:text-[16px] text-[14px] text-black font-[700]">
                          Hours of Operation
                        </h2>
                        <span className="md:text-[13px] text-[12px] text-black font-[400]">
                          Clear
                        </span>
                      </div>
                      <ul>
                        <li className="mb-[22px]">
                          <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                            <input
                              id="default-checkbox"
                              type="checkbox"
                              value=""
                              class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              for="default-checkbox"
                              class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                            >
                              Weekdays 8am- 5pm
                            </label>
                          </div>
                        </li>
                        <li className="mb-[22px]">
                          <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                            <input
                              id="default-checkbox"
                              type="checkbox"
                              value=""
                              class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              for="default-checkbox"
                              class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                            >
                              Weekdays After 5pm
                            </label>
                          </div>
                        </li>
                        <li className="mb-[22px]">
                          <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                            <input
                              id="default-checkbox"
                              type="checkbox"
                              value=""
                              class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              for="default-checkbox"
                              class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                            >
                              Weekends 8am- 5pm{" "}
                            </label>
                          </div>
                        </li>
                        <li className="mb-[22px]">
                          <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                            <input
                              id="default-checkbox"
                              type="checkbox"
                              value=""
                              class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              for="default-checkbox"
                              class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                            >
                              Weekdays After 5pm
                            </label>
                          </div>
                        </li>
                        <li className="mb-[22px]">
                          <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                            <input
                              id="default-checkbox"
                              type="checkbox"
                              value=""
                              class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              for="default-checkbox"
                              class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                            >
                              24/7
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="static xl:sticky top-0 xl:w-[65%] w-full h-full">
                    <div
                      className="
                
                shadow-[#00000040] shadow-sm rounded-[10px] bg-white xxl:py-[32px] xxl:px-[80px] py-[32px] px-[30px] flex flex-col"
                    >
                      {isUserOwn ? (
                        <>
                          <div className="p-[32px] bg-[#69fe8166] border gap-[32px] flex flex-wrap md:flex-nowrap mb-[10px] rounded-[10px]">
                            <div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="90"
                                height="90"
                                viewBox="0 0 90 90"
                                fill="none"
                              >
                                <path
                                  d="M45 7.5C24.3 7.5 7.5 24.3 7.5 45C7.5 65.7 24.3 82.5 45 82.5C65.7 82.5 82.5 65.7 82.5 45C82.5 24.3 65.7 7.5 45 7.5ZM45 75C28.4625 75 15 61.5375 15 45C15 28.4625 28.4625 15 45 15C61.5375 15 75 28.4625 75 45C75 61.5375 61.5375 75 45 75ZM59.55 31.0875L37.5 53.1375L30.45 46.0875C29.7488 45.3863 28.7978 44.9924 27.8062 44.9924C26.8147 44.9924 25.8637 45.3863 25.1625 46.0875C24.4613 46.7887 24.0674 47.7397 24.0674 48.7313C24.0674 49.7228 24.4613 50.6738 25.1625 51.375L34.875 61.0875C36.3375 62.55 38.7 62.55 40.1625 61.0875L64.875 36.375C65.2226 36.0281 65.4984 35.616 65.6866 35.1623C65.8748 34.7087 65.9717 34.2224 65.9717 33.7312C65.9717 33.2401 65.8748 32.7538 65.6866 32.3002C65.4984 31.8465 65.2226 31.4344 64.875 31.0875C63.4125 29.625 61.0125 29.625 59.55 31.0875Z"
                                  fill="#68CA78"
                                />
                              </svg>
                            </div>
                            <div>
                              <h2 className="text-[18px] md:text-[24px] mb-[10px] font-[700]">
                                Thank You for Creating an Organization!
                              </h2>
                              <p className="text-[14px] md:text-[16px] mb-[10px] font-[400] xxl:w-[1032px]">
                                Since you have created an organization, you will
                                be stated as Admin of the organization. You’ ll
                                then be able to connect or create a wallet,
                                manage a team, and request documents.
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-[10px] justify-end mb-[16px]">
                            <button
                              onClick={goToOrganizationUserOverview}
                              className="bg-themecolor min-w-[82px] text-white text-[16px] py-[8px] px-[20px] hover:bg-transparent border border-themecolor hover:text-themecolor rounded-[4px]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={goToApplyForResources}
                              className="bg-themecolor min-w-[82px] text-white text-[16px] py-[8px] px-[20px] hover:bg-transparent border border-themecolor hover:text-themecolor rounded-[4px]"
                            >
                              Apply
                            </button>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faSearch}
                          className="absolute left-[12px] top-[12px] w-[16px] h-[16px]"
                        />
                        <input
                          placeholder="Search"
                          className="py-[8px] px-[12px] ps-[32px] bg-[#FAFAFA] border border-[#4066b033] rounded-[4px] w-full"
                        />
                      </div>
                      <div className="flex justify-between flex-wrap mb-[16px] items-center gap-[8px] py-[16px]">
                        <div className="flex gap-[10px] items-center">
                          <span className="md:text-[16px] text-[14px] text-black font-[400]">
                            Sort by
                          </span>
                          <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                      </div>
                      <div className="flex-wrap flex gap-[32px] py-[24px] px-[32px] justify-between bg-[#FAFAFA] border border-[#4066b033] rounded-[10px] mb-[16px] shadow-[#00000040] shadow-sm items-end">
                        <div className="flex flex-wrap gap-[32px]">
                          <div className="w-[56px] h-[56px] object-fill rounded-[100%]">
                            <Image
                              className="w-full h-full"
                              src={`${process.env.CLOUDINARY_IMAGE_URL}${organizations?._doc?.logo}`}
                              width="120"
                              height="120"
                              alt="logo"
                            />
                          </div>
                          <div>
                            <h2 className="md:text-[20px] text-[18px] text-black font-[700] mb-[10px]">
                              {organizations?._doc?.name}
                            </h2>
                            <span className="md:text-[14px] text-[13px] text-black font-[400] mb-[16px] block">
                              {organizations?._doc?.street1}
                            </span>
                            <ul className="flex flex-wrap gap-[16px]">
                              {propOrganizationTypes &&
                                propOrganizationTypes?.similarOrganizations?.map(
                                  (organization) => (
                                    <>
                                      <li className="mb-[8px]">
                                        <span className="tag py-[4px] px-[8px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center min-w-[90px]">
                                          {organization?.type?.name}
                                        </span>
                                      </li>
                                    </>
                                  )
                                )}
                            </ul>
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={goToOrganizationVisitPage}
                            className="py-[8px] px-[20px] w-full bg-themecolor hover:bg-white text-white hover:text-themecolor border border-themecolor rounded-[4px]"
                          >
                            View Resource
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="xl:w-[20%] h-max w-full shadow-[#00000040] shadow-sm rounded-[10px] bg-white py-[24px] px-[32px] flex flex-col gap-[16px]">
                    <h2 className="md:text-[20px] text-[18px] text-themecolor font-[700]">
                      Recommendations
                    </h2>
                    <p className="font-[400] md:text-[16px] text-[14px]">
                      Recommendations based on your profiles proximity and
                      previous searches
                    </p>

                    {propOrganizationTypes &&
                      propOrganizationTypes.similarOrganizations?.map(
                        (organization) => (
                          <div className="py-[16px] px-[24px] justify-between bg-[#FAFAFA] border border-[#4066b033] rounded-[10px] mb-[16px] shadow-[#00000040] shadow-sm">
                            <div className="flex gap-[10px] mb-[16px] flex-wrap">
                              <div className="w-[35px] h-[35px] object-fill rounded-full">
                                <Image
                                  src={avatar}
                                  className="w-full h-full"
                                  alt="avatar"
                                />
                              </div>
                              <div>
                                <strong className="font-[700] md:text-[14px] text-[13px] block">
                                  {organization?.name}
                                </strong>
                                <span>
                                  <FontAwesomeIcon
                                    className="w-[16px] h-[16px]"
                                    icon={faLocationDot}
                                  />{" "}
                                  0.5 miles away
                                </span>
                              </div>
                            </div>

                            {organization &&
                              organization?.type?.map((organization) => (
                                <ul className="mb-[16px] flex gap-[4px] flex-wrap">
                                  <li className="mb-[8px]">
                                    <span className="tag py-[4px] px-[8px] rounded-[4px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center">
                                      {organization?.name}
                                    </span>
                                  </li>
                                </ul>
                              ))}
                            <button className="bg-transparent text-themecolor text-[16px] py-[8px] px-[20px] border border-themecolor hover:text-white hover:bg-themecolor xl:w-full rounded-[4px] ">
                              View More
                            </button>
                          </div>
                        )
                      )}
                  </div>
                </div>
                <div className="xl:w-[20%] w-full shadow-[#00000040] shadow-sm rounded-[10px] bg-white py-[24px] px-[32px] flex flex-col gap-[16px]">
                  <h2 className="md:text-[20px] text-[18px] text-themecolor font-[700]">
                    Recommendations
                  </h2>
                  <p className="font-[400] md:text-[16px] text-[14px]">
                    Recommendations based on your profiles proximity and
                    previous searches
                  </p>

                  {propOrganizationTypes &&
                    propOrganizationTypes.similarOrganizations?.map(
                      (organization) => (
                        <div className="py-[16px] px-[24px] justify-between bg-[#FAFAFA] border border-[#4066b033] rounded-[10px] mb-[16px] shadow-[#00000040] shadow-sm">
                          <div className="flex gap-[10px] mb-[16px] flex-wrap">
                            <div className="w-[35px] h-[35px] object-fill rounded-full">
                              <Image
                                src={`${process.env.CLOUDINARY_IMAGE_URL}${organization?.logo}`}
                                width="120"
                                height="120"
                                className="w-full h-full"
                                alt="avatar"
                              />
                            </div>
                            <div>
                              <strong className="font-[700] md:text-[14px] text-[13px] block">
                                {organization?.name}
                              </strong>
                              <span className="block">
                                <FontAwesomeIcon icon={faLocationDot} /> 0.5
                                miles away
                              </span>
                            </div>
                          </div>

                          {organization &&
                            organization?.type?.map((organization) => (
                              <ul className="mb-[16px] flex gap-[4px] flex-wrap">
                                <li className="mb-[8px]">
                                  <span className="tag py-[4px] px-[8px] rounded-[4px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center">
                                    {organization?.name}
                                  </span>
                                </li>
                              </ul>
                            ))}
                          <button className="bg-transparent text-themecolor text-[16px] py-[8px] px-[20px] hover:bg-transparent border border-themecolor hover:text-white hover:bg-themecolor xl:w-full rounded-[4px] ">
                            View More
                          </button>
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const id = query.id;
  let response = null; // Initialize response variable
  let organizations = await filterByOrganizationId({ id: id });
  let { updatedOrganizationDetails } = organizations;
  if (updatedOrganizationDetails?._doc?.type) {
    // Fetching similar organization data based on the type
    response = await getSimilarOrganizationId({
      _id: updatedOrganizationDetails?._doc?._id,
      type: updatedOrganizationDetails?._doc?.type,
    });
  }
  // Use the imported function to get props
  return {
    props: {
      organizations: organizations?.updatedOrganizationDetails, // Include the response in the props object
      organizationTypes: response,
      // You can include other props here if needed
    },
  };
}

export default Organization_Interior;
