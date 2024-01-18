import Layout from "@/Layouts/layout2";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import ArmyLogo from "../../assets/images/army-logo.png";
import avatar from "../../assets/images/avatar.png";
import { isLoggedIn } from "@/helpers/authHelper";
import {
  filterByOrganizationId,
  getSimilarOrganizationId,
} from "@/api/organizations";
import Image from "next/image";
import GoogleMapReact from "google-map-react";
import { useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { submitApplicationResource } from "@/api/organizations";
import Swal from "sweetalert2";
import { getUserData } from "@/api/users";
import { useRouter } from "next/router";
import FullPageLoader from "@/components/fullPageLoader";
function ApplyForResources({ organizations, organizationTypes }) {
  const user = isLoggedIn();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    message: "",
    appointmentTime: "", // Object with startDate and endDate
  });
  const [appointment, setAppointment] = useState({
    appointmentTime: "",
    appointmentDate: "", // Object with startDate and endDate
    appointmentDay: "",
  });
  const [userData, setUserData] = useState({
    phone: "",
    email: "",
    contactPrefernce: [],
  });
  const defaultProps = {
    center: {
      lat: organizations?._doc?.lat,
      lng: organizations?._doc?.lon,
    },
    zoom: 11,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const getUser = async () => {
    setLoading(true);
    let response = await getUserData(user);
    if (response) {
      let { statusCode, image, userData } = response;
      if (statusCode === 200) {
        if (
          userData?.contactPrefernce &&
          userData.contactPrefernce.length > 0
        ) {
        }

        setUserData({
          phone: userData?.phone !== undefined ? userData?.phone : "n/a",
          email: userData?.email,
          image: image,
          contactPrefernce: userData?.contactPrefernce
            ? userData.contactPrefernce
            : "n/a",
        });
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (!user || !user?.token) {
      router.push("/");
    } else {
      //Fetch user data if the user is logged in
      getUser();
    }
  }, []);
  const submitApplication = async () => {
    const obj = {
      userId: user?.userId,
      organizationId: organizations?._doc?._id,
      appointmentTime: formData?.appointmentTime,
      message: formData?.message,
    };
    const response = await submitApplicationResource(user, obj);
    if (response) {
      const { statusCode, message, applicationResponse } = response;

      if (statusCode === 200) {
        setAppointment({
          appointmentDate: applicationResponse?.appointmentDate,
          appointmentTime: applicationResponse?.appointmentTime,
          appointmentDay: applicationResponse?.appointmentDay,
        });
        Swal.fire("Good Job", message, "success");
      }
      if (statusCode === 400) {
        Swal.fire("Oops", message, "error");
      }
    }
  };
  return (
    <>
      {loading ? (
        <FullPageLoader />
      ) : (
        <>
          <Layout>
            <div className="wrapper flex org-confirm">
              <div className="bg-grey2 w-full min-h-[900px]">
                <div className="sm:p-8 p-6  h-full">
                  <div>
                    <div className="pt-[16px] px-[32px] gap-[24px] flex flex-wrap justify-between items-center">
                      <div>
                        <h2 className="text-[16px] md:text-[20px] font-[700] text-themecolor mb-[10px]">
                          Apply for Resource
                        </h2>
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faEllipsis} />
                      </div>
                    </div>
                    <div className="flex p-[12px] sm:p-[32px] gap-[32px] flex-wrap xl:flex-nowrap">
                      <div className="w-full xl:w-[20%]">
                        <div className="h-[154px] object-fill mb-[16px]">
                          <GoogleMapReact
                            bootstrapURLKeys={{ key: "" }}
                            defaultCenter={defaultProps.center}
                            defaultZoom={defaultProps.zoom}
                          ></GoogleMapReact>
                        </div>
                        <div className="sm:py-[24px] p-[15px] sm:px-[32px] gap-[16px] rounded-[16px] bg-white mb-[16px] shadow-[#00000040] shadow-sm">
                          <div className="border-b-[#4066b033]">
                            <div className="border-b border-b-[#4066b033]">
                              <ul className="mb-[16px]">
                                {organizations &&
                                  organizations?._doc?.type?.map(
                                    (organization) => (
                                      <ul className="mb-[16px] flex gap-[4px] flex-wrap">
                                        <li className="mb-[8px]">
                                          <span className="tag py-[4px] px-[8px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center min-w-[90px]">
                                            {organization?.name}
                                          </span>
                                        </li>
                                      </ul>
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
                                  <span className="text-[12px] font-[400] block text-[#406AB3]">
                                    0.5 miles away
                                  </span>
                                </div>
                              </div>
                            </div>
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
                                {organizations?._doc
                                  ?.websiteAboutOrganization || "n/a"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="sm:py-[24px] py-[24px] px-[14px] gap-[16px] rounded-[16px] bg-white mb-[16px] shadow-[#00000040] shadow-sm">
                          <h2 className="md:text-[20px] text-[18px] text-themecolor font-[700]">
                            Recommendations
                          </h2>
                          <p className="font-[400] md:text-[16px] text-[14px]">
                            Recommendations based on your profiles proximity and
                            previous searches
                          </p>

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
                                  Texas Medical Clinic
                                </strong>
                                <span className="block">
                                  <FontAwesomeIcon icon={faLocationDot} /> 0.5
                                  miles away
                                </span>
                              </div>
                            </div>
                            <ul className="mb-[16px] flex gap-[4px] flex-wrap">
                              <li className="mb-[8px]">
                                <span className="tag py-[4px] px-[8px] rounded-[4px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center">
                                  Counseling
                                </span>
                              </li>
                              <li className="mb-[8px]">
                                <span className="tag py-[4px] px-[8px] rounded-[4px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center">
                                  Health Services
                                </span>
                              </li>
                            </ul>
                            <button className="bg-transparent text-themecolor text-[16px] py-[8px] px-[20px] border border-themecolor hover:text-white hover:bg-themecolor xl:w-full rounded-[4px] ">
                              View More
                            </button>
                          </div>
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
                                  Texas Medical Clinic
                                </strong>
                                <span className="block">
                                  <FontAwesomeIcon icon={faLocationDot} /> 0.5
                                  miles away
                                </span>
                              </div>
                            </div>
                            <ul className="mb-[16px] flex gap-[4px] flex-wrap">
                              <li className="mb-[8px]">
                                <span className="tag py-[4px] px-[8px] rounded-[4px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center">
                                  Counseling
                                </span>
                              </li>
                              <li className="mb-[8px]">
                                <span className="tag py-[4px] px-[8px] rounded-[4px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center">
                                  Health Services
                                </span>
                              </li>
                            </ul>
                            <button className="bg-transparent text-themecolor text-[16px] py-[8px] px-[20px] border border-themecolor hover:text-white hover:bg-themecolor xl:w-full rounded-[4px] ">
                              View More
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="w-full xl:w-[80%]">
                        <div className="xl:py-[32px] xl:px-[80px] py-[20px] px-[14px] mb-[16px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white gap-[48px] flex flex-wrap md:flex-nowrap items-end">
                          <div className="flex gap-[16px] flex-wrap xl:flex-nowrap">
                            <div className="w-[170px] h-[80px] object-cover">
                              <Image
                                className="w-full h-full"
                                src={ArmyLogo}
                                alt="logo"
                              />
                            </div>
                            <div className="flex justify-between flex-wrap">
                              <div>
                                <div className="flex justify-between flex-wrap">
                                  <h2 className="text-[18px] md:text-[24px] font-[700] mb-[10px]">
                                    Salvation Army The Costal Bend
                                  </h2>

                                  <div className="flex gap-[10px]">
                                    <div className="flex items-center">
                                      <span className="me-[4px] text-[11px] text-[400]">
                                        Share
                                      </span>
                                      <span>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="11"
                                          height="10"
                                          viewBox="0 0 11 10"
                                          fill="none"
                                        >
                                          <path
                                            d="M0.342807 9.6752L10.6629 5.2502L0.342807 0.825195L0.337891 4.26686L7.71289 5.2502L0.337891 6.23353L0.342807 9.6752Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="me-[4px] text-[11px] text-[400]">
                                        Saave
                                      </span>
                                      <span>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="13"
                                          height="18"
                                          viewBox="0 0 13 18"
                                          fill="none"
                                        >
                                          <path
                                            d="M6.50044 12.4023L9.18579 14.3563C9.61151 14.6729 10.1901 14.2471 10.0263 13.745L9.00021 10.5902L11.6528 8.70177C12.0895 8.39612 11.8711 7.70841 11.3363 7.70841H8.08327L7.02441 4.41176C6.86067 3.90962 6.15112 3.90962 5.98738 4.41176L4.91761 7.70841H1.66462C1.12974 7.70841 0.911417 8.39612 1.34806 8.70177L4.00066 10.5902L2.97455 13.745C2.81081 14.2471 3.38936 14.6619 3.81509 14.3563L6.50044 12.4023Z"
                                            fill="#43515C"
                                          />
                                        </svg>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-[12px] md:text-[13px] font-[400]">
                                  The Salvation Army of the Coastal Bend’s
                                  Homeless Prevention programs help individuals
                                  who are at risk of becoming homeless. Case
                                  mangers work with clients on a case by case
                                  basis to determine their needs. Rent and
                                  utility assistance is available to help
                                  individuals become up-to-date with their bill.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <button className="bg-themecolor text-white text-[16px] py-[8px] px-[20px] hover:bg-transparent border border-themecolor hover:text-themecolor rounded-[4px]">
                              Contact
                            </button>
                          </div>
                        </div>
                        <div className="xl:py-[32px] xl:px-[80px] py-[20px] px-[25px] mb-[16px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white gap-[48px]">
                          <h3 className="md:text-[24px] text-[20px] text-[#406AB3] font-[700] mb-[16px]">
                            Rent & Utility Assistance Application
                          </h3>
                          <p className="md:text-[13px] text-[12px] text-[#43515C] font-[400] mb-[16px]">
                            The Salvation Army of the Coastal Bend is able to
                            provide utility and rental assistance through the
                            ESG CV-Rental Assistance Grant. These funds are
                            provided by The City of Corpus Christi through the
                            Cares Act and is intended to help those impacted
                            financially by COVID-19.
                          </p>
                          <div className="bg-[#FAFAFA] flex justify-between flex-wrap border border-[#4066b033] rounded-[4px] sm:py-[24px] py-[24px] px-[14px] mb-[16px]">
                            <div className="flex gap-[48px] flex-wrap">
                              <div className="w-[75px] h-[75px] rounded-full overflow-hidden">
                                <Image
                                  alt="logo"
                                  src={`${process.env.CLOUDINARY_IMAGE_URL}${userData?.image}`}
                                  width="120"
                                  height="120"
                                  className="w-full h-full"
                                />
                              </div>
                              <div>
                                <strong className="mb-[12px] block text-[18px] md:text-[20px] font-[700]">
                                  Josiah Duenes
                                </strong>
                                <span className="mb-[10px] text-[14px] md:text-[16px] font-[400] block">
                                  Email: {userData?.email}
                                </span>
                                <span className="mb-[10px] text-[14px] md:text-[16px] font-[400] block">
                                  Phone: {userData?.phone}
                                </span>

                                <span className="mb-[10px] text-[15px] md:text-[16px] font-[400] block">
                                  Contact Preference:{" "}
                                  {userData?.contactPrefernce &&
                                    userData.contactPrefernce.map(
                                      (preference, index) => (
                                        <span key={index}>{preference}</span>
                                      )
                                    )}
                                </span>
                              </div>
                            </div>
                            <div>
                              <button className="bg-transparent text-themecolor text-[16px] py-[8px] px-[20px] border border-themecolor hover:text-white hover:bg-themecolor xl:w-full rounded-[4px] ">
                                Edit
                              </button>
                            </div>
                          </div>
                          <div className="bg-[#FAFAFA] border border-[#4066b033] rounded-[4px] sm:py-[24px] py-[24px] px-[14px] sm:px-[32px] mb-[16px]">
                            <p className="md:text-[16px] text-[14px] text-[#000] font-[400] mb-[16px]">
                              What day and time can you come in to get
                              interviewed for your request for rapid rehousing
                              The interview will take place at our location and
                              will take 30 minutes to an hour.{" "}
                            </p>
                            <div className="mb-[16px]">
                              <label className="md:text-[16px] text-[14px] block mb-[16px] font-[700]">
                                Select an Available Time
                              </label>

                              <div>
                                <input
                                  className="rounded-[5px] py-[8px] px-[12px] bg-[#FAFAFA] border-[#4066b033] w-full text-[16px]"
                                  required
                                  type="date"
                                  id="appointmentTime"
                                  name="appointmentTime"
                                  onChange={handleChange}
                                  value={formData.appointmentTime}
                                />
                              </div>
                            </div>

                            <div className="bg-[#F6F9FF] items-end border border-[#4066b033] py-[16px] px-[24px] flex flex-wrap gap-[16px] justify-between">
                              <div>
                                <strong className="block text-[16px] text-themecolor font-[700] mb-[10px]">
                                  {appointment?.appointmentDay}
                                </strong>
                                <span className="block text-[16px] text-themecolor font-[400]">
                                  {appointment?.appointmentDate}
                                </span>
                              </div>
                              <div>
                                <span className="block text-[16px] text-black font-[400]">
                                  {appointment?.appointmentTime}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-[#FAFAFA] border border-[#4066b033] rounded-[4px] sm:py-[24px] py-[24px] px-[14px] mb-[16px]">
                            <label className="md:text-[16px] text-[14px] block mb-[16px] font-[700]">
                              Message
                            </label>
                            <textarea
                              className="p-[12px] rounded-[4px] border border-[#4066b033] text-[#43515C] text-[14px] md:text-[16px] min-h-[106px] resize-none w-full"
                              placeholder="Type your message..."
                              value={formData?.message}
                              name="message"
                              onChange={handleChange}
                            />
                            <div class="flex items-center mb-4">
                              <input
                                id="default-checkbox"
                                type="checkbox"
                                value=""
                                class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                for="default-checkbox"
                                class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Accept the terms{" "}
                              </label>
                            </div>
                          </div>
                          <div>
                            <button
                              onClick={submitApplication}
                              className="bg-themecolor text-white text-[16px] py-[8px] px-[20px] hover:bg-transparent border border-themecolor hover:text-themecolor rounded-[4px]"
                            >
                              Continue
                            </button>
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
export default ApplyForResources;
