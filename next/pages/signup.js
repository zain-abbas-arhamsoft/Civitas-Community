import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signup } from "../api/users";
import { loginUser } from "../helpers/authHelper";
import { useRouter } from "next/navigation";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import { isLoggedIn } from "../helpers/authHelper";
import Layout from "@/Layouts/layout1";
import Image from "next/image";
import SampleImg from "../assets/images/sample-img.png";
import { getUserData } from "../api/users";
library.add(faGoogle);
// Define the SignupView component
const SignupView = () => {
  const router = useRouter();
  const [signupSuccess, setSignupSuccess] = useState(false);
  // State for form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const user = isLoggedIn();
  // Handle changes in form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await signup(formData);
    if (response?.error) {
      Swal.fire("oops", response?.error, "error");
      setLoading(false);
      return;
    }
    if (Object.keys(response).length != 0) {
      if (response?.statusCode === 400) {
        Swal.fire("oops", response?.message, "error");
        setLoading(false);
        return;
      }
      loginUser(response);
      setSignupSuccess(true);
      Swal.fire("Good Job!", "User has been registered", "success");
    }
  };

  const getUserAccountInfo = async () => {
    const getAccountInfo = await getUserData(user);
    if (getAccountInfo) {
      const { userData } = getAccountInfo;
      setFormData({
        ...formData,
        email: userData?.email,
        name: userData?.username,
      });
    }
  };
  useEffect(() => {
    // Redirect the user to the login page if they have a token
    if (user && user?.token) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (signupSuccess === true) {
      getUserAccountInfo();
    }
  }, [signupSuccess]);

  const redirectToDashboard = (e) => {
    e.preventDefault();
    router.push("/dashboard");
  };
  // Render the component
  return (
    <>
      <Layout>
        {!signupSuccess ? (
          <div className="py-30 custom-container mx-auto">
            <div className="auth-form-holder">
              <h5 className="md:text-48 text-30 font-bold mb-6">
                Sign up for SolacePRO
              </h5>

              <form className="sm:w-login-form w-full" onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="username" className="mb-2 block text-16">
                    Name*
                  </label>
                  <input
                    type="text"
                    fullWidth="true"
                    margin="normal"
                    autoFocus
                    required
                    id="username"
                    name="username"
                    onChange={handleChange}
                    value={formData?.username}
                    className="border border-solid border-black hover:border-blue rounded-4 mt-0"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="mb-2 block text-16">
                    Email*
                  </label>
                  <input
                    type="email"
                    fullWidth="true"
                    margin="normal"
                    autoComplete="email"
                    required
                    id="email"
                    name="email"
                    onChange={handleChange}
                    value={formData?.email}
                    className="border border-solid border-black hover:border-blue rounded-4 mt-0"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="mb-2 block text-16">
                    Password*
                  </label>
                  <input
                    fullWidth="true"
                    required
                    margin="normal"
                    autoComplete="password"
                    id="password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    value={formData?.password}
                    className="border border-solid border-black hover:border-blue rounded-4 mt-0"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="mb-2 block text-16">
                    Re-Enter Password*
                  </label>
                  <input
                    fullWidth="true"
                    required
                    margin="normal"
                    autoComplete="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    onChange={handleChange}
                    value={formData?.confirmPassword}
                    className="border border-solid border-black hover:border-blue rounded-4 mt-0"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="py-3 px-2 mb-3 w-full bg-themecolor hover:bg-white text-white hover:text-themecolor border border-themecolor rounded-[3px]"
                  >
                    <span className="ms-2">
                      {" "}
                      Next
                      {loading ? <Loader className="mr-3" /> : null}
                    </span>
                  </button>
                </div>
              </form>

              <p className="text-black text-center mb-4">
                Already have an account?{" "}
                <Link
                  className="text-black sm:inline-block block font-[400] underline"
                  href="/login"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="py-30 custom-container mx-auto">
              <div className="auth-form-holder">
                <h5 className="md:text-48 text-30 font-[700] mb-6">
                  Account Created!
                </h5>
                <div className="sm:w-login-form w-full">
                  <strong className="text-[15px] md:text-[18px] font-[700] mb-[10px] md:mb-[18px] block">
                    Your Information
                  </strong>
                  <div className="flex gap-[36px] md:gap-[48px] mb-[36px] flex-wrap sm:flex-nowrap">
                    <div className="w-[100px] h-[100px] object-fill overflow-hidden rounded-[100%]">
                      <Image
                        className="w-[100%] h-[100%] object-fill overflow-hidden rounded-[100%]"
                        src={SampleImg}
                        alt="avatar"
                      />
                    </div>
                    <div>
                      <strong className="text-[13px] md:text-[16px] font-[700] block mb-[10px]">
                        {formData?.name}
                      </strong>
                      <span className="text-[13px] md:text-[16px] font-[400] block mb-[10px]">
                        Community Role
                      </span>
                      <span className="text-[13px] md:text-[16px] font-[700] block mailto:mb-[10px]">
                        {formData?.email}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={redirectToDashboard}
                    className="border mb-[30px] border-[#000] w-full px-[24px] py-[12px] hover:bg-themecolor hover:text-[#fff] hover:border-themecolor"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};
export default SignupView;
