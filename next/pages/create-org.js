import Layout from "@/Layouts/layout2";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getUserData } from "@/api/users";
import { isLoggedIn } from "@/helpers/authHelper";
import useUserData from "@/hooks/useUserData";
import { useRouter } from "next/router";
import { organizationTypeList, createOrganization } from "@/api/organizations";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { TextField } from "@mui/material";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import FullPageLoader from "@/components/fullPageLoader";

function CreateOrg() {
  const user = isLoggedIn(); // Your isLoggedIn function
  const router = useRouter(); // Your router hook or function
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const getComponentValue = (components, targetComponent) => {
    const component = components.find((comp) =>
      comp.types.includes(targetComponent)
    );
    return component ? component.short_name : "";
  };
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationWebsite: "",
    missionStatement: "",
    phone: "",
    rulingYear: "",
    ein: 0,
    city: "",
    state: "",
    zipcode: "",
    lat: "",
    lon: "",
    image: null, // Store the selected image as a File object
    form990: null,
    annualReports: null,
    email: "",
    hoursOfOperation: { startDate: null, endDate: null }, // Object with startDate and endDate
    headOfOrganization: "",
    headOfFinancials: "",
  });

  const [uploadClicked, setUploadClicked] = useState({
    image: false,
    form990: false,
    annualReports: false,
  });
  const [address, setAddress] = useState(""); // To store the selected address

  const { userData, organizationType, loaded } = useUserData(
    user,
    getUserData,
    router,
    organizationTypeList
  ); // Using the custom hook
  // Set all input fields except image in useState
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ein") {
      // Parse the input value as a float
      const einValue = parseFloat(value);

      // Check if the parsed EIN value is less than zero
      if (einValue < 0) {
        // If it's less than zero, set the EIN value to zero
        setFormData({ ...formData, [name]: "0" });
      } else {
        // If it's a valid value (greater than or equal to zero), update the form data.
        setFormData({ ...formData, [name]: value });
      }
    } else {
      // For other fields, just update the form data without checking.
      setFormData({ ...formData, [name]: value });
    }
  };

  // Set Image in UseState
  const handleImageChange = (e) => {
    const name = e.target.name;
    if (e.target.files[0])
      setUploadClicked((prev) => ({ ...prev, [name]: true }));
    setFormData({ ...formData, [name]: e.target.files[0] });
  };

  // User can select the uptp 3 organizations types
  const handleSelectChange = (selected) => {
    if (selected && selected.length > 3) {
      // If more than 3 options are selected, remove the last option
      selected.pop();
    }
    setSelectedOptions(selected);
  };

  // Handler for when the user types in the address field
  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
  };

  // Function to create organization
  const handleSubmit = async (event) => {
    event.preventDefault();
    const obj = {
      ...formData,
      address,
      selectedOptions,
    };
    const updatedFormData = new FormData();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === "selectedOptions" && Array.isArray(obj[key])) {
          obj[key].forEach((option) => {
            if (typeof option === "object" && option.hasOwnProperty("value")) {
              updatedFormData.append(key, option.value);
            }
          });
        } else if (key === "hoursOfOperation") {
          // Custom format for startDate and endDate before converting to string
          const { startDate, endDate } = obj[key];
          // Create an object with formatted dates
          const formattedHoursOfOperation = {
            startDate: startDate,
            endDate: endDate,
          };

          updatedFormData.append(
            key,
            JSON.stringify(formattedHoursOfOperation)
          );
        } else {
          updatedFormData.append(key, obj[key]);
        }
      }
    }
    setLoading(true);
    const organizationResult = await createOrganization(user, updatedFormData);
    if (organizationResult) {
      var { statusCode, message, organizationDetails } = organizationResult;
      if (statusCode === 400) {
        Swal.fire("Oops", message, "error");
      }
      if (statusCode === 200) {
        Swal.fire("Good job!", message, "success");
        router.push(`/verify-organization/${organizationDetails?._id}`);
      }
      if (statusCode === 500) {
        Swal.fire("Oops", message, "error");
      }
      setLoading(false);
    }
  };

  // Handler for when the user selects an address suggestion
  const handleSelect = async (address) => {
    try {
      const response = await geocodeByAddress(address);
      await getLatLng(response[0]);
      // Handle the selected address details as needed, for example, update formData
      if (response && response.length > 0) {
        const address = response[0];
        const components = address.address_components;
        // Attempt to get the zip code using multiple possible component types
        const zipCode =
          getComponentValue(components, "postal_code") ||
          getComponentValue(components, "postal_code_prefix") || // Additional possibility
          "";
        var addressDetails = {
          country: getComponentValue(components, "country"),
          zipcode: zipCode, // Use the zip code variable
          state: getComponentValue(components, "administrative_area_level_1"),
          city: getComponentValue(components, "locality"),
          street: address.formatted_address,
          lat: address.geometry.location.lat(),
          lon: address.geometry.location.lng(),
        };
      }
      // Update formData with the selected address
      setFormData({
        ...formData,
        city: addressDetails.city,
        state: addressDetails.state,
        zipcode: addressDetails.zipcode,
        lat: addressDetails.lat,
        lon: addressDetails.lon,
      });
      setAddress(address); // Update the input field with the selected address
    } catch (error) {}
  };
  const selectionRange = {
    startDate: formData.hoursOfOperation?.startDate,
    endDate: formData.hoursOfOperation?.endDate,
    key: "selection",
  };

  const handleSelectDate = (ranges) => {
    setFormData({
      ...formData,
      hoursOfOperation: {
        startDate: ranges.selection?.startDate,
        endDate: ranges.selection?.endDate,
      },
    });
  };

  useEffect(() => {
    if (userData) setLoading(false);
  }, [userData]);
  return (
    <>
      {loaded ? (
        <FullPageLoader />
      ) : (
        <>
          <Layout image={userData?.image}>
            <div className="wrapper flex">
              <div className="bg-grey2 w-full">
                <div className="p-8">
                  <div className="hading-card py-[24px] px-[32px] flex items-center justify-between mb-[32px]">
                    <div>
                      <h2 className="text-[18px] md:text-[24px] mb-[10px] leading-[33px] font-[700] text-themecolor">
                        Create an Organization
                      </h2>
                      <p className="text-[16px] font-[400] block mb-[10px]">
                        Now, since your organization is new to SolacePRO, please
                        start by entering the organizations information.
                      </p>
                    </div>
                    <span className="icon-dots">
                      <FontAwesomeIcon icon={faEllipsis} />
                    </span>
                  </div>
                  <div className="p-[24px] pb-[14px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white flex gap-[32px] mb-[16px] lg:flex-nowrap flex-wrap">
                    <div className="lg:w-[10%] w-full me-[20px]">
                      <strong className="text-[20px] font-[600] text-themecolor">
                        Basic Information
                      </strong>
                    </div>
                    <div className="w-[100%] lg:w-[90%]">
                      <div className="flex sm:gap-[32px] gap-0 w-full flex-wrap sm:flex-nowrap">
                        <div className="w-[100%] sm:w-[50%] flex-wrap sm:flex-nowrap">
                          <div className="mb-[10px]">
                            <label className="text-[16px] font-[400] block mb-[10px]">
                              Organization Name*
                            </label>
                            <div>
                              <input
                                className="rounded-[5px] py-[8px] px-[12px] bg-[#FAFAFA] border-[#4066b033] border w-full text-[16px]"
                                required
                                id="organizationName"
                                name="organizationName"
                                value={formData.organizationName}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="mb-[10px]">
                            <label className="text-[16px] font-[400] block mb-[10px]">
                              Hours of Operation
                            </label>
                            <div>
                              <DateRangePicker
                                ranges={[selectionRange]}
                                onChange={handleSelectDate}
                              />
                            </div>
                          </div>

                          <div className="mb-[10px]">
                            <label className="text-[16px] font-[400] block mb-[10px]">
                              Phone*
                            </label>
                            <div>
                              <input
                                className="rounded-[5px] py-[8px] px-[12px] bg-[#FAFAFA] border border-[#4066b033] w-full text-[16px]"
                                required
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="mb-[10px]">
                            <label className="text-[16px] font-[400] block mb-[10px]">
                              EIN
                            </label>
                            <div>
                              <input
                                className="rounded-[5px] py-[8px] px-[12px] bg-[#FAFAFA] border-[#4066b033] w-full text-[16px]"
                                id="ein"
                                name="ein"
                                type="number"
                                onChange={handleChange}
                                value={formData.ein}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-[100%] sm:w-[50%] flex-wrap sm:flex-nowrap">
                          <div className="mb-[10px]">
                            <label className="text-[16px] font-[400] block mb-[10px]">
                              Ruling Year
                            </label>
                            <div>
                              <input
                                className="rounded-[5px] py-[8px] px-[12px] bg-[#FAFAFA] border-[#4066b033] w-full text-[16px]"
                                required
                                type="date"
                                id="rulingYear"
                                name="rulingYear"
                                onChange={handleChange}
                                value={formData.rulingYear}
                              />
                            </div>
                          </div>
                          <div className="mb-[10px]">
                            <label className="text-[16px] font-[400] block mb-[10px]">
                              Email*
                            </label>
                            <div>
                              <input
                                className="rounded-[5px] py-[8px] px-[12px] bg-[#FAFAFA] border-[#4066b033] w-full text-[16px]"
                                autoComplete="email"
                                id="email"
                                name="email"
                                type="text"
                                value={formData.email}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-[24px] pb-[14px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white flex gap-[32px] mb-[16px] lg:flex-nowrap flex-wrap">
                    <div className="w-[10%] me-[20px]">
                      <strong className="text-[20px] font-[600] text-themecolor">
                        Address
                      </strong>
                    </div>
                    <div className="w-[100%] lg:w-[90%]">
                      <div className="flex sm:gap-[32px] gap-0 w-full flex-wrap sm:flex-nowrap">
                        <div className="w-[100%] sm:w-[50%] flex-wrap sm:flex-nowrap">
                          <div className="mb-[10px]">
                            <label className="text-[16px] font-[400] block mb-[10px]">
                              Street Address*
                            </label>
                            <div>
                              <PlacesAutocomplete
                                value={address}
                                onChange={handleAddressChange}
                                onSelect={handleSelect}
                                className="bg-[#FAFAFA] border border-[#4066b033]"
                              >
                                {({
                                  getInputProps,
                                  suggestions,
                                  getSuggestionItemProps,
                                  loading,
                                }) => (
                                  <div className="relative">
                                    <TextField
                                      fullWidth
                                      margin="normal"
                                      autoComplete="streetAddressOne"
                                      autoFocus
                                      required
                                      id="streetAddressOne"
                                      name="streetAddressOne"
                                      className="mt-0 bg-[#FAFAFA] border border-[#4066b033]"
                                      {...getInputProps()}
                                      value={address}
                                    />

                                    {loading && <div>Loading...</div>}
                                    <div className="absolute left-[-1px] top-[41px] right-[-1px] z-10 bg-white border-x-2 ">
                                      {suggestions.map((suggestion) => (
                                        <div
                                          className="text-themecolor hover:text-white hover:bg-themecolor px-2 py-2 border-b-2 border-themecolor cursor-pointer"
                                          {...getSuggestionItemProps(
                                            suggestion
                                          )}
                                          key={suggestion.placeId}
                                        >
                                          {suggestion.description}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </PlacesAutocomplete>
                            </div>
                          </div>
                          <div className="mb-[10px]">
                            <label className="text-[16px] font-[400] block mb-[10px]">
                              City*
                            </label>
                            <div>
                              <TextField
                                fullWidth
                                margin="normal"
                                autoComplete="city"
                                autoFocus
                                id="city"
                                name="city"
                                type="text"
                                className="mt-0"
                                value={formData.city}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-[100%] sm:w-[50%] flex-wrap sm:flex-nowrap">
                          <div className="mb-[10px]">
                            <label className="text-[16px] font-[400] block mb-[10px]">
                              Street Address 2
                            </label>
                            <div>
                              <PlacesAutocomplete
                                value={address}
                                onChange={handleAddressChange}
                                onSelect={handleSelect}
                              >
                                {({
                                  getInputProps,
                                  suggestions,
                                  getSuggestionItemProps,
                                  loading,
                                }) => (
                                  <div className="relative">
                                    <TextField
                                      fullWidth
                                      margin="normal"
                                      autoComplete="streetAddressOne"
                                      autoFocus
                                      required
                                      id="streetAddressOne"
                                      name="streetAddressOne"
                                      className="mt-0 bg-[#FAFAFA] border border-[#4066b033]"
                                      {...getInputProps()}
                                      value={address}
                                    />

                                    {loading && <div>Loading...</div>}
                                    <div className="absolute left-[-1px] top-[41px] right-[-1px] z-10 bg-white border-x-2 ">
                                      {suggestions.map((suggestion) => (
                                        <div
                                          className="text-themecolor hover:text-white hover:bg-themecolor px-2 py-2 border-b-2 border-themecolor cursor-pointer"
                                          {...getSuggestionItemProps(
                                            suggestion
                                          )}
                                          key={suggestion.placeId}
                                        >
                                          {suggestion.description}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </PlacesAutocomplete>
                            </div>
                          </div>
                          <div className="mb-[10px] flex gap-[16px]">
                            <div className="w-[50%] flex-wrap sm:flex-nowrap mb-[10px]">
                              <label className="text-[16px] font-[400] block mb-[10px]">
                                State*
                              </label>
                              <div>
                                <TextField
                                  fullWidth
                                  margin="normal"
                                  autoComplete="state"
                                  autoFocus
                                  id="state"
                                  name="state"
                                  type="text"
                                  className="mt-0"
                                  value={formData.state}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="w-[50%] flex-wrap sm:flex-nowrap mb-0 sm:mb-[10px]">
                              <label className="text-[16px] font-[400] block mb-[10px]">
                                Zipcode*
                              </label>
                              <div>
                                <TextField
                                  fullWidth
                                  margin="normal"
                                  autoComplete="zipcode"
                                  autoFocus
                                  id="zipcode"
                                  name="zipcode"
                                  type="text"
                                  className="mt-0"
                                  value={formData.zipcode}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-[24px] pb-[14px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white flex gap-[32px] mb-[16px] lg:flex-nowrap flex-wrap">
                    <div className="w-[100%] lg:w-[10%] me-[20px]">
                      <strong className="text-[20px] font-[600] text-themecolor">
                        Services
                      </strong>
                    </div>
                    <div className="w-[100%] lg:w-[90%]">
                      <div className="flex sm:gap-[32px] gap-0 w-full flex-wrap sm:flex-nowrap">
                        <div className="w-[100%] sm:w-[50%] flex-wrap sm:flex-nowrap">
                          <div className="mb-[10px]">
                            <label className="text-[16px] font-[400] block mb-[10px]">
                              Type of Organization*
                            </label>
                            <Select
                              classNamePrefix="custom-select"
                              placeholder="Select up to three..."
                              options={organizationType}
                              onChange={handleSelectChange}
                              value={selectedOptions}
                              isMulti
                            />
                          </div>
                        </div>
                        <div className="w-[100%] sm:w-[50%] flex-wrap sm:flex-nowrap">
                          <div className="mb-[10px]">
                            <label className="text-[16px] font-[400] block mb-[10px]">
                              Services Provided*
                            </label>
                            <div>
                              <Select
                                classNamePrefix="custom-select"
                                placeholder="Select up to Five.."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <span className="text-[13px] sm:text-[16px] font-[400]">
                          Can’t find what you’re looking for?
                          <Link
                            className="text-[13px] sm:text-[16px] font-[400] decoration-black decoration-solid underline"
                            href={""}
                          >
                            Add a Service Listing
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-[24px] pb-[14px] shadow-[#00000040] shadow-sm rounded-[10px] bg-white flex gap-[32px] mb-[16px] lg:flex-nowrap flex-wrap">
                    <div className="w-[10%] me-[20px]">
                      <strong className="text-[20px] font-[600] text-themecolor">
                        Overview
                      </strong>
                    </div>
                    <div className="w-[100%] lg:w-[90%]">
                      <div className="flex sm:gap-[32px] gap-0 w-full flex-col ">
                        <div>
                          <div className="mb-[32px]">
                            <div className="gap-[32px] items-end flex-wrap lg:flex-nowrap flex">
                              <div className=" me-[6px]">
                                <label className="text-[16px] font-[400] block mb-[10px] ">
                                  Organization Logo*
                                </label>
                                <div className="file-btn-holder relative w-[120px] h-[50px]">
                                  <label
                                    htmlFor="file-input"
                                    className="file-btn absolute w-full h-[50px] border border-themecolor bg-[transparent] file-btn-holder-hover:bg-white text-themecolor file-btn-holder-hover:text-themecolor px-[20px] py-[8px] rounded-4 flex justify-center items-center"
                                    // Call handleUploadClick when the button is clicked
                                  >
                                    Upload
                                  </label>
                                  <input
                                    type="file"
                                    id="file-input"
                                    name="image"
                                    required
                                    className="mt-0"
                                    style={{ display: "none" }}
                                    onChange={handleImageChange} // Pass the field name as a parameter
                                  />
                                </div>
                                {uploadClicked &&
                                  formData.image === undefined && (
                                    <span className="ml-2 text-red-500">
                                      Image not selected
                                    </span>
                                  )}
                                {formData.image && (
                                  <span className="ml-2">
                                    {formData.image.name}
                                  </span>
                                )}
                              </div>

                              <div className="w-full">
                                <label className="text-[16px] font-[400] block mb-[10px]">
                                  Organization Website*
                                </label>
                                <div>
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    autoComplete="name"
                                    autoFocus
                                    required
                                    id="organizationWebsite"
                                    name="organizationWebsite"
                                    className="mt-0"
                                    value={formData.organizationWebsite}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>

                              <div className="w-full">
                                <label className="text-[16px] font-[400] block mb-[10px]">
                                  Head of Organization*
                                </label>
                                <div>
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    autoFocus
                                    required
                                    id="headOfOrganization"
                                    name="headOfOrganization"
                                    className="mt-0"
                                    value={formData.headOfOrganization}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>

                              <div className="w-full">
                                <label className="text-[16px] font-[400] block mb-[10px]">
                                  Head of Financials*
                                </label>
                                <div>
                                  <TextField
                                    fullWidth
                                    margin="normal"
                                    autoFocus
                                    required
                                    id="headOfFinancials"
                                    name="headOfFinancials"
                                    className="mt-0"
                                    value={formData.headOfFinancials}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mb-[32px]">
                            <label className="text-[16px] font-[400] block mb-[10px]">
                              Mission Statement*
                            </label>
                            <div>
                              <textarea
                                placeholder="Type your message..."
                                required
                                name="missionStatement"
                                className="rounded-[5px] py-[8px] px-[12px] bg-[#FAFAFA] border-[#4066b033] w-full text-[16px]"
                                value={formData.missionStatement}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="gap-0 sm:gap-[32px] items-end flex-wrap sm:flex-nowrap flex">
                            <div className="mb-[13px]">
                              <label className="text-[16px] font-[400] block mb-[10px] me-[13px]">
                                Upload Form 990
                              </label>

                              <div className="file-btn-holder relative w-[120px] h-[50px]">
                                <label
                                  htmlFor="form990"
                                  className="absolute w-full h-[50px] border border-themecolor bg-[transparent] file-btn-holder-hover:bg-white text-themecolor file-btn-holder-hover:text-themecolor px-[24px] py-[12px] rounded-4 flex justify-center items-center"
                                >
                                  Upload
                                </label>
                                <input
                                  type="file"
                                  name="form990"
                                  id="form990"
                                  required
                                  style={{ display: "none" }}
                                  onChange={handleImageChange}
                                />
                              </div>
                              {uploadClicked.form990 &&
                                formData.form990 === undefined && (
                                  <span className="ml-2 text-red-500">
                                    Form 990 not selected
                                  </span>
                                )}
                              {formData.form990 && (
                                <span className="ml-2">
                                  {formData.form990.name}
                                </span>
                              )}
                            </div>
                            <div className="mb-[13px]">
                              <label className="text-[16px] font-[400] block mb-[10px] me-[13px]">
                                Upload Annual Reports
                              </label>
                              <div className="file-btn-holder relative w-[120px] h-[50px]">
                                <label
                                  htmlFor="annualReports"
                                  className="absolute w-full h-[50px] border border-themecolor bg-[transparent] file-btn-holder-hover:bg-white text-themecolor file-btn-holder-hover:text-themecolor px-[24px] py-[12px] rounded-4 flex justify-center items-center"
                                >
                                  Upload
                                </label>
                                <input
                                  type="file"
                                  name="annualReports"
                                  id="annualReports"
                                  required
                                  style={{ display: "none" }}
                                  onChange={handleImageChange}
                                />
                              </div>
                              {uploadClicked.annualReports &&
                                formData.annualReports === undefined && (
                                  <span className="ml-2 text-red-500">
                                    Annual Reports not selected
                                  </span>
                                )}
                              {formData.annualReports && (
                                <span className="ml-2">
                                  {formData.annualReports.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-[8px] flex-wrap">
                    <button
                      onClick={handleSubmit}
                      className="py-[8px] px-[20px] border-themecolor border bg-themecolor text-white hover:bg-transparent hover:text-themecolor rounded-[4px] text-[16px] font-[400]"
                    >
                      Save
                      {loading ? <Loader className="mr-3" /> : null}
                    </button>
                    <button className="py-[8px] px-[20px]  border-themecolor border hover:bg-themecolor hover:text-white bg-transparent text-themecolor rounded-[4px] text-[16px] font-[400]">
                      Save & Complete Later
                    </button>
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
export default CreateOrg;
