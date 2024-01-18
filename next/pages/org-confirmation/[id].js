import Layout from "@/Layouts/layout2";
import "flowbite";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { getOrganizationServerSideProps } from "@/components/ServerSideRendering/OrganizationProps";
import { isLoggedIn } from "@/helpers/authHelper";
import { getUserData } from "@/api/users";
import { useRouter } from "next/router";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import avatar from "../../assets/images/avatar.png";
import GoogleMapReact from "google-map-react";
import Slider from "react-slick";
import FullPageLoader from "@/components/fullPageLoader";
function OrgConfirmation({ organizations }) {
  const user = isLoggedIn();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // State to store user data, including the image
  const [userData, setUserData] = useState({
    image: "",
  });
  const defaultProps = {
    center: {
      lat: organizations?._doc?.lat,
      lng: organizations?._doc?.lon,
    },
    zoom: 11,
  };
  //Function to fetch the user's profile Data
  const getUser = async () => {
    setLoading(true);
    let response = await getUserData(user);
    if (response) {
      let { statusCode, userData } = response;
      if (statusCode === 200) {
        setUserData({
          ...userData,
          image: userData?.image,
        });
        setLoading(false);
      }
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
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };
  return (
    <>
      {loading ? (
        <FullPageLoader />
      ) : (
        <>
          <Layout image={userData?.image}>
            <div className="wrapper flex org-confirm">
              <div className="bg-grey2 w-full min-h-[900px]">
                <div className="p-8 h-full">
                  <div>
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
                        <p className="text-[13px] md:text-[16px] mb-[10px] font-[400] xxl:w-[1032px]">
                          Since you have created an organization, you will be
                          stated as Admin of the organization. You’ ll then be
                          able to connect or create a wallet, manage a team, and
                          request documents.
                        </p>
                      </div>
                    </div>
                    <div className="py-[16px] px-[32px] gap-[24px] flex flex-wrap justify-between items-center">
                      <div>
                        <h2 className="text-[16px] md:text-[20px] font-[700] text-themecolor mb-[10px]">
                          Organization Profile
                        </h2>
                        <p className="text-[13px] md:text-[16px] font-[400]">
                          This is what you’re viewers will see when they search
                          for your organization and the services you provide.
                        </p>
                      </div>
                      <div>
                        <Link
                          href={"/"}
                          className="border border-themecolor py-[8px] px-[20px] text-themecolor hover:bg-themecolor hover:text-white"
                        >
                          Go to Dashboard
                        </Link>
                      </div>
                    </div>
                    <div className="flex p-[32px] gap-[32px] flex-wrap xl:flex-nowrap">
                      <div className="w-full xl:w-[20%]">
                        <div className="h-[154px] object-fill mb-[16px]">
                          <GoogleMapReact
                            bootstrapURLKeys={{ key: "" }}
                            defaultCenter={defaultProps.center}
                            defaultZoom={defaultProps.zoom}
                          ></GoogleMapReact>
                        </div>
                        <div className="md:py-[24px] md:px-[32px] p-[24px]  gap-[16px] rounded-[16px] bg-white mb-[16px] shadow-[#00000040] shadow-sm">
                          <div className="border-b-[#4066b033]">
                            <div className="border-b border-b-[#4066b033]">
                              <ul className="mb-[16px]">
                                {organizations &&
                                  organizations?._doc.type.map(
                                    (organization) => (
                                      <>
                                        <li className="mb-[8px]">
                                          <span className="tag py-[4px] px-[8px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center min-w-[90px]">
                                            {organization?.name}
                                          </span>
                                        </li>
                                      </>
                                    )
                                  )}
                              </ul>
                            </div>
                            <div className="border-b border-b-[#4066b033] flex flex-col py-[16px]">
                              <div className="flex gap-[6px] items-start">
                                <FontAwesomeIcon icon={faLocationDot} />
                                <div>
                                  <span className="md:text-[14px] text-[13px] font-[400] block text-[#43515C]">
                                    {organizations?._doc?.street1}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="xl:block xl:gap-[12px] flex flex-wrap gap-0 justify-between mb-[16px]">
                              <div className="pt-[16px] mb-[16px]">
                                <strong className="md:text-[16px] text-[13px] font-[700] block">
                                  Primary Service:{" "}
                                </strong>
                                <p className="md:text-[14px] text-[13px] font-[400] block">
                                  Homeless shelters & services. Serving adults,
                                  economically, disadvantaged people, Rental
                                  Assistance
                                </p>
                              </div>
                            </div>
                            <div className="xl:block xl:gap-0 flex flex-wrap gap-[12px] justify-between">
                              <div className="pt-[16px] mb-[16px] flex flex-wrap">
                                <strong className="md:text-[16px] text-[13px] font-[700]">
                                  Phone:{" "}
                                </strong>
                                <p className="md:text-[14px] text-[13px] font-[400]">
                                  {organizations?._doc?.phone}
                                </p>
                              </div>
                              <div className="pt-[16px] mb-[16px] flex flex-wrap">
                                <strong className="md:text-[16px] text-[13px] font-[700]">
                                  Webisite:{" "}
                                </strong>
                                <p className="md:text-[14px] text-[13px] font-[400]">
                                  {" "}
                                  {
                                    organizations?._doc
                                      ?.websiteAboutOrganization
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="md:py-[24px] md:px-[32px] p-[24px]  gap-[16px] rounded-[16px] bg-white shadow-[#00000040] shadow-sm mb-[16px]">
                          <div className="xl:block xl:gap-[12px] flex flex-wrap gap-0 justify-between">
                            <div className="pt-[16px] mb-[16px]">
                              <strong className="md:text-[16px] text-[13px] font-[700] block">
                                Primary Service:{" "}
                              </strong>
                              <p className="md:text-[14px] text-[13px] font-[400] block">
                                Homeless shelters & services. Serving adults,
                                economically, disadvantaged people, Rental
                                Assistance
                              </p>
                            </div>
                            <div className="pt-[16px] mb-[16px]">
                              <strong className="md:text-[16px] text-[13px] font-[700] block">
                                Hours of Operation:
                              </strong>
                              <p className="md:text-[14px] text-[13px] font-[400] block">
                                {organizations?._doc?.hoursOfOperation}
                              </p>
                            </div>
                            <div className="pt-[16px] mb-[16px] flex flex-wrap">
                              <strong className="md:text-[16px] text-[13px] font-[700]">
                                Phone:{" "}
                              </strong>
                              <p className="md:text-[14px] text-[13px] font-[400]">
                                {organizations?._doc?.phone}
                              </p>
                            </div>
                            <div className="pt-[16px] mb-[16px] flex flex-wrap">
                              <strong className="md:text-[16px] text-[13px] font-[700]">
                                Webisite:{" "}
                              </strong>
                              <p className="md:text-[14px] text-[13px] font-[400]">
                                {" "}
                                {organizations?._doc?.websiteAboutOrganization}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="py-[24px] px-[32px] gap-[16px] rounded-[16px] bg-white shadow-[#00000040] shadow-sm mb-[16px]">
                          <div className="pt-[16px] mb-[16px]">
                            <strong className="md:text-[16px] text-[13px] font-[700] block">
                              Primary Service:{" "}
                            </strong>
                            Ruling year:
                            <p className="md:text-[14px] text-[13px] font-[400] block">
                              {organizations?.year}
                            </p>
                          </div>

                          <div className="pt-[16px] mb-[16px]">
                            <strong className="md:text-[16px] text-[13px] font-[700] block">
                              Population Served:
                            </strong>
                            <p className="md:text-[14px] text-[13px] font-[400] block">
                              Victims of crime and abuse
                            </p>
                          </div>
                          <div className="pt-[16px] mb-[16px]">
                            <strong className="md:text-[16px] text-[13px] font-[700] block">
                              Head of Organization:{" "}
                            </strong>
                            <p className="md:text-[14px] text-[13px] font-[400] block">
                              Erica Davis{" "}
                            </p>
                          </div>
                          <div className="pt-[16px] mb-[16px]">
                            <strong className="md:text-[16px] text-[13px] font-[700] block">
                              Head of Financials:{" "}
                            </strong>
                            <p className="md:text-[14px] text-[13px] font-[400] block">
                              Eric Johnson
                            </p>
                          </div>
                        </div>
                        <div className="pt-[16px] mb-[16px]">
                          <strong className="md:text-[16px] text-[13px] font-[700] block">
                            EIN:{" "}
                          </strong>
                          <p className="md:text-[14px] text-[13px] font-[400] block">
                            {" "}
                            {organizations?._doc?.EIN}
                          </p>
                        </div>
                      </div>
                      <div className="w-full xl:w-[80%]">
                        <div className="xl:py-[32px] xl:px-[80px] py-[20px] px-[25px] mb-[16px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white gap-[48px] flex flex-wrap md:flex-nowrap">
                          <div className="w-[250px] h-[100px] object-cover">
                            <Image
                              className="w-full h-full"
                              src={`${process.env.CLOUDINARY_IMAGE_URL}${organizations?._doc?.logo}`}
                              width={100} // Specify the width of the image in pixels
                              height={100} // Specify the height of the image in pixels
                              alt="logo"
                            />
                          </div>
                          <div>
                            <h2 className="text-[18px] md:text-[24px] font-[700] mb-[10px]">
                              {organizations?._doc?.name}
                            </h2>
                            <p className="text-[12px] md:text-[13px] font-[400]">
                              The Salvation Army of the Coastal Bend’s Homeless
                              Prevention programs help individuals who are at
                              risk of becoming homeless. Case mangers work with
                              clients on a case by case basis to determine their
                              needs. Rent and utility assistance is available to
                              help individuals become up-to-date with their
                              bill.
                            </p>
                          </div>
                          <div>
                            <button className="bg-themecolor text-white text-[16px] py-[8px] px-[20px] hover:bg-transparent border border-themecolor hover:text-themecolor rounded-[4px]">
                              Edit
                            </button>
                          </div>
                        </div>
                        <div className="xl:py-[32px] xl:px-[80px] py-[20px] px-[25px] mb-[16px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white gap-[48px]">
                          <h3 className="md:text-[24px] text-[20px] text-[#406AB3] font-[700] mb-[16px]">
                            About
                          </h3>
                          <div className="flex gap-[32px] flex-wrap lg:flex-nowrap">
                            <div className="w-full lg:w-[50%]">
                              <strong>Mission Statement</strong>
                              <p>{organizations?._doc?.missionStatement}</p>
                            </div>
                            <div className="w-full lg:w-[50%]">
                              <strong>History</strong>
                              <p className=" md:text-[16px] text-[13px] font-[400] text-[#000] mb-[24px]">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Suspendisse varius enim in
                                eros.Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Suspendisse varius enim in
                                eros.Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Suspendisse varius enim in
                                eros.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="xl:py-[32px] xl:px-[80px] py-[20px] px-[25px] mb-[16px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white">
                          <div>
                            <h3 className="md:text-[24px] text-[20px] text-[#406AB3] font-[700] mb-[16px]">
                              Our Services
                            </h3>

                            <div
                              id="accordion-collapse"
                              data-accordion="collapse"
                              className="border-t-[#A7A7A7] border-[1px]"
                            >
                              <h2 id="accordion-collapse-heading-1">
                                <button
                                  type="button"
                                  class="text-[12px] text-[#000] font-[600] sm:text-[16px] flex items-center justify-between w-full p-5 "
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
                                <div class="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                                  <p class="mb-2 text-gray-500 dark:text-gray-400">
                                    The Salvation Army of the Coastal Bend is
                                    able to provide utility and rental
                                    assistance through the ESG CV-Rental
                                    Assistance Grant. These funds are provided
                                    by The City of Corpus Christi through the
                                    Cares Act and is intended to help those
                                    impacted financially by COVID-19.
                                  </p>
                                </div>
                              </div>
                              <h2
                                id="accordion-collapse-heading-2"
                                className="bg-[#f4f4f4]"
                              >
                                <button
                                  type="button"
                                  class="text-[12px] text-[#000] font-[600] sm:text-[16px] flex items-center justify-between w-full p-5 "
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
                                    based on the utility classes from Tailwind
                                    CSS and components from Flowbite.
                                  </p>
                                </div>
                              </div>
                              <h2 id="accordion-collapse-heading-3">
                                <button
                                  type="button"
                                  class="text-[12px] text-[#000] font-[600] sm:text-[16px] flex items-center justify-between w-full p-5 "
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
                                    under the MIT license, whereas Tailwind UI
                                    is a paid product. Another difference is
                                    that Flowbite relies on smaller and
                                    standalone components, whereas Tailwind UI
                                    offers sections of pages.
                                  </p>
                                  <p class="mb-2 text-gray-500 dark:text-gray-400">
                                    However, we actually recommend using both
                                    Flowbite, Flowbite Pro, and even Tailwind UI
                                    as there is no technical reason stopping you
                                    from using the best of two worlds.
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
                        <div className="lg:py-[32px] lg:px-[80px] lg:pb-[50px] py-[20px] px-[25px] mb-[16px] w-full shadow-[#00000040] shadow-sm rounded-[10px] bg-white ">
                          <h2 className="md:text-[24px] text-[20px] text-[#406AB3] font-[700] mb-[16px]">
                            Reviews
                          </h2>
                          <div>
                            <Slider {...settings}>
                              <div>
                                <div className="m-[10px] mb-[40px]">
                                  <div className="p-[10px] sm:p-[32px] border-[1px] border-[#4066b033] min-w-full min-h-[285px] xxl:min-w-[475px] inline-block mb-[24px] bg-[#FAFAFA] rounded-[10px]">
                                    <ul className="flex mb-[24px]">
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                    </ul>
                                    <p className="2xl:w-[226px] md:text-[16px] text-[13px] font-[400] text-[#000] mb-[24px]">
                                      Lorem ipsum dolor sit amet, consectetur
                                      adipiscing elit. Suspendisse varius enim
                                      in eros elementum tristique. Duis cursus,
                                      mi quis viverra ornare.
                                    </p>
                                    <div className="flex flex-wrap">
                                      <div className="icon-holder me-2">
                                        <Image
                                          width="50"
                                          height="50"
                                          src={avatar}
                                          alt="Image"
                                        />
                                      </div>
                                      <div>
                                        <strong className="font-[600] text-[#000] text-[14px] block mb-[4px]">
                                          Name Surname
                                        </strong>
                                        <span className="font-[400] text-[#000] text-[10px]">
                                          Position, Company name
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="m-[10px] mb-[40px]">
                                  <div className="p-[10px] sm:p-[32px] border-[1px] border-[#4066b033] min-w-full min-h-[285px] xxl:min-w-[475px] inline-block mb-[24px] bg-[#FAFAFA] rounded-[10px]">
                                    <ul className="flex mb-[24px]">
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                    </ul>
                                    <p className="2xl:w-[226px] md:text-[16px] text-[13px] font-[400] text-[#000] mb-[24px]">
                                      Lorem ipsum dolor sit amet, consectetur
                                      adipiscing elit. Suspendisse varius enim
                                      in eros elementum tristique. Duis cursus,
                                      mi quis viverra ornare.
                                    </p>
                                    <div className="flex flex-wrap">
                                      <div className="icon-holder me-2">
                                        <Image
                                          width="50"
                                          height="50"
                                          src={avatar}
                                          alt="Image"
                                        />
                                      </div>
                                      <div>
                                        <strong className="font-[600] text-[#000] text-[14px] block mb-[4px]">
                                          Name Surname
                                        </strong>
                                        <span className="font-[400] text-[#000] text-[10px]">
                                          Position, Company name
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="m-[10px] mb-[40px]">
                                  <div className="p-[10px] sm:p-[32px] border-[1px] border-[#4066b033] min-w-full min-h-[285px] xxl:min-w-[475px] inline-block mb-[24px] bg-[#FAFAFA] rounded-[10px]">
                                    <ul className="flex mb-[24px]">
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                    </ul>
                                    <p className="2xl:w-[226px] md:text-[16px] text-[13px] font-[400] text-[#000] mb-[24px]">
                                      Lorem ipsum dolor sit amet, consectetur
                                      adipiscing elit. Suspendisse varius enim
                                      in eros elementum tristique. Duis cursus,
                                      mi quis viverra ornare.
                                    </p>
                                    <div className="flex flex-wrap">
                                      <div className="icon-holder me-2">
                                        <Image
                                          width="50"
                                          height="50"
                                          src={avatar}
                                          alt="Image"
                                        />
                                      </div>
                                      <div>
                                        <strong className="font-[600] text-[#000] text-[14px] block mb-[4px]">
                                          Name Surname
                                        </strong>
                                        <span className="font-[400] text-[#000] text-[10px]">
                                          Position, Company name
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="m-[10px] mb-[40px]">
                                  <div className="p-[10px] sm:p-[32px] border-[1px] border-[#4066b033] min-w-full min-h-[285px] xxl:min-w-[475px] inline-block mb-[24px] bg-[#FAFAFA] rounded-[10px]">
                                    <ul className="flex mb-[24px]">
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                    </ul>
                                    <p className="2xl:w-[226px] md:text-[16px] text-[13px] font-[400] text-[#000] mb-[24px]">
                                      Lorem ipsum dolor sit amet, consectetur
                                      adipiscing elit. Suspendisse varius enim
                                      in eros elementum tristique. Duis cursus,
                                      mi quis viverra ornare.
                                    </p>
                                    <div className="flex flex-wrap">
                                      <div className="icon-holder me-2">
                                        <Image
                                          width="50"
                                          height="50"
                                          src={avatar}
                                          alt="Image"
                                        />
                                      </div>
                                      <div>
                                        <strong className="font-[600] text-[#000] text-[14px] block mb-[4px]">
                                          Name Surname
                                        </strong>
                                        <span className="font-[400] text-[#000] text-[10px]">
                                          Position, Company name
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="m-[10px] mb-[40px]">
                                  <div className="p-[10px] sm:p-[32px] border-[1px] border-[#4066b033] min-w-full min-h-[285px] xxl:min-w-[475px] inline-block mb-[24px] bg-[#FAFAFA] rounded-[10px]">
                                    <ul className="flex mb-[24px]">
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                    </ul>
                                    <p className="2xl:w-[226px] md:text-[16px] text-[13px] font-[400] text-[#000] mb-[24px]">
                                      Lorem ipsum dolor sit amet, consectetur
                                      adipiscing elit. Suspendisse varius enim
                                      in eros elementum tristique. Duis cursus,
                                      mi quis viverra ornare.
                                    </p>
                                    <div className="flex flex-wrap">
                                      <div className="icon-holder me-2">
                                        <Image
                                          width="50"
                                          height="50"
                                          src={avatar}
                                          alt="Image"
                                        />
                                      </div>
                                      <div>
                                        <strong className="font-[600] text-[#000] text-[14px] block mb-[4px]">
                                          Name Surname
                                        </strong>
                                        <span className="font-[400] text-[#000] text-[10px]">
                                          Position, Company name
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="m-[10px] mb-[40px]">
                                  <div
                                    className="p-[10px] sm:p-[32px] border-[1px] border-[#4066b033] min-w-full min-h-[285px] xxl:min-w-[475px] inline-block mb-[24px] bg-[#FAFAFA] rounded-[10px] 
                                                            "
                                  >
                                    <ul className="flex mb-[24px]">
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                      <li>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="21"
                                          height="19"
                                          viewBox="0 0 21 19"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.49788 0.612343C9.84162 -0.204115 11.0124 -0.204114 11.3561 0.612346L13.3849 5.43123C13.5299 5.77543 13.8576 6.01061 14.2337 6.0404L19.4997 6.45748C20.3919 6.52814 20.7537 7.62813 20.0739 8.2034L16.0618 11.5987C15.7752 11.8412 15.65 12.2218 15.7376 12.5843L16.9633 17.661C17.171 18.5211 16.2239 19.201 15.46 18.7401L10.9515 16.0196C10.6295 15.8252 10.2245 15.8252 9.90248 16.0196L5.39399 18.7401C4.63011 19.201 3.68296 18.5211 3.89064 17.661L5.11642 12.5843C5.20398 12.2218 5.07882 11.8412 4.79226 11.5987L0.780064 8.2034C0.100284 7.62813 0.46207 6.52814 1.35429 6.45748L6.62036 6.0404C6.9965 6.01061 7.32416 5.77543 7.46907 5.43123L9.49788 0.612343Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </li>
                                    </ul>
                                    <p className="2xl:w-[226px] md:text-[16px] text-[13px] font-[400] text-[#000] mb-[24px]">
                                      Lorem ipsum dolor sit amet, consectetur
                                      adipiscing elit. Suspendisse varius enim
                                      in eros elementum tristique. Duis cursus,
                                      mi quis viverra ornare.
                                    </p>
                                    <div className="flex flex-wrap">
                                      <div className="icon-holder me-2">
                                        <Image
                                          width="50"
                                          height="50"
                                          src={avatar}
                                          alt="Image"
                                        />
                                      </div>
                                      <div>
                                        <strong className="font-[600] text-[#000] text-[14px] block mb-[4px]">
                                          Name Surname
                                        </strong>
                                        <span className="font-[400] text-[#000] text-[10px]">
                                          Position, Company name
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Slider>
                          </div>
                        </div>
                      </div>
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

export async function getServerSideProps(context) {
  const { query } = context;
  const id = query.id;
  // Use the imported function to get props
  return {
    props: await getOrganizationServerSideProps(id),
  };
}
export default OrgConfirmation;
