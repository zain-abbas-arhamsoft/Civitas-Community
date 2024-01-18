import React, { useState, useEffect } from "react";
import "flowbite";
import Image from "next/image";
import AvatarSampleImg from "../../assets/images/sample-img.png";
import ArmyLogo from "../../assets/images/army-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { isLoggedIn } from "../../helpers/authHelper";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Layout from "@/Layouts/layout3";
import FullPageLoader from "@/components/fullPageLoader";
import {
  organizationDeatil,
  getRewardDetailsofOrg,
  getRewardCollectionInOrg,
} from "@/api/organizations";
import { updateUserReward } from "@/api/users";

function ManageOrganization() {
  const user = isLoggedIn();
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("");
  const [userPendingReward, setUserPendingReward] = useState([]);
  const [pendingReward, setPendingReward] = useState(0);
  const [givenReward, setGivenReward] = useState(0);
  const [organizations, setOrganizations] = useState({});
  const [refreshFlag, setRefreshFlag] = useState(false);
  const router = useRouter();
  const { orgId } = router.query;

  const getOrganizationDetail = async () => {
    const response = await organizationDeatil({ orgId });
    if (response) {
      setLoading(false);
      const { statusCode, data } = response;
      if (statusCode === 200) {
        setOrganizations(data[0]);
        const date = new Date(data[0].rulingYear);
        setYear(date.getFullYear());
        setLoading(false);
      }
    }
  };
  const getRewardOfOrg = async () => {
    const res = await getRewardDetailsofOrg(user, orgId);
    let { statusCode } = res;
    if (statusCode === 403) {
      router.push("/");
    }
    if (res) {
      let { statusCode, rewardDeatilsPending } = res;
      if (statusCode === 200) {
        setLoading(false);
        setUserPendingReward(rewardDeatilsPending);
        return;
      }
    }
  };
  const getRewardCollectionOfOrg = async () => {
    const res = await getRewardCollectionInOrg(user, orgId);
    if (res) {
      let { statusCode, rewardDeatilsPending, rewardDeatilsapproved } = res;
      if (statusCode === 200) {
        setLoading(false);
        setGivenReward(rewardDeatilsapproved[0]?.totalMoneyGiven);
        setPendingReward(rewardDeatilsPending[0]?.totalMoneyPending);
        return;
      }
    }
  };

  const rejectReward = async (A) => {
    setRefreshFlag(true);
    const response = await updateUserReward(user, {
      rewardId: A,
      status: 2,
    });
    if (response.success === true) {
      setRefreshFlag(true);
      setLoading(true);
    }
  };

  useEffect(() => {
    if (orgId) {
      setLoading(true);
      getOrganizationDetail();
      getRewardOfOrg();
      getRewardCollectionOfOrg();
    }
  }, [orgId]);

  useEffect(() => {
    if (refreshFlag && orgId) {
      setRefreshFlag(false);
      getRewardOfOrg();
      getRewardCollectionOfOrg();
    }
  }, [refreshFlag]);

  return (
    <>
      {loading ? (
        <FullPageLoader />
      ) : (
        <Layout image={AvatarSampleImg}>
          <>
            <div className="wrapper flex">
              <div className="bg-grey2 h-full w-full">
                <div className="p-8">
                  <div className="hading-card p-[24px] mb-[16px]">
                    <h2 className="text-[18px] md:text-[24px] mb-[16px] font-bold text-themecolor">
                      My SolacePRO Profile
                    </h2>
                    <p className="text-[13px] md:text-[16px] font-[400]">
                      You have admin access to manage your Solace Members, view
                      data analytics, and distribute rewards to organizations.
                    </p>
                  </div>
                  <div className="md:py-[32px] md:px-[48px] p-[17px] border bg-[#fff] rounded-[16px] border-[#4066b033] shadow-[#00000040] shadow-sm flex flex-col justify-center mb-[16px]">
                    <div className="flex justify-between items-center flex-wrap mb-[32px]">
                      <h2 className="text-[18px] mb-[16px] md:text-[24px] leading-[33px] font-[700] text-themecolor">
                        Manage Organizations
                      </h2>
                    </div>
                    <div className="flex gap-[24px] flex-wrap xl:flex-nowrap flex-[1 0 0] gap-[20px] bg-[#FAFAFA] border border-[#4066b033] py-[24px] px-[32px] rounded-[10px]">
                      <div className="flex w-full flex-wrap lg:flex-nowrap gap-[48px]">
                        <div className="w-full lg:w-[80%]">
                          <div className="flex gap-[48px] flex-wrap md:flex-nowrap">
                            <div>
                              <div className="w-[100px] h-[111px] object-fill overflow-hidden">
                                {organizations?.logo ? (
                                  <Image
                                    className="w-full h-full rounded-[100%] overflow-hidden"
                                    src={`${process.env.CLOUDINARY_IMAGE_URL}${organizations.logo}`}
                                    alt="avatar"
                                    height={120}
                                    width={60}
                                  />
                                ) : (
                                  <Image
                                    className="w-full h-full"
                                    alt=""
                                    src={ArmyLogo}
                                  />
                                )}
                              </div>
                            </div>
                            <div>
                              <h2 className="text-[30px] mb-[16px] md:text-[20px] font-[700]">
                                {organizations?.name && organizations.name}
                              </h2>
                              <ul className="list-none m-0 p-0">
                                <li className="block text-[13px] font-[400] mb-[16px]">
                                  {organizations?.street1 &&
                                    organizations.street1}{" "}
                                  {organizations?.city && organizations.city},{" "}
                                  {organizations?.state && organizations.state}
                                </li>
                                <li className="block text-[13px] font-[400] mb-[16px]">
                                  Hours of Operation:{" "}
                                  {organizations?.hoursOfOperation &&
                                    organizations.hoursOfOperation}
                                </li>
                                <li className="block text-[13px] font-[400] mb-[16px]">
                                  Phone:{" "}
                                  {organizations?.phone && organizations.phone}
                                </li>
                              </ul>

                              <div>
                                <h2 className="text-[30px] mb-[16px] md:text-[20px] font-[700]">
                                  Mission Statement
                                </h2>
                                <div className="flex flex-wrap md:flex-nowrap gap-[16px]">
                                  <div className="w-full md:w-[50%]">
                                    <p>
                                      {organizations?.missionStatement &&
                                        organizations.missionStatement}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h2 className="text-[30px] mb-[16px] md:text-[24px] font-[700]">
                                  Services
                                </h2>

                                <div
                                  id="accordion-collapse"
                                  data-accordion="collapse"
                                >
                                  <h2 id="accordion-collapse-heading-1">
                                    <button
                                      type="button"
                                      class="bg-[#F6F9FF] border border-[#4066b033] text-[12px] text-[#000] font-[600] sm:text-[16px] flex items-center justify-between w-full p-5 "
                                      data-accordion-target="#accordion-collapse-body-1"
                                      aria-expanded="true"
                                      aria-controls="accordion-collapse-body-1"
                                    >
                                      <span className="text-[12px] text-[#000] font-[600] sm:text-[16px]">
                                        Rental Assistance
                                      </span>

                                      <FontAwesomeIcon icon={faChevronDown} />
                                    </button>
                                  </h2>
                                  <div
                                    id="accordion-collapse-body-1"
                                    class="hidden"
                                    aria-labelledby="accordion-collapse-heading-1"
                                  >
                                    <div class="p-5 border border-b-0 border-gray-200 dark:border-gray-700 bg-[#F6F9FF]">
                                      <p class="mb-2 text-gray-500 dark:text-gray-400">
                                        The Salvation Army of the Coastal Bend
                                        is able to provide utility and rental
                                        assistance through the ESG CV-Rental
                                        Assistance Grant. These funds are
                                        provided by The City of Corpus Christi
                                        through the Cares Act and is intended to
                                        help those impacted financially by
                                        COVID-19.
                                      </p>
                                    </div>
                                  </div>
                                  <h2
                                    id="accordion-collapse-heading-2"
                                    className="bg-[#f4f4f4]"
                                  >
                                    <button
                                      type="button"
                                      class="bg-[#F6F9FF] border border-[#4066b033] text-[12px] text-[#000] font-[600] sm:text-[16px] flex items-center justify-between w-full p-5 "
                                      data-accordion-target="#accordion-collapse-body-2"
                                      aria-expanded="true"
                                      aria-controls="accordion-collapse-body-2"
                                    >
                                      <span className="text-[12px] text-[#000] font-[600] sm:text-[16px]">
                                        Service
                                      </span>

                                      <FontAwesomeIcon icon={faChevronDown} />
                                    </button>
                                  </h2>
                                  <div
                                    id="accordion-collapse-body-2"
                                    class="hidden"
                                    aria-labelledby="accordion-collapse-heading-2"
                                  >
                                    <div class="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
                                      <p class="mb-2 text-gray-500 dark:text-gray-400">
                                        Flowbite is first conceptualized and
                                        designed using the Figma software so
                                        everything you see in the library has a
                                        design equivalent in our Figma file.
                                      </p>
                                      <p class="text-gray-500 dark:text-gray-400">
                                        Check out the{" "}
                                        <a
                                          href="https://flowbite.com/figma/"
                                          class="text-blue-600 dark:text-blue-500 hover:underline"
                                        >
                                          Figma design system
                                        </a>{" "}
                                        based on the utility classes from
                                        Tailwind CSS and components from
                                        Flowbite.
                                      </p>
                                    </div>
                                  </div>
                                  <h2 id="accordion-collapse-heading-3">
                                    <button
                                      type="button"
                                      class="bg-[#F6F9FF] border border-[#4066b033] text-[12px] text-[#000] font-[600] sm:text-[16px] flex items-center justify-between w-full p-5 "
                                      data-accordion-target="#accordion-collapse-body-3"
                                      aria-expanded="true"
                                      aria-controls="accordion-collapse-body-3"
                                    >
                                      <span className="text-[12px] text-[#000] font-[600] sm:text-[16px]">
                                        Service
                                      </span>

                                      <FontAwesomeIcon icon={faChevronDown} />
                                    </button>
                                  </h2>
                                  <div
                                    id="accordion-collapse-body-3"
                                    class="hidden"
                                    aria-labelledby="accordion-collapse-heading-3"
                                  >
                                    <div class="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                      <p class="mb-2 text-gray-500 dark:text-gray-400">
                                        The main difference is that the core
                                        components from Flowbite are open source
                                        under the MIT license, whereas Tailwind
                                        UI is a paid product. Another difference
                                        is that Flowbite relies on smaller and
                                        standalone components, whereas Tailwind
                                        UI offers sections of pages.
                                      </p>
                                      <p class="mb-2 text-gray-500 dark:text-gray-400">
                                        However, we actually recommend using
                                        both Flowbite, Flowbite Pro, and even
                                        Tailwind UI as there is no technical
                                        reason stopping you from using the best
                                        of two worlds.
                                      </p>
                                      <p class="mb-2 text-gray-500 dark:text-gray-400">
                                        Learn more about these technologies:
                                      </p>
                                      <ul class="pl-5 text-gray-500 list-disc dark:text-gray-400">
                                        <li>
                                          <a
                                            href="https://flowbite.com/pro/"
                                            class="text-blue-600 dark:text-blue-500 hover:underline"
                                          >
                                            Flowbite Pro
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            href="https://tailwindui.com/"
                                            rel="nofollow"
                                            class="text-blue-600 dark:text-blue-500 hover:underline"
                                          >
                                            Tailwind UI
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full lg:w-[20%]">
                          <ul className="flex flex-wrap gap-[8px] border-b border-[#4066b033] py-[24px]">
                            {organizations.typeInfo &&
                              organizations.typeInfo.map((Info, index) => (
                                <li className="py-[4px] px-[8px] bg-[#efe3ff] rounded-[4px] flex justify-center items-center min-h-[18px] min-w-[60px] mb-[10px]">
                                  <span className="text-[12px] font-[400]">
                                    {Info.name}
                                  </span>
                                </li>
                              ))}
                          </ul>
                          <div className="border-b border-[#4066b033] py-[24px]">
                            <span className="text-themecolor text-[13px]">
                              <strong>Website:</strong>{" "}
                              {organizations?.websiteAboutOrganization &&
                                organizations.websiteAboutOrganization}
                            </span>
                          </div>
                          <div>
                            <div className="pt-[16px] mb-[16px]">
                              <strong className="md:text-[16px] text-[13px] font-[700] block text-themecolor">
                                Ruling year:{" "}
                              </strong>
                              <p className="md:text-[14px] text-[13px] font-[400] block text-themecolor">
                                {organizations?.rulingYear && year}
                              </p>
                            </div>

                            <div className="pt-[16px] mb-[16px]">
                              <strong className="md:text-[16px] text-[13px] font-[700] block text-themecolor">
                                Head of Organization:{" "}
                              </strong>
                              <p className="md:text-[14px] text-[13px] font-[400] block text-themecolor">
                                {organizations?.headOfOrganization &&
                                  organizations.headOfOrganization}{" "}
                              </p>
                            </div>
                            <div className="pt-[16px] mb-[16px]">
                              <strong className="md:text-[16px] text-[13px] font-[700] block text-themecolor">
                                Head of Financials:{" "}
                              </strong>
                              <p className="md:text-[14px] text-[13px] font-[400] block text-themecolor">
                                {organizations?.headOfFinancials &&
                                  organizations.headOfFinancials}
                              </p>
                            </div>
                            <div className="pt-[16px] mb-[16px]">
                              <strong className="md:text-[16px] text-[13px] font-[700] block text-themecolor">
                                EIN:{" "}
                              </strong>
                              <p className="md:text-[14px] text-[13px] font-[400] block text-themecolor">
                                {organizations?.EIN && organizations.EIN}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:py-[32px] md:px-[48px] p-[24px] rounded-[16px] bg-white shadow-[#00000040] shadow-sm flex flex-col justify-center flex-wrap">
                    <div className="flex flex-wrap justify-between items-center mb-[24px]">
                      <h2 className="mb-[16px] md:text-[24px] text-[18px] leading-[33px] font-[700] text-themecolor">
                        Distribute Rewards to Organizations
                      </h2>
                    </div>
                    <div className="flex gap-[24px] flex-wrap xl:flex-nowrap xl:h-[388px] h-full">
                      <div className="xxl:w-[18%] xl:w-[20%] w-[100%] ]">
                        {givenReward > 0 && (
                          <div className="p-[16px] md:py-[16px] md:px-[24px] border border-[#4066b033] rounded-[4px] justify-center items-center flex flex-col bg-[#FAFAFA]  flex-wrap mb-[16px]">
                            <div className="mb-3 flex justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 28 28"
                                fill="none"
                              >
                                <circle
                                  cx="14"
                                  cy="13.8604"
                                  r="11.3604"
                                  stroke="#81D2E8"
                                  stroke-width="5"
                                />
                                <circle
                                  cx="22.9049"
                                  cy="5.2328"
                                  r="3.18788"
                                  fill="#4066B0"
                                />
                              </svg>
                            </div>
                            <strong className="lg:text-[20px] md:text-[16px] text-[14px]  font-[700] block mb-[10px]">
                              {givenReward} Rewards Given
                            </strong>
                          </div>
                        )}
                        {pendingReward > 0 && (
                          <div className="p-[16px] md:py-[16px] md:px-[24px] border border-[#4066b033] rounded-[4px] justify-center items-center flex flex-col bg-[#FAFAFA] flex-wrap ">
                            <div className="mb-3 flex justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="29"
                                viewBox="0 0 28 29"
                                fill="none"
                              >
                                <circle
                                  cx="14"
                                  cy="14.5811"
                                  r="11.3604"
                                  stroke="#F9B3B3"
                                  stroke-width="5"
                                />
                                <circle
                                  cx="22.9049"
                                  cy="5.95351"
                                  r="3.18788"
                                  fill="#FF4848"
                                />
                              </svg>
                            </div>
                            <strong className="lg:text-[20px] md:text-[16px] text-[14px]  font-[700] block mb-[10px]">
                              {pendingReward} Rewards Pending
                            </strong>
                          </div>
                        )}
                      </div>
                      <div className=" flex-wrap xxl:w-[80%] w-[100%] xl:w-[75%]">
                        {userPendingReward &&
                          userPendingReward.map((data, index) => (
                            <div className="md:py-[16px] md:px-[24px] p-[16px] rounded-[16px] bg-[#9747ff26] shadow-[#00000040] shadow-sm flex justify-between   mb-[12px] min-h-[65px] flex-wrap">
                              <div className="flex sm:gap-[80px] gap-[20px] flex-wrap">
                                <div className="flex items-center">
                                  <div className="w-[25px] h-[25px] me-2 mb-2 lg:mb-0">
                                    {data.user?.image ? (
                                      <Image
                                        className="w-full h-full rounded-[100%] overflow-hidden"
                                        src={`${process.env.CLOUDINARY_IMAGE_URL}${data.user.image}`}
                                        alt="avatar"
                                        height={120}
                                        width={60}
                                      />
                                    ) : (
                                      <Image
                                        src={AvatarSampleImg}
                                        className="w-full h-full"
                                        alt="Avatar"
                                      />
                                    )}
                                  </div>
                                  <span className=" text-[14px] lg:text-[16px]  font-[400]">
                                    <strong> {data.user.username}</strong>
                                  </span>
                                  <span className=" text-[14px] lg:text-[16px]  font-[400]">
                                    {data.UserRewards.actionPerformed}{" "}
                                    <strong>
                                      {data.UserRewards.payoutAmount}
                                    </strong>
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-[16px]">
                                <div
                                  onClick={() =>
                                    rejectReward(data.UserRewards._id)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="25"
                                    viewBox="0 0 24 25"
                                    fill="none"
                                  >
                                    <path
                                      d="M19.2015 7.26499C19.3968 7.06973 19.3968 6.75315 19.2015 6.55789L18.3868 5.7432C18.1916 5.54794 17.875 5.54794 17.6797 5.7432L12.3536 11.0693C12.1584 11.2646 11.8418 11.2646 11.6465 11.0693L6.32041 5.7432C6.12515 5.54794 5.80857 5.54794 5.61331 5.7432L4.79862 6.55789C4.60336 6.75315 4.60336 7.06973 4.79862 7.26499L10.1247 12.5911C10.32 12.7864 10.32 13.1029 10.1247 13.2982L4.79862 18.6243C4.60336 18.8196 4.60336 19.1361 4.79862 19.3314L5.61331 20.1461C5.80857 20.3414 6.12515 20.3414 6.32041 20.1461L11.6465 14.82C11.8418 14.6247 12.1584 14.6247 12.3536 14.82L17.6797 20.1461C17.875 20.3414 18.1916 20.3414 18.3868 20.1461L19.2015 19.3314C19.3968 19.1361 19.3968 18.8196 19.2015 18.6243L13.8754 13.2982C13.6802 13.1029 13.6802 12.7864 13.8754 12.5911L19.2015 7.26499Z"
                                      fill="#43515C"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </Layout>
      )}
    </>
  );
}
export default ManageOrganization;
