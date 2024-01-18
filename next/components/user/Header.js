import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import iconSearch from "../../assets/images/icon-search.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { isLoggedIn } from "@/helpers/authHelper";
import { logoutUser } from "@/helpers/authHelper";
import { useRouter } from "next/router";
const Header = () => {
  const user = isLoggedIn(); // Check if the user is logged in
  const router = useRouter();
  const [isActive, setActive] = useState(false);
  const [loginText, setLoginText] = useState(null);
  // Update login text based on the user's authentication status and initialize the mobile navigation to be inactive on page load
  useEffect(() => {
    if (user?.token) {
      setLoginText(user?.token);
    } else {
      setLoginText(null);
    }
    setActive(false); // Ensure isActive is false on client-side load
  }, []);
  // Function to handle user logout

  const handleLogout = async (e) => {
    logoutUser();
    setLoginText(null);
    router.push("/login");
  };

  return (
    // Header section
    <header id="header" className="h-16 border-b border-black">
      <div className="custom-container mx-auto h-full relative">
        <div className="h-full flex justify-between items-center">
          <nav id="nav">
            <span
              className="icon-navbar lg:hidden"
              onClick={() => setActive(!isActive)}
            >
              <FontAwesomeIcon icon={faBars} />
            </span>
            <ul
              className={`flex flex-col lg:flex-row lg:w-auto absolute lg:relative bg-themecolor lg:bg-transparent gap-[24px] items-center z-10 ${
                isActive && "active"
              }`}
            >
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="63"
                  height="28"
                  viewBox="0 0 63 28"
                  fill="none"
                >
                  <path
                    d="M34.9909 13.2659L37.7629 11.679C37.9575 11.5678 38.1975 11.5678 38.3921 11.679L40.0046 12.6024C40.1992 12.7135 40.4392 12.7135 40.6338 12.6024L42.6823 11.4293C42.8769 11.3182 42.9973 11.1115 42.9973 10.8885V8.54249C42.9973 8.31948 42.8776 8.11352 42.6823 8.00167L40.6338 6.82865C40.4392 6.71749 40.1992 6.71749 40.0046 6.82865L38.3604 7.7698C38.1658 7.88096 37.9258 7.88096 37.7312 7.7698L34.9902 6.20054C34.7956 6.08938 34.6753 5.88273 34.6753 5.65972V3.79653C34.6753 3.57352 34.5557 3.36756 34.3604 3.25571L32.3132 2.08337C32.1186 1.97221 31.8786 1.97221 31.684 2.08337L29.6355 3.25639C29.4409 3.36756 29.3206 3.5742 29.3206 3.79721V5.66177C29.3206 5.88478 29.2009 6.09074 29.0056 6.20259L26.2647 7.77184C26.07 7.88301 25.8301 7.88301 25.6355 7.77184L23.9913 6.8307C23.7967 6.71953 23.5567 6.71953 23.3621 6.8307L21.3149 8.00235C21.1203 8.11352 21 8.32016 21 8.54317V10.8892C21 11.1122 21.1197 11.3182 21.3149 11.43L22.9433 12.3623C23.1379 12.4735 23.2582 12.6801 23.2582 12.9031V16.0866C23.2582 16.3097 23.1386 16.5156 22.9433 16.6275L21.3149 17.5597C21.1203 17.6709 21 17.8776 21 18.1006V20.4466C21 20.6696 21.1197 20.8756 21.3149 20.9874L23.3635 22.1604C23.5581 22.2716 23.798 22.2716 23.9927 22.1604L25.6293 21.2234C25.8239 21.1122 26.0639 21.1122 26.2585 21.2234L29.007 22.7974C29.2016 22.9086 29.3219 23.1152 29.3219 23.3382V25.2028C29.3219 25.4258 29.4416 25.6318 29.6369 25.7436L31.6854 26.9166C31.88 27.0278 32.12 27.0278 32.3146 26.9166L34.3631 25.7436C34.5577 25.6324 34.6781 25.4258 34.6781 25.2028V23.3382C34.6781 23.1152 34.7977 22.9093 34.993 22.7974L37.7415 21.2234C37.9361 21.1122 38.1761 21.1122 38.3707 21.2234L40.0073 22.1604C40.202 22.2716 40.4419 22.2716 40.6365 22.1604L42.6851 20.9874C42.8797 20.8763 43 20.6696 43 20.4466V18.1006C43 17.8776 42.8804 17.6716 42.6851 17.5597L40.6365 16.3867C40.4419 16.2756 40.202 16.2756 40.0073 16.3867L38.3872 17.3142C38.1926 17.4254 37.9526 17.4254 37.758 17.3142L34.9937 15.7313C34.7991 15.6202 34.6787 15.4135 34.6787 15.1905V13.8068C34.6787 13.5837 34.7984 13.3778 34.9937 13.2659H34.9909ZM37.3276 20.495L34.5715 22.0731C34.3769 22.1843 34.1369 22.1843 33.9423 22.0731L32.7341 21.3809C32.5395 21.2698 32.4191 21.0631 32.4191 20.8401V17.6832C32.4191 17.4602 32.5388 17.2542 32.7341 17.1424L33.9423 16.4501C34.1369 16.339 34.3769 16.339 34.5715 16.4501L37.3276 18.0283C37.5222 18.1394 37.6425 18.3461 37.6425 18.5691V19.9528C37.6425 20.1759 37.5229 20.3818 37.3276 20.4937V20.495ZM37.3276 10.9656L34.5708 12.5437C34.3762 12.6549 34.1362 12.6549 33.9416 12.5437L32.7334 11.8522C32.5388 11.741 32.4184 11.5344 32.4184 11.3114V8.15444C32.4184 7.93143 32.5381 7.72547 32.7334 7.61362L33.9416 6.92208C34.1362 6.81092 34.3762 6.81092 34.5708 6.92208L37.3276 8.50021C37.5222 8.61137 37.6425 8.81801 37.6425 9.04102V10.4248C37.6425 10.6478 37.5229 10.8537 37.3276 10.9656ZM31.5788 8.15512V11.312C31.5788 11.5351 31.4592 11.741 31.2639 11.8529L30.0577 12.5437C29.8631 12.6556 29.6231 12.6549 29.4278 12.5437L26.6697 10.9622C26.4751 10.8503 26.3554 10.6444 26.3554 10.422V9.04307C26.3554 8.82006 26.4751 8.6141 26.6704 8.50225L29.4272 6.92413C29.6218 6.81296 29.8618 6.81296 30.0564 6.92413L31.2646 7.61567C31.4592 7.72683 31.5795 7.93347 31.5795 8.15648L31.5788 8.15512ZM26.2385 11.6762L29.0063 13.2632C29.2009 13.3751 29.3206 13.581 29.3206 13.8033V15.1673C29.3206 15.3917 29.1989 15.599 29.0029 15.7095L26.1993 17.2924C26.0054 17.4022 25.7668 17.4015 25.5736 17.2904L24.4121 16.6254C24.2175 16.5143 24.0972 16.3076 24.0972 16.0846V12.9011C24.0972 12.6781 24.2168 12.4721 24.4121 12.3603L25.6086 11.6749C25.8032 11.563 26.0432 11.5637 26.2385 11.6749V11.6762ZM26.6731 17.9839L29.41 16.4386C29.6039 16.3288 29.8425 16.3294 30.0357 16.4406L31.2639 17.1437C31.4585 17.2549 31.5788 17.4615 31.5788 17.6845V20.8415C31.5788 21.0645 31.4592 21.2704 31.2639 21.3823L30.0557 22.0745C29.8611 22.1857 29.6211 22.1857 29.4265 22.0745L26.6704 20.4964C26.4758 20.3852 26.3554 20.1786 26.3554 19.9556V18.5275C26.3554 18.3031 26.4771 18.0958 26.6731 17.9853V17.9839Z"
                    fill="url(#paint0_linear_2343_6085)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_2343_6085"
                      x1="27.1208"
                      y1="22.7585"
                      x2="36.8444"
                      y2="6.00905"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#4066B0" />
                      <stop offset="0.75" stop-color="#81D2E8" />
                    </linearGradient>
                  </defs>
                </svg>
              </li>
              <li className="lg:me-3">
                <Link
                  className="text-white hover:text-themecolor lg:text-black lg:hover:text-themecolor hover:bg-white  relative block px-2 py-2 lg:p-0"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li className="lg:me-3">
                <Link
                  className="text-white hover:text-themecolor lg:text-black lg:hover-text-themecolor hover-bg-white relative block px-2 py-2 lg:p-0"
                  href="/"
                >
                  About
                </Link>
              </li>
              <li className="lg:me-3">
                <Link
                  className="text-white hover:text-themecolor lg:text-black lg:hover-text-themecolor hover-bg-white relative block px-2 py-2 lg:p-0"
                  href="https://civitas-community.vercel.app/dashboard"
                >
                  Community
                </Link>
              </li>
              <li className="lg:me-3">
                <Link
                  className="text-white flex items-center hover:text-themecolor lg:text-black lg:hover-text-themecolor hover-bg-white relative block px-2 py-2 lg:p-0"
                  href="https://civitas-community.vercel.app/community-search"
                >
                  <span>Resources</span>
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
                      d="M12.3982 15.6629C12.1785 15.8826 11.8224 15.8826 11.6027 15.6629L5.86788 9.92804C5.64821 9.70837 5.64821 9.35227 5.86788 9.13259L6.13305 8.86739C6.35271 8.64772 6.70887 8.64772 6.92854 8.86739L12.0005 13.9393L17.0724 8.86739C17.2921 8.64772 17.6482 8.64772 17.8679 8.86739L18.1331 9.13259C18.3527 9.35227 18.3527 9.70837 18.1331 9.92804L12.3982 15.6629Z"
                      fill="black"
                    />
                  </svg>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="search-btns-holder flex flex-1 sm:flex-none justify-end relative ms-3 sm:ms-0">
            <form className="search-form flex-1 sm:flex-none">
              <input
                type="search"
                placeholder="Search"
                className="w-full h-8 border-0"
              />
              <span className="icon-search absolute left-[10px] top-1/2 -translate-y-1/2 z-1 w-[24px] h-[24px]">
                <Image width={24} height={24} src={iconSearch} alt="" />
              </span>
            </form>
            <div className="btn-holder flex justify-end items-center">
              {loginText !== null ? (
                <Link
                  className="inline-block btn btn-theme-outlined border border-black hover-border-themecolor text-black hover-text-white bg-white hover-bg-themecolor px-3 sm:px-6 py-2 ms-3 rounded-4"
                  href=""
                  onClick={handleLogout}
                >
                  <span className="hidden sm:block">Logout</span>
                  <span className="block sm:hidden">
                    <FontAwesomeIcon icon={faSignIn} />
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    className="inline-block btn btn-theme border border-themecolor bg-themecolor hover-bg-white text-white hover-text-themecolor px-3 sm:px-6 py-2 ms-3 rounded-4"
                    href="login"
                  >
                    <span className="hidden sm:block">Sign In</span>
                    <span className="block sm:hidden">
                      <FontAwesomeIcon icon={faSignOut} />
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
