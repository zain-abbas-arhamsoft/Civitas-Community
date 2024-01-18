import "flowbite";
import siteLogo from "../../assets/images/logo.svg";
import React, { useRef, useState } from "react";
import avatar from "../../assets/images/avatar.png";
import iconPencil from "../../assets/images/icon-pencil.png";
import iconMapPin from "../../assets/images/icon-map-pin.svg";
import iconSearch from "../../assets/images/icon-search.png";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  filterByOrganizationId,
  getSimilarOrganizationId,
} from "@/api/organizations";
import Link from "next/link";
import LikedIcon from "../../assets/images/like.svg";
import SavedBook from "../../assets/images/booksaved.svg";
import ShareIcon from "../../assets/images/share.svg";
import { submitUserDetails } from "@/api/organizations";
import { isLoggedIn } from "../../helpers/authHelper";
import Swal from "sweetalert2";
import useCompleteProfileHook from "@/hooks/useCustomProfile";
import GoogleMapReact from "google-map-react";
import Layout from "@/Layouts/layout4";
import Loader from "@/components/Loader";
function Organization_Visit({
  organizations,
  organizationTypes: propOrganizationTypes,
}) {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const checkboxRef = useRef([]);
  const messageRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const user = isLoggedIn();
  const completeProfileWith = useCompleteProfileHook();
  const defaultProps = {
    center: {
      lat: organizations?.lat,
      lng: organizations?.lon,
    },
    zoom: 11,
  };
  const handleCheckboxChange = (e) => {
    const { id, value } = e.target;
    const checkboxIndex = checkboxRef.current.findIndex(
      (checkbox) => checkbox.id === id
    );
    if (checkboxIndex !== -1) {
      checkboxRef.current = checkboxRef.current.filter(
        (checkbox) => checkbox.id !== id
      );
    } else {
      checkboxRef.current.push({ id, value });
    }
  };
  // Function to submit details of the user
  const submitContactDetails = async (e) => {
    e.preventDefault();
    // Get the selected contact method
    let selectedContactMethod;
    setLoading(true);
    const radioButtons = document.getElementsByName("flexRadioDefault");
    radioButtons.forEach((radioButton) => {
      if (radioButton.checked) {
        selectedContactMethod = radioButton.value;
      }
    });
    // Get the "Enter Way of Contact" value
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const message = messageRef.current.value;
    const data = checkboxRef.current;
    const _id = organizations?._id;
    const obj = {
      selectedContactMethod,
      firstName,
      lastName,
      message,
      data,
      _id,
    };
    var response = await submitUserDetails(user, obj);
    if (response) {
      var { statusCode } = response;
      if (statusCode === 200) {
        Swal.fire("Good job!", "You submit the details", "success");
      } else if (statusCode === 401) {
        Swal.fire("Oops...", "Please go to login page", "error");
      } else if (statusCode === 500) {
        Swal.fire("Oops...", `${response?.message}`, "error");
      } else if (statusCode === 400) {
        Swal.fire("Oops...", `${response?.message}`, "error");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Layout>
        {completeProfileWith === 404 ? (
          <div className="border border-themecolor rounded rounded-4 py-2 px-4 flex justify-between items-center flex-col md:flex-row">
            <div className="text-themecolor mb-2 md:mb-0">
              You have not completed your profile. Please go to Profile
            </div>
            <Link
              className="inline-block btn btn-theme border border-themecolor bg-themecolor hover:bg-white text-white hover:text-themecolor px-3 sm:px-6 py-2 ms-3 rounded-4"
              href="/profile"
            >
              Go To Profile
            </Link>
          </div>
        ) : null}
        <div className="py-30 custom-container mx-auto">
          <form className="search-form relative mb-8 block lg:hidden">
            <input
              type="search"
              className="w-full h-8 border-0"
              placeholder="Search Name, Organization, Cause, or #tag"
            />
            <span className="icon-search absolute left-[10px] top-1/2 -translate-y-1/2 z-1 w-[24px] h-[24px]">
              <Image width={24} height={24} src={iconSearch} alt="Image" />
            </span>
          </form>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full 2xl:w-3/4 px-2">
              <div className="flex flex-wrap -mx-2">
                <div className="w-full lg:w-1/4 px-4">
                  <strong className="logo w-16 lg:block mb-4 mx-auto hidden">
                    <Image
                      width={104}
                      height={93}
                      className="w-8"
                      src={siteLogo}
                      alt=""
                    />
                  </strong>
                  <div className="py-[13px] px-[15px] rounded-[16px] bg-[#FAFAFA] flex p-2 mb-[30px]">
                    <div className="flex flex-col xl:flex-row">
                      <div className="avatar-holder relative me-2 mb-3 xl:mb-0">
                        <Image
                          width="40"
                          height="40"
                          src={avatar}
                          alt="Image"
                        />
                      </div>
                      <div className="flex detail-holder flex-col flex-1">
                        <strong className="author-name mb-1.5">
                          Erica Davis
                        </strong>
                        <p>Family Services of Southeast Texas</p>
                      </div>
                    </div>

                    <span className="icon-pencil">
                      <Image
                        width="20"
                        height="20"
                        src={iconPencil}
                        alt="Image"
                      />
                    </span>
                  </div>
                  <div className="mb-[28px] border-b-1">
                    
                  </div>
                  <div className="border-t-2 py-[20px] border-b-2 mb-[10px]">
                    <div className="flex items-center">
                      <div className="me-3">
                        <Image
                          width="32"
                          height="32"
                          src={iconMapPin}
                          alt="Image"
                        />
                      </div>
                      <p className="text-[17px] font-[400] text-[#000]">
                        {organizations?._doc?.street1}
                      </p>
                    </div>
                  </div>

                  <div className="py-[20px] border-b-2">
                    <div>
                      <h4 className="text-[20px] font-[500] text-[#000] mb-[8px]">
                        Primary Service:
                      </h4>
                      <p className="text-[17px] font-[100] text-[#000] mb-[12px]">
                        {organizations?._doc?.missionStatment}
                      </p>
                      <h4 className="text-[20px] font-[500] text-[#000] mb-[8px]">
                        Hours of Operation:
                      </h4>
                      <p className="text-[17px] font-[100] text-[#000] mb-[12px]">
                        Monday - Friday, 8:00am to 5:00pm
                      </p>
                      <div className="flex items-center mb-[8px]">
                        <h4 className="text-[20px] font-[500] text-[#000] me-[4px]">
                          Phone:
                        </h4>
                        <p className="text-[17px] font-[100] text-[#000]">
                          {" "}
                          {organizations?._doc?.phone}
                        </p>
                      </div>
                      <h4 className="text-[20px] font-[500] text-[#000] mb-[4px]">
                        Website:
                      </h4>
                      <p className="text-[17px] font-[100] text-[#000] mb-[12px]">
                        {organizations?._doc?.websiteAboutOrganization}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-3/4 px-4">
                  <form className="search-form relative mb-8 hidden lg:block">
                    <input
                      type="search"
                      className="w-full h-8 border-0"
                      placeholder="Search Name, Organization, Cause, or #tag"
                    />
                    <span className="icon-search absolute left-[10px] top-1/2 -translate-y-1/2 z-1 w-[24px] h-[24px]">
                      <Image
                        width={24}
                        height={24}
                        src={iconSearch}
                        alt="Image"
                      />
                    </span>
                  </form>
                  <h2 className="flex content-heading  px-4 py-3 items-center mb-4">
                    <span className="icon-box me-3">
                      <Image
                        width="35"
                        height="35"
                        src={SavedBook}
                        alt="Image"
                      />
                    </span>
                    <span>Organizations</span>
                  </h2>
                  <div className="organizations-holder">
                    <div className=" text-grey border border-[#d5dceb] py-[19px] px-[28px] min-h-[344px] rounded-[10px] mb-[35px]  relative">
                      <div className="flex justify-between">
                        <div
                          style={{
                            width: "50%",
                            maxWidth: "13%",
                            height: "auto",
                          }}
                        >
                          <Image
                            src={`${process.env.CLOUDINARY_IMAGE_URL}${organizations?._doc?.logo}`}
                            alt="Image"
                            layout="responsive"
                            width={100} // Specify the width of the image in pixels
                            height={100} // Specify the height of the image in pixels
                          />
                        </div>
                        <div className="flex items-center">
                          <a href="" className="ms-2">
                            <Image alt="Image" src={LikedIcon} />
                          </a>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <a href="">
                          <Image src={ShareIcon} alt="Image" />
                        </a>
                      </div>
                      <h2 className="text-[32px] text-[#000] font-[700] mb-[15px]">
                        {organizations?._doc?.name}
                      </h2>
                      <p className="mb-[50px]">
                        “No person in our community should ever have to spend
                        the night on the streets.”
                      </p>
                      <p className="text-[16px] text-[#000] font-[300] mb-[15px]">
                        {organizations?._doc?.websiteAboutOrganization}
                      </p>
                      {organizations?.role ? (
                        <ul className="flex mb-[15px] flex-wrap">
                          <li className="mb-[3px]">
                            <div className="tag py-[4px] px-[8px] bg-[#ebdffb] inline-block me-2">
                              {organizations?._doc?.role}
                            </div>
                          </li>
                        </ul>
                      ) : (
                        ""
                      )}
                      <div>
                        <a
                          className="inline-block btn btn-theme border border-themecolor bg-themecolor hover:bg-white text-white hover:text-themecolor px-3 sm:px-6 py-2 rounded-4"
                          href=""
                        >
                          Contact
                        </a>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[24px] text-[#000] font-[600] mb-[16px] ms-[28px]">
                        Contact
                      </h3>
                    </div>
                    <div className="flex mb-[24px] ">
                      <form className="w-full">
                        <div class="gap-4 w-full flex flex-col sm:flex-row">
                          <div
                            class="relative w-full sm:w-1/2"
                            data-te-input-wrapper-init
                          >
                            <label className="mb-[10px] block ms-[28px] font-[400] text-[16px] text-[#000]">
                              First Name*
                            </label>
                            <input
                              type="email"
                              class="peer block min-h-[48px] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6]  border-[1px]"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                              ref={firstNameRef}
                              required
                            />
                          </div>
                          <div
                            class="relative w-full sm:w-1/2"
                            data-te-input-wrapper-init
                          >
                            <label className="mb-[10px] block ms-[28px] font-[400] text-[16px] text-[#000]">
                              Last Name*
                            </label>
                            <input
                              type="email"
                              class="peer min-h-[48px] block w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6]  border-[1px]"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                              ref={lastNameRef}
                              required
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="mb-[24px] ms-[28px]">
                      <p className="text-[16px] font-[400] text-[#000] mb-[18px]">
                        Which is best way to contact you:
                      </p>
                      <div class="mb-[14px] block min-h-[1.5rem] pl-[1.5rem]">
                        <input
                          class="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                          type="radio"
                          name="flexRadioDefault"
                          id="radioDefault01"
                          value="Email"
                        />
                        <label
                          class="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
                          for="radioDefault01"
                        >
                          Email
                        </label>
                      </div>
                      <div class="mb-[14px] block min-h-[1.5rem] pl-[1.5rem]">
                        <input
                          class="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                          type="radio"
                          name="flexRadioDefault"
                          id="radioDefault02"
                          value="Phone"
                        />
                        <label
                          class="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
                          for="radioDefault02"
                        >
                          Phone
                        </label>
                      </div>
                      <div class="mb-[14px] block min-h-[1.5rem] pl-[1.5rem]">
                        <input
                          class="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                          type="radio"
                          name="flexRadioDefault"
                          id="radioDefault03"
                          value="Civitas Portal"
                        />
                        <label
                          class="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
                          for="radioDefault03"
                        >
                          Civitas portal
                        </label>
                      </div>
                    </div>

                    <div className="mb-[110px]">
                      <h3 className="text-[24px] text-[#000] font-[600] mb-[16px]">
                        What can we help you with?
                      </h3>

                      <div className="border-t-[1px] border-b-[1px] min-h-[400px] mb-[37px] border-[#000]">
                        <div className="flex justify-between items-center  px-[24px] py-[20px]">
                          <label
                            class="inline-block pl-[0.15rem] hover:cursor-pointer text-[16px] text-[#000] font-[600] me-2"
                            for="checkboxDefault-a"
                          >
                            Downtown Shelter: The ARCH/Austin Resource Center
                            for the Homeless
                          </label>
                          <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                            <input
                              class="relative text-[0px] flex justify-center items-center float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[25px] w-[25px] appearance-none rounded-[3px] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[25px] before:w-[25px] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                              type="checkbox"
                              value="Downtown Shelter: The ARCH/Austin Resource Center for
                            the Homeless"
                              id="checkboxDefault-a"
                              onChange={handleCheckboxChange}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center  px-[24px] py-[20px] bg-[#F4F4F4]">
                          <label
                            class="inline-block pl-[0.15rem] hover:cursor-pointer text-[16px] text-[#000] font-[600] me-2"
                            for="checkboxDefault-b"
                          >
                            Recuperative Care
                          </label>
                          <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                            <input
                              class="relative text-[0px] flex justify-center items-center float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[25px] w-[25px] appearance-none rounded-[3px] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[25px] before:w-[25px] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                              type="checkbox"
                              value="Recuperative Care"
                              id="checkboxDefault-b"
                              onChange={handleCheckboxChange}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center  px-[24px] py-[20px]">
                          <label
                            class="inline-block pl-[0.15rem] hover:cursor-pointer text-[16px] text-[#000] font-[600] me-2"
                            for="checkboxDefault-c"
                          >
                            Permanent Supportive Housing
                          </label>
                          <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                            <input
                              class="relative text-[0px] flex justify-center items-center float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[25px] w-[25px] appearance-none rounded-[3px] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[25px] before:w-[25px] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                              type="checkbox"
                              value="Permanent Supportive Housing"
                              id="checkboxDefault-c"
                              onChange={handleCheckboxChange}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center  px-[24px] py-[20px] bg-[#F4F4F4]">
                          <label
                            class="inline-block pl-[0.15rem] hover:cursor-pointer text-[16px] text-[#000] font-[600] me-2"
                            for="checkboxDefault-d"
                          >
                            Services for Veterans
                          </label>
                          <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                            <input
                              class="relative text-[0px] flex justify-center items-center float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[25px] w-[25px] appearance-none rounded-[3px] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[25px] before:w-[25px] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                              type="checkbox"
                              value="Services for Veterans"
                              id="checkboxDefault-d"
                              onChange={handleCheckboxChange}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center  px-[24px] py-[20px]">
                          <label
                            class="inline-block pl-[0.15rem] hover:cursor-pointer text-[16px] text-[#000] font-[600] me-2"
                            for="checkboxDefault-e"
                          >
                            Rapid Rehousing
                          </label>
                          <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                            <input
                              class="relative text-[0px] flex justify-center items-center float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[25px] w-[25px] appearance-none rounded-[3px] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[25px] before:w-[25px] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                              type="checkbox"
                              value="Rapid Rehousing"
                              id="checkboxDefault-e"
                              onChange={handleCheckboxChange}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center  px-[24px] py-[20px] bg-[#F4F4F4]">
                          <label
                            class="inline-block pl-[0.15rem] hover:cursor-pointer text-[16px] text-[#000] font-[600] me-2"
                            for="checkboxDefault-f"
                          >
                            Keep Austin Housed/AmeriCorps
                          </label>
                          <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                            <input
                              class="relative text-[0px] flex justify-center items-center float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[25px] w-[25px] appearance-none rounded-[3px] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[25px] before:w-[25px] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                              type="checkbox"
                              value="Keep Austin Housed/AmeriCorps"
                              id="checkboxDefault-f"
                              onChange={handleCheckboxChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        class="relative mb-[10px]"
                        data-te-input-wrapper-init
                      >
                        <label className="mb-[10px] block ms-[28px] font-[600] text-[24px] text-[#000]">
                          Message
                        </label>
                        <textarea
                          type="email"
                          class="peer block min-h-[106px] w-full rounded-[6px] border-0 bg-transparent p-[12px] leading-[1.6]  border-[1px]"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          placeholder="Can you explain in a bit more detail"
                          ref={messageRef}
                        />
                      </div>
                      <div class="mb-[30px] block min-h-[1.5rem] pl-[1.5rem] ps-[24px] ]">
                        <input
                          class="relative text-[0px] float-left -ml-[1.5rem] mr-[6px]  mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                          type="checkbox"
                          value=""
                          id="checkboxDefault6"
                        />
                        <label
                          class="inline-block pl-[0.15rem] hover:cursor-pointer"
                          for="checkboxDefault6"
                        >
                          I accept the terms
                        </label>
                      </div>
                      <a
                        className="inline-block w-[255px] flex justify-center items-center btn btn-theme border border-themecolor bg-themecolor hover:bg-white text-white hover:text-themecolor px-3 sm:px-6 py-2 rounded-4"
                        href=""
                        onClick={submitContactDetails}
                      >
                        Submit
                        {loading ? <Loader className="mr-3" /> : null}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full lg:w-1/4 px-4">
                  <div className="filters-col fixed lg:relative inset-0 bg-white z-10 p-6 lg:p-0 "></div>
                </div>
                <div className="w-full lg:w-3/4 px-4"></div>
              </div>
            </div>
            <div className="2xl:w-1/4 px-2 sm:px-4">
              <p className="text-[18px] text-[#000] font-[400] mb-[30px]">
                Find the resources you might need for anything you have going on
                in life. These are all in our community and regularly updated.
              </p>
              <div className="image-holder mb-4 relative flex justify-center">
                <div style={{ height: "200px", width: "100%" }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: "" }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                  ></GoogleMapReact>
                </div>
              </div>
              <h2 className="text-[#43515C] text-[36px] font-[600] mb-[30px]">
                Similar Organizations{" "}
              </h2>

              {propOrganizationTypes &&
                propOrganizationTypes.similarOrganizations?.map(
                  (organization) => (
                    <>
                      <div className="p-[20px] rounded-[10px] border-[1px]  border-[#43515C] min-w-[351px] mb-[24px] bg-[#F1F1F1]">
                        <h3 className="text-[#43515C] text-[20px] w-[311] font-[700] mb-[16px]">
                          {organization?.name}
                        </h3>
                        <p className="text-[#43515C] text-[15px] w-[311] font-[400] mb-[24px]">
                          {organization?.street1}
                        </p>
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
                      </div>
                    </>
                  )
                )}
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

export default Organization_Visit;
