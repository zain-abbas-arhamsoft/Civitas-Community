import React, { useState, useEffect } from "react";
import Select from "react-select";
import Image from "next/image";
import Link from "next/link";
import {
  organizationList,
  organizationTypeList,
  filterByOrganizationName,
} from "@/api/organizations";
import Layout from "@/Layouts/layout1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate"; // for pagination
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons"; // for customizing icons
import { isLoggedIn } from "@/helpers/authHelper";
import { getUserData } from "@/api/users";
import FullPageLoader from "@/components/fullPageLoader";

const CommunitySearch = () => {
  const [organizations, setOrganizations] = useState([]);
  const [organizationType, setOrganizationType] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedAllfilterOptions, setSelectedAllfilterOptions] = useState([]);
  const [selectedfiltervalue, setSelectedfiltervalue] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [zipCode, setZipCode] = useState();
  const [userData, setUserData] = useState({
    phone: "",
    email: "",
    username: "",
    image: "",
    walletAddress: "",
    totalPayout: "",
  });
  const router = useRouter();
  const [fullPage, setFullPageLoading] = useState(true);
  const user = isLoggedIn();
  const [filters, setFilters] = useState({
    name: "",
    currentPage: "",
    zipCode: "",
    type: [],
    hours: [],
  });
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  // Function to search organization with name and update the state with fetched data
  const searchWithOrganizationName = async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const inputValue = event.target ? event.target.value : searchTerm;
    setSearchTerm(inputValue);
    const newObj = { ...filters, name: inputValue };
    if (inputValue) {
      setFilters(newObj);
    }
    debouncedSearchOrganization(newObj);
  };
  // Function to filter organization on the basis of zip code and update the state with fetched data
  const searchByZipCode = async (event) => {
    setZipCode(event.target.value);
    const newObj = { ...filters, zipCode: event.target.value };
    if (event.target.value) {
      setFilters(newObj);
    }
    debouncedSearchOrganization(newObj);
  };
  // Function to filter organization on the basis of organization type and update the state with fetched data
  const filterOrganizationsByType = async (option) => {
    const newOptions = [...selectedAllfilterOptions, option.label];
    const tempValues = [...selectedfiltervalue, option.value];
    setSelectedAllfilterOptions(newOptions);
    setSelectedfiltervalue([...selectedfiltervalue, option.value]);
    setSelectedOptions(option);
    const newObj = { ...filters, type: tempValues };
    if (tempValues) {
      setFilters(newObj);
    }
    debouncedSearchOrganization(newObj);
  };
  // Function to filter organization on the basis of organization time and update the state with fetched data
  const handleCheckboxChange = async (event) => {
    const { value } = event.target;
    let tempValues = workingHours;

    // If checked and not present, add it
    if (!tempValues.includes(value)) {
      tempValues.push(value);
    } else {
      // If unchecked, remove it if present
      tempValues = tempValues.filter((item) => item !== value);
    }
    const newObj = { ...filters, hours: tempValues };
    if (workingHours) {
      setFilters(newObj);
    }
    setWorkingHours(newObj?.hours);
    debouncedSearchOrganization(newObj);
  };
  // Use debounce to create a debounced version of search organization with name
  const debouncedSearchOrganization = debounce(async (filter) => {
    const newObj = { ...filter, currentPage: currentPage };
    const response = await filterByOrganizationName(newObj);
    if (response) {
      const { data, statusCode } = response;
      if (statusCode === 200) {
        setOrganizations(data?.matchingDocuments);
        setTotalPages(data?.pagination?.pages);
      }
    }
  }, 300);

  // Function to get all organizations and update the state with fetched data
  const getAllOrganizations = async () => {
    const response = await organizationList({ currentPage });
    if (response) {
      const { statusCode, data } = response;
      if (statusCode === 200) {
        setOrganizations(data?.organizations);
        setTotalPages(data?.pagination?.pages);
      }
      if (statusCode === 500) {
        setOrganizations([]);
      }
    }
  };

  // Function to get  all organizations type and update the state with fetched data
  const getOrganizationType = async () => {
    const organizationType = await organizationTypeList();
    setOrganizationType(organizationType?.data?.organizationType);
  };

  useEffect(() => {
    if (searchTerm === "") {
      getAllOrganizations();
    }
    if (searchTerm !== "") {
      searchWithOrganizationName("");
    }
  }, [currentPage]);

  const goToOrganizationInterior = (id) => {
    router.push(`/organization-interior/${id}`);
  };

  const getUser = async () => {
    const response = await getUserData(user);
    setFullPageLoading(true);
    if (response) {
      let { statusCode, userData } = response;

      if (statusCode === 200) {
        setUserData({
          ...userData,
          phone: userData?.phone !== undefined ? userData?.phone : "n/a",
          email: userData?.email,
          username: userData?.username,
          image: userData?.image,
          walletAddress: userData?.wallet,
          totalPayout:
            userData?.totalPayout !== null ? userData?.totalPayout : 0,
        });
      }
      setFullPageLoading(false);
    }
  };

  useEffect(() => {
    getOrganizationType();
    getUser();
  }, []);
  const ClearAll = () => {
    const newObj = { ...filters, type: [], zipCode: "", hours: [], name: "" };
    setFilters(newObj);
    setZipCode("");
    setSelectedfiltervalue([]);
    setSelectedOptions([]);
    setSelectedAllfilterOptions([]);
    setWorkingHours([]);
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    debouncedSearchOrganization(newObj);
  };
  const clearZip = () => {
    const newObj = { ...filters, zipCode: "" };
    setFilters(newObj);
    setZipCode("");
    debouncedSearchOrganization(newObj);
  };
  const clearType = () => {
    const newObj = { ...filters, type: [] };
    setFilters(newObj);
    setSelectedfiltervalue([]);
    setSelectedOptions([]);
    setSelectedAllfilterOptions([]);
    debouncedSearchOrganization(newObj);
  };
  const clearhours = () => {
    const newObj = { ...filters, hours: [] };
    setFilters(newObj);
    setWorkingHours([]);
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    debouncedSearchOrganization(newObj);
  };
  const removeFilter = (tag) => {
    const indexOfElement = selectedAllfilterOptions.indexOf(tag);
    selectedAllfilterOptions.splice(indexOfElement, 1);
    selectedfiltervalue.splice(indexOfElement, 1);
    const newObj = { ...filters, type: selectedfiltervalue };
    if (selectedfiltervalue) {
      setFilters(newObj);
    }
    debouncedSearchOrganization(newObj);
  };

  return fullPage ? (
    <FullPageLoader />
  ) : (
    <>
      <Layout image={userData?.image} user={user}>
        <div className="wrapper h-[100%]">
          <div className="bg-grey2 overflow-hidden">
            <div className="p-8">
              <div className="top-head py-[16px] px-[32px] gap-[48px] flex justify-between items-center mb-[34px]">
                <div className="gap-[48px] flex flex-wrap">
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
              </div>
              <div className="flex flex-wrap xl:flex-nowrap gap-[16px]">
                <div className="xl:w-[15%] w-full shadow-[#00000040] shadow-sm rounded-[10px] bg-white py-[24px] px-[32px] flex flex-col gap-[16px]">
                  <div className="flex justify-between flex-wrap">
                    <h2 className="md:text-[16px] text-[14px] text-themecolor font-[700]">
                      Filtres
                    </h2>
                    <button
                      className="md:text-[13px] text-[12px] text-black font-[400]"
                      onClick={ClearAll}
                    >
                      Clear all
                    </button>
                  </div>
                  <span className="md:text-[14px] text-[13px] text-black font-[400] border-b border-b-[#4066b033] block pb-[16px]">
                    Showing 0 of 100
                  </span>
                  <div className="pb-[16px] border-b border-b-[#4066b033]">
                    <div className="flex justify-between flex-wrap mb-[10px]">
                      <h2 className="md:text-[16px] text-[14px] text-black font-[700]">
                        Zipcode
                      </h2>
                      <button
                        className="md:text-[13px] text-[12px] text-black font-[400]"
                        onClick={clearZip}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute top-[8px] left-[10px]">
                        <FontAwesomeIcon icon={faLocationDot} />
                      </div>
                      <input
                        className="py-[8px] px-[25px] border border-[#4066b033] rounded-[4px] gap-[8px] flex w-full"
                        type="text"
                        placeholder="Zip"
                        value={zipCode}
                        onChange={searchByZipCode}
                      />
                    </div>
                  </div>
                  <div className="pb-[16px] border-b border-b-[#4066b033]">
                    <div className="flex justify-between flex-wrap mb-[10px]">
                      <h2 className="md:text-[16px] text-[14px] text-black font-[700]">
                        Primary Services
                      </h2>
                      <button
                        className="md:text-[13px] text-[12px] text-black font-[400]"
                        onClick={() => clearType()}
                      >
                        Clear
                      </button>
                    </div>
                    <div>
                      <Select
                        options={[
                          { value: "", label: "Select" },
                          ...(organizationType &&
                            organizationType.map((option) => ({
                              value: option._id,
                              label: option.name,
                            }))),
                        ]}
                        onChange={filterOrganizationsByType}
                        value={selectedOptions}
                        classNamePrefix="custom-select"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between flex-wrap mb-[15px]">
                      <h2 className="md:text-[16px] text-[14px] text-black font-[700]">
                        Hours of Operation
                      </h2>
                      <button
                        className="md:text-[13px] text-[12px] text-black font-[400]"
                        onClick={() => clearhours()}
                      >
                        Clear
                      </button>
                    </div>
                    <ul>
                      <li className="mb-[22px]">
                        <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                          <input
                            id="checkbox1"
                            type="checkbox"
                            value="Weekdays 8am- 5pm"
                            class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            onChange={handleCheckboxChange}
                          />
                          <label
                            for="checkbox1"
                            class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                          >
                            Weekdays 8am- 5pm
                          </label>
                        </div>
                      </li>
                      <li className="mb-[22px]">
                        <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                          <input
                            id="checkbox2"
                            type="checkbox"
                            value="Weekdays After 5pm"
                            class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            onChange={handleCheckboxChange}
                          />
                          <label
                            for="checkbox2"
                            class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                          >
                            Weekdays After 5pm
                          </label>
                        </div>
                      </li>
                      <li className="mb-[22px]">
                        <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                          <input
                            id="checkbox3"
                            type="checkbox"
                            value="Weekends 8am- 5pm"
                            class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            onChange={handleCheckboxChange}
                          />
                          <label
                            for="checkbox3"
                            class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                          >
                            Weekends 8am- 5pm{" "}
                          </label>
                        </div>
                      </li>
                      <li className="mb-[22px]">
                        <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                          <input
                            id="checkbox4"
                            type="checkbox"
                            value="Weekends After 5pm"
                            class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            onChange={handleCheckboxChange}
                          />
                          <label
                            for="checkbox4"
                            class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                          >
                            Weekends After 5pm
                          </label>
                        </div>
                      </li>
                      <li className="mb-[22px]">
                        <div class="flex items-center mb-4 gap-[12px] flex-wrap">
                          <input
                            id="checkbox5"
                            type="checkbox"
                            value="24/7"
                            class="w-[22px] h-[22px] text-blue-600 bg-white border-[#4066b033] rounded-[2px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            onChange={handleCheckboxChange}
                          />
                          <label
                            for="checkbox5"
                            class="text-[13px] md:text-[14px] font-[400] text-gray-900 min-w-[135px]"
                          >
                            24/7
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="xl:w-[85%] w-full">
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-[12px] top-[12px]"
                    />
                    <input
                      placeholder="Search"
                      className="py-[8px] px-[12px] ps-[32px] bg-[#FAFAFA] border border-[#4066b033] rounded-[4px] w-full"
                      onChange={searchWithOrganizationName}
                      value={searchTerm}
                    />
                  </div>
                  <div className="flex justify-between flex-wrap mb-[16px] items-center gap-[8px] py-[16px]">
                    <ul className="flex gap-[8px] flex-wrap">
                      {selectedAllfilterOptions.map((tag, index) => (
                        <li className="mb-[8px]">
                          <div className="tag py-[8px] rounded-[4px] px-[16px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center min-w-[90px] gap-[16px]">
                            <span className="font-[400] md:text-[16px] text-[14px]">
                              {tag}
                            </span>
                            <Link href={""} onClick={() => removeFilter(tag)}>
                              <FontAwesomeIcon icon={faXmark} />
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="">
                    {organizations.length == 0 ? (
                      <div className="flex flex-wrap gap-[32px] sm:py-[24px] sm:px-[32px] py-[24px] px-[24px] justify-between bg-[#FAFAFA] border border-[#4066b033] rounded-[10px] it mb-[16px] shadow-[#00000040] shadow-sm items-end">
                        <div className="text-center">
                          <p className="text-gray-500">
                            No Organizations Found
                          </p>
                        </div>
                      </div>
                    ) : (
                      organizations.map((org, index) => (
                        <>
                          <div className="flex flex-wrap gap-[32px] sm:py-[24px] sm:px-[32px] py-[24px] px-[24px] justify-between bg-[#FAFAFA] border border-[#4066b033] rounded-[10px] it mb-[16px] shadow-[#00000040] shadow-sm items-end">
                            <div className="flex flex-wrap gap-[32px]">
                              <div className="w-[56px] h-[56px] object-fill rounded-[100%]">
                                <Image
                                  className="w-full h-full"
                                  src={`${process.env.CLOUDINARY_IMAGE_URL}${org?.logo}`}
                                  width="120"
                                  height="120"
                                  alt="logo"
                                />
                              </div>
                              <div>
                                <h2 className="md:text-[20px] text-[18px] text-black font-[700] mb-[10px]">
                                  {org?.name}
                                </h2>
                                <span className="md:text-[14px] text-[13px] text-black font-[400] mb-[16px] block">
                                  {org?.street1}
                                </span>
                                <ul className="flex flex-wrap gap-[16px]">
                                  {org &&
                                    org?.typeInfo?.map((organization) => (
                                      <>
                                        <li className="mb-[8px]">
                                          <span className="tag py-[4px] px-[8px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center min-w-[90px]">
                                            {organization?.name}
                                          </span>
                                        </li>
                                      </>
                                    ))}
                                  <li>
                                    <span className="tag py-[4px] px-[8px] text-[12px] bg-[#efe3ff] inline-flex justify-center items-center min-w-[40px]">
                                      Counseling
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div>
                              <button
                                onClick={() =>
                                  goToOrganizationInterior(org?._id)
                                }
                                className="py-[8px] px-[20px] w-full bg-themecolor hover:bg-white text-white hover:text-themecolor border border-themecolor rounded-[4px]"
                              >
                                View Resource
                              </button>
                            </div>
                          </div>
                        </>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center w-full">
                <ReactPaginate
                  pageCount={totalPages}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={1}
                  onPageChange={(event) => setCurrentPage(event.selected + 1)}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                  previousLabel={
                    <IconContext.Provider
                      value={{ color: "#B8C1CC", size: "36px" }}
                    >
                      <AiFillLeftCircle />
                    </IconContext.Provider>
                  }
                  nextLabel={
                    <IconContext.Provider
                      value={{ color: "#B8C1CC", size: "36px" }}
                    >
                      <AiFillRightCircle />
                    </IconContext.Provider>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CommunitySearch;
