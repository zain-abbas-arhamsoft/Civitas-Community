import React from "react";
import Image from "next/image";
import Link from "next/link";
import siteLogo from "../../assets/images/logo.svg";
import logoTagline from "../../assets/images/logo-tagline.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

// Renders a footer section for the website with various sections and links.
const Footer = () => {
  return (
    <footer id="footer">
      <div className="top-footer pb-20 pt-20">
        <div className="custom-container mx-auto">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-1/5 px-2 flex justify-center hidden 2xl:block">
              <strong className="inline-block align-top mb-6 lg:mb-0">
                <Link href="/" className="inline-block align-top">
                  <div className="flex justify-center">
                    <Image width="60" height="67" src={siteLogo} />
                  </div>
                  <div className="flex justify-center">
                    <Image width="115" height="16" src={logoTagline} />
                  </div>
                </Link>
              </strong>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 2xl:w-1/5 px-2">
              <div className="footer-col mb-6 lg:mb-0">
                <h3 className="mb-6 text-black">Account</h3>
                <ul className="footer-nav">
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      My Organization Profile
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      My Personal Profile
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      My Documents
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 2xl:w-1/5 px-2">
              <div className="footer-col mb-6 lg:mb-0">
                <h3 className="mb-6 text-black">Dashboard</h3>
                <ul className="footer-nav">
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      Appointments
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      Cases
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      Intake
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      Resources
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 2xl:w-1/5 px-2">
              <div className="footer-col mb-6 lg:mb-0">
                <h3 className="mb-6 text-black">Grants</h3>
                <ul className="footer-nav">
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      Find Grants
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      Manage Grants
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      Reports
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      Funds
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 2xl:w-1/5 px-2">
              <div className="footer-col mb-6 lg:mb-0">
                <h3 className="mb-6 text-black">Community</h3>
                <ul className="footer-nav">
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      Community
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      Continuing Education
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      Awareness Programs
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      Contributions
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link className="text-black hover:text-themecolor" href="#">
                      Resource List
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom border-t border-t border-black py-8">
        <div className="custom-container mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-3/4 flex justify-center lg:justify-start items-center flex-col lg:flex-row">
              <span className="me-0 lg:me-6 mb-4 lg:mb-0">
                2022 Civitasbloc. All right reserved.
              </span>
              <ul className="footer-bottom-links flex mb-4 lg:mb-0">
                <li className="mb-2 me-1 lg:me-0 ms-1 lg:ms-3">
                  <Link
                    className="inline-block border-b border-black hover:border-themecolor text-black hover:text-themecolor"
                    href="/"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-2 me-1 lg:me-0 ms-1 lg:ms-3">
                  <Link
                    className="inline-block border-b border-black hover:border-themecolor text-black hover:text-themecolor"
                    href="/"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li className="mb-2 me-1 lg:me-0 ms-1 lg:ms-3">
                  <Link
                    className="inline-block border-b border-black hover:border-themecolor text-black hover:text-themecolor"
                    href="/"
                  >
                    Cookies Settings
                  </Link>
                </li>
              </ul>
            </div>
            <ul className="w-full lg:w-1/4 social-links flex justify-center lg:justify-end">
              <li className="mb-2 me-1 lg:me-0 ms-1 lg:ms-3">
                <a
                  href="#"
                  target="_blank"
                  className="text-black hover:text-themecolor"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
              </li>
              <li className="mb-2 me-1 lg:me-0 ms-1 lg:ms-3">
                <a
                  href="#"
                  target="_blank"
                  className="text-black hover:text-themecolor"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              </li>
              <li className="mb-2 me-1 lg:me-0 ms-1 lg:ms-3">
                <a
                  href="#"
                  target="_blank"
                  className="text-black hover:text-themecolor"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </li>
              <li className="mb-2 me-1 lg:me-0 ms-1 lg:ms-3">
                <a
                  href="#"
                  target="_blank"
                  className="text-black hover:text-themecolor"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
