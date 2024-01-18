"useClient";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import SavedIcon from "../../assets/images/Saved.svg";
import NotificationIcon from "../../assets/images/Notifications.svg";

// Component representing a header with navigation and icons
const Header2 = () => {
  const [isActive, setActive] = useState(false);
  // Toggles the mobile view navigation visibility
  const toggleClass = () => {
    setActive(!isActive);
  };
  return (
    <header id="header" className="h-16 border-b border-black mb-6">
      <div className="custom-container mx-auto h-full relative">
        <div className="h-full flex justify-between items-center">
          <div>
            <a href="" className="me-4 back-icon-holder inline-block">
              <FontAwesomeIcon icon={faChevronLeft} />
            </a>
            <a>Back</a>
          </div>
          <nav id="nav">
            <span className="icon-navbar lg:hidden" onClick={toggleClass}>
              <FontAwesomeIcon icon={faBars} />
            </span>
            <ul
              className={`flex flex-col lg:flex-row lg:w-auto absolute lg:relative bg-themecolor lg:bg-transparent z-10 ${
                isActive && "active"
              }`}
            >
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
                  className="text-white hover:text-themecolor lg:text-black lg:hover:text-themecolor hover:bg-white  relative block px-2 py-2 lg:p-0"
                  href="/"
                >
                  Organizations
                </Link>
              </li>
              <li className="lg:me-3">
                <Link
                  className="text-white hover:text-themecolor lg:text-black lg:hover:text-themecolor hover:bg-white  relative block px-2 py-2 lg:p-0"
                  href="https://civitas-community.vercel.app/dashboard"
                >
                  Community
                </Link>
              </li>
              <li className="lg:me-3">
                <Link
                  className="text-white hover:text-themecolor lg:text-black lg:hover:text-themecolor hover:bg-white  relative block px-2 py-2 lg:p-0"
                  href="/"
                >
                  Learn
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex">
            <a href="" className="me-3">
              <Image src={SavedIcon} />
            </a>
            <a>
              <Image src={NotificationIcon} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header2;
