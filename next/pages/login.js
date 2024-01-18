import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "../api/users";
import ErrorAlert from "../components/error/ErrorAlert";
import { loginUser } from "../helpers/authHelper";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import { isLoggedIn } from "../helpers/authHelper";
import Layout from "@/Layouts/layout1";
// Add Google Font Awesome icon to the library
library.add(faGoogle);

// Define the LoginView component
const LoginView = () => {
  const router = useRouter();
  const user = isLoggedIn();
  const [loading, setLoading] = useState(false);
  // State for form data and server errors
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");

  // Handle changes in form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await login(formData);
    const { statusCode, message } = response;
    if (statusCode === 400) {
      Swal.fire("oops", message, "error");
      setLoading(false);
      return;
    }
    if (response.error) {
      setLoading(false);
      setServerError(response.error);
    } else {
      loginUser(response);
      setLoading(false);
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    // Redirect the user to the login page if they have a token
    if (user && user?.token) {
      router.push("/");
    }
  }, []);
  // Render the component
  return (
    <>
      <Layout>
        <div className="py-30 custom-container mx-auto">
          <div className="auth-form-holder">
            <div className="mb-[32px] text-center">
              <h5 className="md:text-48 text-30 font-bold mb-[24px]">Login</h5>
              <span className="text-[15px] md:text-[18px] font-[400]">
                Lorem ipsum dolor sit amet adipiscing elit.
              </span>
            </div>
            <form onSubmit={handleSubmit} className="sm:w-login-form w-full">
              <div className="mb-5">
                <label htmlFor="email" className="mb-2 block text-16">
                  Email Address*
                </label>
                <input
                  type="email"
                  fullwidth="true"
                  margin="normal"
                  autoComplete="email"
                  autoFocus
                  required
                  id="email"
                  name="email"
                  value={formData?.email}
                  onChange={handleChange}
                  className="mt-0"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-2 text-16 flex justify-between"
                >
                  Password*
                  <Link href={""} className="underline">
                    Forgot your password?
                  </Link>
                </label>
                <input
                  type="password"
                  fullwidth="true"
                  required
                  margin="normal"
                  id="password"
                  name="password"
                  value={formData?.password}
                  onChange={handleChange}
                  className="mt-0"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-2 mb-3 w-full bg-themecolor hover:bg-white text-white hover:text-themecolor border border-themecolor rounded-[3px]"
              >
                <span>
                  {" "}
                  Login
                  {loading ? <Loader className="mr-3" /> : null}
                </span>
              </button>
              <ErrorAlert error={serverError} />
            
            </form>
            <p className="text-black text-center">
              Do not have an account yet?{" "}
              <Link
                className="text-black sm:inline-block block font-[400] underline"
                href="/signup"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default LoginView;
