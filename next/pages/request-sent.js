import Layout from "@/Layouts/layout1";
import React from "react";
import { useRouter } from "next/router";
export default function RequestSentToOrganization() {
  const router = useRouter();
  const goToDashboard = () => {
    router.push("/dashboard");
  };
  return (
    <>
      <Layout>
        <div className="py-30 custom-container mx-auto">
          <div className="auth-form-holder">
            <h5 className="sm:text-48 text-20 font-[700] sm:w-[400px] w-full text-center mb-[32px]">
              Request sent to Organization
            </h5>
            <button
              onClick={goToDashboard}
              className="sm:w-[400px] w-full py-3 px-2 mb-3 bg-transparent hover:bg-themecolor hover:border-themecolor text-black hover:text-white border border-black rounded-[3px] justify-center items-center"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}
