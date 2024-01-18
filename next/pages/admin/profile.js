import React from "react";
import AdminProfilePage from "./../../components/admin/admin-profile";
import { createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { createPublicClient, http } from "viem";
const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: polygonMumbai,
    transport: http(),
  }),
});
function AdminProfile() {
  return (
    <WagmiConfig config={config}>
      <AdminProfilePage />
    </WagmiConfig>
  );
}

export default AdminProfile;
