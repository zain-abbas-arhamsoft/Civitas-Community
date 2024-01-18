import React from "react";
import Header from "@/components/user/Header";
import SidebarDashboard from "@/components/user/DashboardSidebar";
import HeaderDashboard from "@/components/user/DashboardHeader";
/**
 * Layout component to structure the app layout with a header and main content area.
 * @param {React.ReactNode} children - The content to be displayed within the layout.
 * @returns {JSX.Element} - Rendered component with the header and main content.
 */
const Layout = ({ children, user, image }) => {
  return (
    <>
      {user?.token ? (
        <div className="wrapper flex h-[100vh]">
          <SidebarDashboard />
          <div className="main-content grow bg-grey2 h-full overflow-y-auto w-full">
            <HeaderDashboard image={image} />
            <main>{children}</main>
          </div>
        </div>
      ) : (
        <>
          <Header />
          <main>{children}</main>
        </>
      )}
    </>
  );
};

export default Layout;
