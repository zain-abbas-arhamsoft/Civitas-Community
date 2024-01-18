import React, { useState, useEffect } from "react";
import Image from "next/image";
import AvatarCircleImg from "../../assets/images/sample-img.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  filterAdminOrganizationType,
  filterByOrganizationName,
} from "@/api/organizations";
import Layout from "@/Layouts/layout3";
import { useRouter } from "next/router";
import FullPageLoader from "@/components/fullPageLoader";
import FilterModal from "../../components/admin/filter-modal";
import ReactPaginate from "react-paginate"; // for pagination
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons"; // for customizing icons
import { isLoggedIn } from "@/helpers/authHelper";
function AdminViewingOrganization() {
  const [organizations, setOrganizations] = useState([]);
  const user = isLoggedIn();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [organizationType, setOrganizationType] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedAllfilterOptions, setSelectedAllfilterOptions] = useState([]);
  const [selectedfiltervalue, setSelectedfiltervalue] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [zipCode, setZipCode] = useState();
  const [filters, setFilters] = useState({
    name: "",
    currentPage: "",
    zipCode: "",
    type: [],
    hours: [],
  });
  const router = useRouter();

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
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
  };

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
  };

  // Function to filter organization on the basis of organization time and update the state with fetched data
  const handleCheckboxChange = async (event) => {
    const { value } = event.target;
    const isChecked = event.target.checked;
    let tempValues = [...workingHours];
    if (isChecked) {
      tempValues = [...workingHours, value];
      setWorkingHours(tempValues);
    } else {
      tempValues = [workingHours.filter((item) => item !== value)];
      setWorkingHours(tempValues[0]);
    }
    const newObj = { ...filters, hours: tempValues };
    if (workingHours) {
      setFilters(newObj);
    }
  };

  const getOrganizationType = async () => {
    setLoading(true);
    const organizationType = await filterAdminOrganizationType(user);
    const { statusCode } = organizationType;
    if (statusCode === 403) router.push("/");
    if (statusCode === 200) {
      setOrganizationType(organizationType?.data?.organizationType);
      setLoading(false);
    }
  };

  const goToOrganizationOverview = (orgId) => {
    router.push(`/admin/manage-organization?orgId=${orgId}`);
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
  useEffect(() => {
    const newObj = { ...filters };
    debouncedSearchOrganization(newObj);
  }, [currentPage]);

  useEffect(() => {
    getOrganizationType();
  }, []);
  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const ClearAll = () => {
    const newObj = { ...filters, type: [], zipCode: "", hours: [] };
    setFilters(newObj);
    setZipCode("");
    setSelectedfiltervalue([]);
    setSelectedOptions([]);
    setSelectedAllfilterOptions([]);
    setWorkingHours([]);
  };

  const clearZip = () => {
    const newObj = { ...filters, zipCode: "" };
    setFilters(newObj);
    setZipCode("");
  };

  const clearType = () => {
    const newObj = { ...filters, type: [] };
    setFilters(newObj);
    setSelectedfiltervalue([]);
    setSelectedOptions([]);
    setSelectedAllfilterOptions([]);
  };

  const clearhours = () => {
    const newObj = { ...filters, hours: [] };
    setFilters(newObj);
    setWorkingHours([]);
  };

  const submitButton = () => {
    const newObj = { ...filters };
    closeModal();
    debouncedSearchOrganization(newObj);
  };

  return (
    <>
      {loading ? (
        <FullPageLoader />
      ) : (
        <>
          <Layout>
            <div className="wrapper">
              <div className=" bg-[#FAFAFA] w-full">
                <div className="hading-card p-[24px] md:py-[24px] md:px-[32px]">
                  <h2 className="text-[18px] md:text-[24px] text-[18px font-bold text-themecolor mb-[10px]">
                    My SolacePRO Profile
                  </h2>
                  <p className="text-[#43515C] text-[13px] md:text-[16px]">
                    You have admin access to manage your Solace users, view data
                    analytics, and distribute rewards to organizations.
                  </p>
                </div>
                <div className="p-[32px]">
                  <div className="p-[17px] md:py-[32px]  md:px-[80px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white flex flex-col justify-center">
                    <div className="flex justify-between items-center flex-wrap mb-[24px]">
                      <h2 className="text-[18px] mb-[16px] md:text-[24px] leading-[33px] font-[700] text-themecolor">
                        Manage Organizations
                      </h2>
                    </div>
                    <div className="border-[1px] border-[#4066b033] p-[24px] mb-[24px] bg-[#FAFAFA] rounded-[4px] flex justify-between gap-[14px] flex-wrap">
                      <div className="flex gap-[12px] flex-wrap sm:flex-nowrap">
                        <div className="lg:w-[296px] w-full relative">
                          <span className="absolute left-[12px] top-[8px]">
                            <FontAwesomeIcon icon={faSearch} />
                          </span>
                          <input
                            className="py-[8px] pl-[40px] px-[12px] border-[1px] border-[#4066b033] w-full text-[16px] rounded-[4px] focus:border-themecolor"
                            placeholder="Search"
                            onChange={searchWithOrganizationName}
                            value={searchTerm}
                          />
                        </div>
                        <div>
                          <button
                            onClick={openModal}
                            className="flex gap-[12px] py-[8px] text-themecolor px-[20px] border-[1px] border-themecolor hover:bg-themecolor hover:text-[#fff] hover:fill-[#fff] stroke-white"
                          >
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M20.5 7H3.5C3.22386 7 3 6.77614 3 6.5V5.5C3 5.22386 3.22386 5 3.5 5H20.5C20.7761 5 21 5.22386 21 5.5V6.5C21 6.77614 20.7761 7 20.5 7ZM18 12.5V11.5C18 11.2239 17.7761 11 17.5 11H6.5C6.22386 11 6 11.2239 6 11.5V12.5C6 12.7761 6.22386 13 6.5 13H17.5C17.7761 13 18 12.7761 18 12.5ZM15 17.5V18.5C15 18.7761 14.7761 19 14.5 19H9.5C9.22386 19 9 18.7761 9 18.5V17.5C9 17.2239 9.22386 17 9.5 17H14.5C14.7761 17 15 17.2239 15 17.5Z"
                                  fill="#406AB3"
                                />
                              </svg>
                            </span>
                            <span>Filters</span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <ul className="flex gap-[8px] flex-wrap">
                          {selectedAllfilterOptions &&
                            selectedAllfilterOptions.map((Info, index) => (
                              <li className="mb-[8px]">
                                <div className="tag py-[8px] rounded-[4px] px-[16px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center min-w-[90px] gap-[16px]">
                                  <span className="font-[400] md:text-[16px] text-[14px]">
                                    {Info}
                                  </span>
                                </div>
                              </li>
                            ))}
                          {workingHours &&
                            workingHours.map((Info, index) => (
                              <li className="mb-[8px]">
                                <div className="tag py-[8px] rounded-[4px] px-[16px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center min-w-[90px] gap-[16px]">
                                  <span className="font-[400] md:text-[16px] text-[14px]">
                                    {Info}
                                  </span>
                                </div>
                              </li>
                            ))}
                          {zipCode && (
                            <li className="mb-[8px]">
                              <div className="tag py-[8px] rounded-[4px] px-[16px] text-[12px] bg-[#efe3ff] inline-flex justify-between items-center min-w-[90px] gap-[16px]">
                                <span className="font-[400] md:text-[16px] text-[14px]">
                                  ZipCode : {zipCode}
                                </span>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                    {organizations.map((org, index) => (
                      <div
                        className="border-[1px] border-[#4066b033] rounded-[4px] p-[24px] mb-[12px] bg-grey2 flex flex-wrap justify-between items-center"
                        onClick={() => goToOrganizationOverview(org._id)}
                      >
                        <div className="gap-[8px] flex items-center">
                          <div className="w-[26px] h-[26px] rounded-full object-fill overflow-hidden">
                            {org?.logo ? (
                              <Image
                                className="w-full h-full rounded-[100%] overflow-hidden"
                                src={`${process.env.CLOUDINARY_IMAGE_URL}${org.logo}`}
                                alt="avatar"
                                height={120}
                                width={60}
                              />
                            ) : (
                              <Image
                                className="w-[26px] h-[26px object-fill overflow-hidden rounded-full"
                                src={AvatarCircleImg}
                                alt="img"
                              />
                            )}
                          </div>
                          <span className=" text-[13px] lg:text-[15px] font-[400]">
                            {org.name}
                          </span>
                        </div>
                        <div>
                          <FontAwesomeIcon icon={faEllipsis} />
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between items-center p-[16px] overflow-x-auto sm:max-w-full max-w-[440px]"></div>
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

            <FilterModal
              isOpen={modalIsOpen}
              closeModal={closeModal}
              organizationType={organizationType}
              filterOrganizationsByType={filterOrganizationsByType}
              selectedOptions={selectedOptions}
              searchByZipCode={searchByZipCode}
              zipCode={zipCode}
              handleCheckboxChange={handleCheckboxChange}
              workingHours={workingHours}
              ClearAll={ClearAll}
              clearZip={clearZip}
              clearType={clearType}
              clearhours={clearhours}
              submitButton={submitButton}
            />
          </Layout>
        </>
      )}
    </>
  );
}
export default AdminViewingOrganization;
