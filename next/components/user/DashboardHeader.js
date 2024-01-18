import React, { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import iconSearch from "../../assets/images/icon-search-black.png";
import iconBell from "../../assets/images/icon-bell.png";
import userImg from "../../assets/images/sample-img.png";
import { Menu, Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import DashboadLogo from "../../assets/images/logo-dashboard.png";
import { getUserData } from "@/api/users";
import { getUserOrganization } from "@/api/organizations";
import { isLoggedIn } from "@/helpers/authHelper";
import avatar from "../../assets/images/Avatar.svg";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// HeaderDashboard component displaying the dashboard's header content, including user information, search functionalities, and navigation
const HeaderDashboard = (props) => {
  // Retrieve the logged-in user details
  const user = isLoggedIn();
  const [orgId, setOrgId] = useState(null);
  const router = useRouter();
  // State to manage user data
  const [formData, setFormData] = useState({
    username: "",
    image: props?.image || avatar, // Initialize with the image prop
  });
  // Function to fetch user data asynchronously
  const getUser = async () => {
    let res = await getUserData(user);
    if (res) var { statusCode, userData } = res;
    if (statusCode === 200) {
      setFormData({
        image: userData?.image,
        username: userData?.username,
      });
    }
  };

  const myOrganization = () => {
    if (orgId) {
      router.push("/organization-interior/" + orgId);
    } else {
      router.push("/create-org");
    }
  };
  const getUserOrg = async () => {
    let res = await getUserOrganization(user);
    if (res && res?.success === true) {
      setOrgId(res.userOrganization);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  useEffect(() => {
    getUser();
    getUserOrg();
  }, [props]);
  // Return JSX elements for the header
  return (
    <header
      id="header"
      className="h-16 border-b border-[#4066b033] flex items-center justify-between relative px-8 bg-white"
    >
      <div>
        <div className="ml-5">
          <Link href={""} className="block md:hidden">
            <Image src={DashboadLogo} width="40" height="27" alt="" />
          </Link>
        </div>
        <form className="dashboard-search-form relative items-center lg:w-[540px]  w-full h-[40px] mr-[12px]  hidden md:block ">
          <span className="absolute top-[5px] left-[12px]">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <div className="input-holder w-full">
            <input
              type="text"
              className="border py-2 px-[32px] border-black  w-full h-full p-0 bg-transparent focus:shadow-none focus:outline-none focus:ring-0"
            />
          </div>
        </form>
      </div>
      <div>
        <div className="user-block flex items-center pe-4">
          <span className="block md:hidden absolute top-[20px]">
            <form role="search" method="get" class="search-forms" action="">
              <label>
                <input
                  type="search"
                  class="search-fields bg-transparent p-[2px]"
                  placeholder="Search …"
                />
              </label>
              <input type="submit" class="search-submit" />
            </form>
          </span>
          <span className="bell-icon">
            <Image src={iconBell} width="24" height="24" alt="" />
          </span>
          <div className="ms-4 flex items-center">
            <Link href="/profile">
              <div className="w-[50px] h-[50px] rounded-full overflow-hidden object-fill ">
                {typeof formData?.image === "string" ? (
                  // Check if it's a URL
                  <Image
                    src={`${process.env.CLOUDINARY_IMAGE_URL}${formData?.image}`}
                    width={40}
                    height={40}
                    alt=""
                    className="w-full h-full overflow-hidden object-fill"
                  />
                ) : //   formData?.image instanceof File
                formData?.image instanceof Blob ? (
                  // Check if it's a Blob or File
                  <Image
                    src={URL.createObjectURL(formData?.image)}
                    width={40}
                    height={40}
                    alt=""
                    className="w-full h-full overflow-hidden object-fill"
                  />
                ) : (
                  // Fallback to userImg when neither of the conditions is true
                  <Image
                    src={userImg}
                    width={40}
                    height={40}
                    alt=""
                    className="w-full h-full overflow-hidden object-fill"
                  />
                )}
              </div>
            </Link>
            <Menu
              as="div"
              className="relative border-0 rounded-0 text-left hidden md:block"
            >
              <div>
                <Menu.Button className="w-full px-3 py-2 flex items-center after:content-[''] after:w-[11px] after:h-[11px] after:border-black after:border-e-2 after:border-b-2 after:rotate-45 after:absolute after:right-[-1px] after:top-[7px]">
                  <span className="nav-text text-[16px] leading-[20px] mr-3">
                    {formData?.username}
                  </span>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="w-[150px] absolute top-full left-0 right-0 border rounded-6 bg-grey2 z-10">
                  <div>
                    <Menu.Item>
                      <button
                        onClick={myOrganization}
                        className="flex items-center p-2 hover:bg-black hover:text-white border-b-1 border-b-black w-full"
                      >
                        <span className="nav-text text-[16px] leading-[20px]">
                          My Organization
                        </span>
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        href="/dashboard"
                        className="flex items-center p-2 hover:bg-black hover:text-white border-b-1 border-b-black"
                      >
                        <span className="nav-text text-[16px] leading-[20px]">
                          My Settings
                        </span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        href="/profile"
                        className="flex items-center p-2 hover:bg-black hover:text-white border-b-1 border-b-black"
                      >
                        <span className="nav-text text-[16px] leading-[20px]">
                          My Profile
                        </span>
                      </Link>
                    </Menu.Item>
                    {user && (
                      <Menu.Item>
                        <Link
                          onClick={handleLogout}
                          href="#"
                          className="flex items-center p-2 hover:bg-black hover:text-white border-b-1 border-b-black"
                        >
                          <span className="nav-text text-[16px] leading-[20px]">
                            Logout
                          </span>
                        </Link>
                      </Menu.Item>
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;
