let BASE_URL = "https://postit.arhamsoft.org/";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  BASE_URL = " https://postit.arhamsoft.org/";
}
// https://postit.arhamsoft.org/
// http://localhost:4000/
export { BASE_URL };
