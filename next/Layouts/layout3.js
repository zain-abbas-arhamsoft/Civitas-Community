import React from "react";
import SidebarDashboard from "@/components/user/DashboardSidebar";
import HeaderDashboard from "@/components/user/DashboardHeader";
/**
 * Layout component designed for a dashboard view, containing a sidebar, header, footer, and main content area.
 * @param {React.ReactNode} children - The content to be displayed within the main area.
 * @param {string} image - The image to be displayed in the header.
 * @returns {JSX.Element} - Rendered dashboard layout.
 */
const Layout = ({ children, image }) => {
  return (
    <div className="wrapper flex h-[100vh]">
      <SidebarDashboard />
      <div className="main-content grow bg-grey2 overflow-auto">
        <HeaderDashboard image={image} />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
