import Link from "next/link";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import theme from "../theme";
import CommunitySearch from "./community-search";
export default function Home() {
  const router = useRouter();
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {router.pathname === "/" && <CommunitySearch />}
        <CssBaseline />
        <Link href="/" passHref></Link>
      </ThemeProvider>
    </>
  );
}
