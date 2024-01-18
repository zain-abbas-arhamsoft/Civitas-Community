import { useState, useEffect } from "react";
import { isLoggedIn } from "../helpers/authHelper";
import { isCompleteProfile } from "@/api/users";

// Create a custom hook for managing the completeProfileWith state
const UseCompleteProfile = () => {
  const [completeProfileWith, setCompleteProfileWith] = useState(false);
  const user = isLoggedIn();
  const completeProfile = async () => {
    const getData = await isCompleteProfile(user);
    setCompleteProfileWith(getData?.statusCode);
  };
  useEffect(() => {
    completeProfile();
  }, []);
  return completeProfileWith;
};

export default UseCompleteProfile;
