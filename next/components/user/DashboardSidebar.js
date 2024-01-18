import React, { useState, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import "flowbite";
import DashboadLogo from "../../assets/images/logo-dashboard.png";
import iconHome from "../../assets/images/icon-home.png";
import iconStar from "../../assets/images/icon-star.png";
import iconFile from "../../assets/images/icon-file.png";
import iconUser from "../../assets/images/icon-user.png";
import iconTrends from "../../assets/images/icon-trending.png";
import iconAnalytics from "../../assets/images/icon-analytics.png";
import iconHistorical from "../../assets/images/icon-historical.png";
import iconSupport from "../../assets/images/icon-support.png";
import iconSettings from "../../assets/images/icon-settings.png";
import { isLoggedIn } from "../../helpers/authHelper";
import { Menu, Transition } from "@headlessui/react";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// SidebarDashboard component providing sidebar navigation in the dashboard
const SidebarDashboard = () => {
  const [show, setShow] = useState(false);
  const user = isLoggedIn();
  return (
    <>
      <Link href="">
        <FontAwesomeIcon
          onClick={() => setShow(!show)}
          className="absolute lg:hidden top-[21px] left-[12px] z-20"
          icon={faBars}
        />
      </Link>
      <aside
        className={`sidebar-dashboard hover:w-[280px] w-[280px] lg:w-[76px] py-[24px] px-[16px] z-30 hover:pt-6 hover:pb-[80px] hover:px-4 border-e border-[#4066b033] h-100 fixed lg:fixed  ${
          show
            ? "sidebar-dashboard show ml-[-280px] lg:ml-[auto] bg-[#fff] h-[100vh] transition duration-700 ease-in-out"
            : "sidebar-dashboard hide left-0 bg-[#fff] h-[100vh] transition duration-700 ease-in-out"
        }`}
      >
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <div className="flex justify-between">
            <div className="logo-holder mb-6 p-2 flex justify-between w-full">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="37"
                  viewBox="0 0 33 37"
                  fill="none"
                >
                  <path
                    d="M20.8867 16.4395L24.9522 14.1472C25.2376 13.9866 25.5896 13.9866 25.875 14.1472L28.2401 15.481C28.5255 15.6416 28.8775 15.6416 29.1629 15.481L32.1674 13.7867C32.4528 13.6261 32.6293 13.3276 32.6293 13.0055V9.61677C32.6293 9.29464 32.4538 8.99714 32.1674 8.83558L29.1629 7.14122C28.8775 6.98065 28.5255 6.98065 28.2401 7.14122L25.8287 8.50065C25.5432 8.66122 25.1912 8.66122 24.9058 8.50065L20.8857 6.23395C20.6003 6.07338 20.4238 5.77489 20.4238 5.45277V2.76149C20.4238 2.43936 20.2483 2.14187 19.9619 1.98031L16.9594 0.286932C16.674 0.126361 16.322 0.126361 16.0366 0.286932L13.0321 1.98129C12.7467 2.14187 12.5702 2.44035 12.5702 2.76248V5.45572C12.5702 5.77785 12.3947 6.07535 12.1083 6.2369L8.08819 8.50361C7.80277 8.66418 7.45078 8.66418 7.16536 8.50361L4.75391 7.14418C4.46849 6.98361 4.1165 6.98361 3.83108 7.14418L0.828617 8.83657C0.543196 8.99714 0.366699 9.29562 0.366699 9.61775V13.0065C0.366699 13.3286 0.542188 13.6261 0.828617 13.7877L3.21687 15.1343C3.50229 15.2949 3.67879 15.5933 3.67879 15.9155V20.5139C3.67879 20.836 3.5033 21.1335 3.21687 21.2951L0.828617 22.6417C0.543196 22.8023 0.366699 23.1007 0.366699 23.4229V26.8116C0.366699 27.1337 0.542188 27.4312 0.828617 27.5928L3.8331 29.2871C4.11852 29.4477 4.47051 29.4477 4.75593 29.2871L7.15628 27.9336C7.44171 27.773 7.79369 27.773 8.07911 27.9336L12.1103 30.2072C12.3957 30.3678 12.5722 30.6663 12.5722 30.9884V33.6816C12.5722 34.0038 12.7477 34.3013 13.0341 34.4628L16.0386 36.1572C16.324 36.3178 16.676 36.3178 16.9614 36.1572L19.9659 34.4628C20.2513 34.3023 20.4278 34.0038 20.4278 33.6816V30.9884C20.4278 30.6663 20.6033 30.3688 20.8898 30.2072L24.921 27.9336C25.2064 27.773 25.5584 27.773 25.8438 27.9336L28.2441 29.2871C28.5296 29.4477 28.8815 29.4477 29.167 29.2871L32.1714 27.5928C32.4569 27.4322 32.6334 27.1337 32.6334 26.8116V23.4229C32.6334 23.1007 32.4579 22.8032 32.1714 22.6417L29.167 20.9473C28.8815 20.7868 28.5296 20.7868 28.2441 20.9473L25.868 22.2871C25.5826 22.4476 25.2306 22.4476 24.9452 22.2871L20.8908 20.0006C20.6054 19.8401 20.4289 19.5416 20.4289 19.2195V17.2207C20.4289 16.8986 20.6043 16.6011 20.8908 16.4395H20.8867ZM24.3138 26.8815L20.2715 29.161C19.9861 29.3216 19.6341 29.3216 19.3487 29.161L17.5767 28.1612C17.2912 28.0006 17.1147 27.7021 17.1147 27.38V22.82C17.1147 22.4979 17.2902 22.2004 17.5767 22.0388L19.3487 21.0389C19.6341 20.8784 19.9861 20.8784 20.2715 21.0389L24.3138 23.3184C24.5992 23.479 24.7757 23.7775 24.7757 24.0996V26.0984C24.7757 26.4205 24.6002 26.718 24.3138 26.8796V26.8815ZM24.3138 13.1168L20.2705 15.3963C19.9851 15.5569 19.6331 15.5569 19.3477 15.3963L17.5757 14.3974C17.2902 14.2369 17.1137 13.9384 17.1137 13.6162V9.05625C17.1137 8.73412 17.2892 8.43662 17.5757 8.27507L19.3477 7.27618C19.6331 7.11561 19.9851 7.11561 20.2705 7.27618L24.3138 9.55569C24.5992 9.71626 24.7757 10.0147 24.7757 10.3369V12.3356C24.7757 12.6578 24.6002 12.9553 24.3138 13.1168ZM15.8823 9.05723V13.6172C15.8823 13.9394 15.7068 14.2369 15.4204 14.3984L13.6514 15.3963C13.366 15.5579 13.014 15.5569 12.7275 15.3963L8.68223 13.1119C8.39681 12.9503 8.22132 12.6528 8.22132 12.3317V10.3398C8.22132 10.0177 8.39681 9.7202 8.68324 9.55864L12.7265 7.27913C13.0119 7.11856 13.3639 7.11856 13.6494 7.27913L15.4214 8.27802C15.7068 8.43859 15.8833 8.73707 15.8833 9.0592L15.8823 9.05723ZM8.04986 14.1433L12.1093 16.4356C12.3947 16.5971 12.5702 16.8946 12.5702 17.2158V19.186C12.5702 19.5101 12.3917 19.8095 12.1042 19.9691L7.99238 22.2555C7.70796 22.4141 7.358 22.4131 7.07459 22.2526L5.37114 21.2921C5.08572 21.1315 4.90923 20.8331 4.90923 20.5109V15.9125C4.90923 15.5904 5.08471 15.2929 5.37114 15.1313L7.12603 14.1413C7.41145 13.9797 7.76343 13.9807 8.04986 14.1413V14.1433ZM8.68727 23.2544L12.7013 21.0222C12.9857 20.8636 13.3357 20.8646 13.6191 21.0251L15.4204 22.0408C15.7058 22.2014 15.8823 22.4998 15.8823 22.822V27.382C15.8823 27.7041 15.7068 28.0016 15.4204 28.1631L13.6483 29.163C13.3629 29.3236 13.0109 29.3236 12.7255 29.163L8.68324 26.8835C8.39781 26.7229 8.22132 26.4245 8.22132 26.1023V24.0395C8.22132 23.7154 8.39983 23.416 8.68727 23.2564V23.2544Z"
                    fill="url(#paint0_linear_2401_6467)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_2401_6467"
                      x1="9.34384"
                      y1="30.1511"
                      x2="23.282"
                      y2="5.77255"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#4066B0" />
                      <stop offset="0.75" stop-color="#81D2E8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="lg:block hidden">
                <svg
                  onClick={() => setShow(!show)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                >
                  <g opacity="0.5">
                    <path
                      d="M19.7013 6.32017C19.8965 6.12491 19.8965 5.80833 19.7013 5.61306L18.8866 4.79838C18.6913 4.60312 18.3747 4.60312 18.1795 4.79838L12.8534 10.1245C12.6581 10.3197 12.3415 10.3197 12.1463 10.1245L6.82017 4.79838C6.62491 4.60312 6.30833 4.60312 6.11306 4.79838L5.29838 5.61306C5.10312 5.80833 5.10312 6.12491 5.29838 6.32017L10.6245 11.6463C10.8197 11.8415 10.8197 12.1581 10.6245 12.3534L5.29838 17.6795C5.10312 17.8747 5.10312 18.1913 5.29838 18.3866L6.11306 19.2013C6.30833 19.3965 6.62491 19.3965 6.82017 19.2013L12.1463 13.8752C12.3415 13.6799 12.6581 13.6799 12.8534 13.8752L18.1795 19.2013C18.3747 19.3965 18.6913 19.3965 18.8866 19.2013L19.7013 18.3866C19.8965 18.1913 19.8965 17.8747 19.7013 17.6795L14.3752 12.3534C14.1799 12.1581 14.1799 11.8415 14.3752 11.6463L19.7013 6.32017Z"
                      fill="#406AB3"
                      fill-opacity="0.51"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <Link href="">
           
              <svg
                className="lg:hidden relative"
                onClick={() => setShow(!show)}
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <g opacity="0.5">
                  <path
                    d="M19.7013 6.32017C19.8965 6.12491 19.8965 5.80833 19.7013 5.61306L18.8866 4.79838C18.6913 4.60312 18.3747 4.60312 18.1795 4.79838L12.8534 10.1245C12.6581 10.3197 12.3415 10.3197 12.1463 10.1245L6.82017 4.79838C6.62491 4.60312 6.30833 4.60312 6.11306 4.79838L5.29838 5.61306C5.10312 5.80833 5.10312 6.12491 5.29838 6.32017L10.6245 11.6463C10.8197 11.8415 10.8197 12.1581 10.6245 12.3534L5.29838 17.6795C5.10312 17.8747 5.10312 18.1913 5.29838 18.3866L6.11306 19.2013C6.30833 19.3965 6.62491 19.3965 6.82017 19.2013L12.1463 13.8752C12.3415 13.6799 12.6581 13.6799 12.8534 13.8752L18.1795 19.2013C18.3747 19.3965 18.6913 19.3965 18.8866 19.2013L19.7013 18.3866C19.8965 18.1913 19.8965 17.8747 19.7013 17.6795L14.3752 12.3534C14.1799 12.1581 14.1799 11.8415 14.3752 11.6463L19.7013 6.32017Z"
                    fill="#406AB3"
                    fill-opacity="0.51"
                  />
                </g>
              </svg>
            </Link>
          </div>
          <ul className="sidebar-nav">
            <li>
              <Link
                href="/"
                className="flex items-center p-2 hover:bg-[#D9E1F0] hover:rounded-[4px] hover:p-[8px]"
              >
                <span className="nav-icon mr-3">
             
                  <svg
                    className={
                      show
                        ? "show max-w-max h-[auto]"
                        : "hide max-w-max h-[auto]"
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <path
                      d="M16.5 11C18.16 11 19.49 9.66 19.49 8C19.49 6.34 18.16 5 16.5 5C14.84 5 13.5 6.34 13.5 8C13.5 9.66 14.84 11 16.5 11ZM8.5 11C10.16 11 11.49 9.66 11.49 8C11.49 6.34 10.16 5 8.5 5C6.84 5 5.5 6.34 5.5 8C5.5 9.66 6.84 11 8.5 11ZM8.5 13C6.17 13 1.5 14.17 1.5 16.5V18C1.5 18.55 1.95 19 2.5 19H14.5C15.05 19 15.5 18.55 15.5 18V16.5C15.5 14.17 10.83 13 8.5 13ZM16.5 13C16.21 13 15.88 13.02 15.53 13.05C15.55 13.06 15.56 13.08 15.57 13.09C16.71 13.92 17.5 15.03 17.5 16.5V18C17.5 18.35 17.43 18.69 17.32 19H22.5C23.05 19 23.5 18.55 23.5 18V16.5C23.5 14.17 18.83 13 16.5 13Z"
                      fill="#43515C"
                    />
                  </svg>
                </span>
                <span className="nav-text font-[400] text-[16px] leading-[20px] mr-3">
                  Community
                </span>
              </Link>
            </li>
         
            <li>
              <Link
                href="https://civitas-community.vercel.app/document"
                className="flex items-center p-2 hover:bg-[#D9E1F0] hover:rounded-[4px] hover:p-[8px]"
              >
                <span className="nav-icon mr-3">
                  <Image
                    className="max-w-max h-[auto]"
                    src={iconFile}
                    width="30"
                    height="24"
                    alt=""
                  />
                </span>
                <span className="nav-text font-[400] text-[16px] leading-[20px] mr-3">
                  Documents
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="flex items-center p-2 hover:bg-[#D9E1F0] hover:rounded-[4px] hover:p-[8px]"
              >
                <span className="nav-icon mr-3">
                  <svg
                    className="max-w-max h-[auto]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <path
                      d="M3.55556 12.5556H9.88889C10.4694 12.5556 10.9444 12.0806 10.9444 11.5V3.05556C10.9444 2.475 10.4694 2 9.88889 2H3.55556C2.975 2 2.5 2.475 2.5 3.05556V11.5C2.5 12.0806 2.975 12.5556 3.55556 12.5556ZM3.55556 21H9.88889C10.4694 21 10.9444 20.525 10.9444 19.9444V15.7222C10.9444 15.1417 10.4694 14.6667 9.88889 14.6667H3.55556C2.975 14.6667 2.5 15.1417 2.5 15.7222V19.9444C2.5 20.525 2.975 21 3.55556 21ZM14.1111 21H20.4444C21.025 21 21.5 20.525 21.5 19.9444V11.5C21.5 10.9194 21.025 10.4444 20.4444 10.4444H14.1111C13.5306 10.4444 13.0556 10.9194 13.0556 11.5V19.9444C13.0556 20.525 13.5306 21 14.1111 21ZM13.0556 3.05556V7.27778C13.0556 7.85833 13.5306 8.33333 14.1111 8.33333H20.4444C21.025 8.33333 21.5 7.85833 21.5 7.27778V3.05556C21.5 2.475 21.025 2 20.4444 2H14.1111C13.5306 2 13.0556 2.475 13.0556 3.05556Z"
                      fill="#43515C"
                    />
                  </svg>
                </span>
                <span className="nav-text font-[400] text-[16px] leading-[20px] mr-3">
                  Dashboard
                </span>
              </Link>
            </li>
            {user && user?.isAdmin && (
              <li>
                <Link
                  href="/admin/profile"
                  className="flex items-center p-2 hover:bg-[#D9E1F0] hover:rounded-[4px] hover:p-[8px]"
                >
                  <span className="nav-icon mr-3">
                    <svg
                      className={
                        show
                          ? "show max-w-max h-[auto]"
                          : "hide max-w-max h-[auto]"
                      }
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                    >
                      <path
                        d="M16.5 11C18.16 11 19.49 9.66 19.49 8C19.49 6.34 18.16 5 16.5 5C14.84 5 13.5 6.34 13.5 8C13.5 9.66 14.84 11 16.5 11ZM8.5 11C10.16 11 11.49 9.66 11.49 8C11.49 6.34 10.16 5 8.5 5C6.84 5 5.5 6.34 5.5 8C5.5 9.66 6.84 11 8.5 11ZM8.5 13C6.17 13 1.5 14.17 1.5 16.5V18C1.5 18.55 1.95 19 2.5 19H14.5C15.05 19 15.5 18.55 15.5 18V16.5C15.5 14.17 10.83 13 8.5 13ZM16.5 13C16.21 13 15.88 13.02 15.53 13.05C15.55 13.06 15.56 13.08 15.57 13.09C16.71 13.92 17.5 15.03 17.5 16.5V18C17.5 18.35 17.43 18.69 17.32 19H22.5C23.05 19 23.5 18.55 23.5 18V16.5C23.5 14.17 18.83 13 16.5 13Z"
                        fill="#43515C"
                      />
                    </svg>
                  </span>
                  <span className="nav-text font-[400] text-[16px] leading-[20px] mr-3">
                    Admin Dashboard
                  </span>
                </Link>
              </li>
            )}
           
          </ul>
        </div>

        <ul className="user-links absolute left-0 right-0 bottom-0 px-[16px] py-[24px]">
          <li>
            <Link
              href="#"
              className="overflow-hidden flex items-center p-2 hover:bg-[#D9E1F0] hover:rounded-[4px] hover:p-[8px]"
            >
              <span className="nav-icon mr-3">
                <Image
                  className="max-w-max h-[auto]"
                  src={iconSupport}
                  width="30"
                  height="24"
                  alt=""
                />
              </span>
              <span className="nav-text font-[400] text-[16px] leading-[20px] mr-3">
                Support
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="overflow-hidden flex items-center p-2 hover:bg-[#D9E1F0] hover:rounded-[4px] hover:p-[8px]"
            >
              <span className="nav-icon mr-3">
                <Image
                  className="max-w-max h-[auto]"
                  src={iconSettings}
                  width="30"
                  height="24"
                  alt=""
                />
              </span>
              <span className="nav-text font-[400] text-[16px] leading-[20px] mr-3">
                Settings
              </span>
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default SidebarDashboard;
