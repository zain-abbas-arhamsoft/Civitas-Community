import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchReferralAuthorization } from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import { useRouter } from "next/router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Header from "@/components/user/Header";
import Footer from "@/components/user/Footer";
import Loader from "@/components/Loader";
import Swal from "sweetalert2";
import { isLoggedIn } from "../../helpers/authHelper";
import { registerUserWithReferralCode } from "../../api/users";
library.add(faGoogle);

const SignupView = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const user = isLoggedIn();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    referralCode: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to register user with other user's referral code
  const handleSubmit = async (e) => {
    e.preventDefault();
    var response = await registerUserWithReferralCode(formData);
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
      router.push("/");
    }
  };

  // Function to process referral code and check whether it matches with user's referral code
  const processReferralCode = async (params) => {
    const data = await fetchReferralAuthorization(params);
    if (data) {
      const { statusCode, message } = data;
      if (statusCode === 200) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          referralCode: data?.user?.referralCode,
        }));
        return;
      }
      if (statusCode === 404) {
        Swal.fire("Alert!", message, "error");
        router.push("/");
      }
    }
  };

  useEffect(() => {
    if (user && user.token) {
      router.push("/");
      return;
    }
    if (Object.keys(router.query).length !== 0) {
      processReferralCode(router.query);
    }
  }, [router.query]);
  return (
    <>
      <Header />
      <div className="py-30 custom-container mx-auto">
        <div className="auth-form-holder">
          <h5 className="md:text-48 text-30 font-bold mb-6">Sign Up</h5>

          <span className="sub-heading text-18 font-normal mb-8 text-center">
            Lets start by entering your information.
          </span>
          <form className="sm:w-login-form w-full" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="username" className="mb-2 block text-16">
                Your First and Last Name*
              </label>
              <input
                type="text"
                fullwidth="true"
                margin="normal"
                autoFocus
                required
                id="username"
                value={formData?.username}
                name="username"
                onChange={handleChange}
                className="border border-solid border-black hover:border-blue rounded-4 mt-0"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="email" className="mb-2 block text-16">
                Your Organization/Work Email*
              </label>
              <input
                type="email"
                fullwidth="true"
                margin="normal"
                autoComplete="email"
                required
                id="email"
                value={formData?.email}
                name="email"
                onChange={handleChange}
                className="border border-solid border-black hover:border-blue rounded-4 mt-0"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="mb-2 block text-16">
                Password*
              </label>
              <input
                fullwidth="true"
                required
                margin="normal"
                autoComplete="password"
                id="password"
                name="password"
                type="password"
                value={formData?.password}
                onChange={handleChange}
                className="border border-solid border-black hover:border-blue rounded-4 mt-0"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="referralCode" className="mb-2 block text-16">
                Referral code*
              </label>
              <input
                fullwidth="true"
                margin="normal"
                id="referralCode"
                name="referralCode"
                value={formData?.referralCode}
                type="text"
                defaultValue={formData.referralCode} // Set the value to the referralCode state
                onChange={handleChange}
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
                  Sign Up
                  {loading ? <Loader className="mr-3" /> : null}
                </span>
              </button>
            </div>
          </form>
          <p className="text-black text-center mb-4">
            Already have an account?{" "}
            <Link
              className="text-black sm:inline-block block font-bold"
              href="/login"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default SignupView;
