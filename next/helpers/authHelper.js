// Checks if there's a logged-in user, returns user data or false
const isLoggedIn = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("user"));
  }
  return false;
};
// Saves user data to localStorage
const loginUser = (user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

// Removes user data from localStorage
const logoutUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};

export { loginUser, isLoggedIn, logoutUser };
