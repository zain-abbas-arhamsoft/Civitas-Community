const { cloudinary } = require("./cloudinary");
const tinify = require("tinify");
const fs = require("fs"); // Import the fs module
const path = require("path");

// Set your Tinify API key here
tinify.key = `${process.env.TINY_PNG_API_KEY}`;
const outputPath = path.join(__dirname, "../next/compressed_images");

// Create the output folder if it doesn't exist
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

async function compressImage(files, logo) {
  const inputImageBuffer = fs.readFileSync(logo);
  const source = await tinify.fromBuffer(inputImageBuffer);
  // Compress the image using TinyPNG and store the result in 'compressedImageBuffer'
  const compressedImageBuffer = await source.toBuffer();
  let uniqueFileName = "";
  if (files.file) {
    uniqueFileName = files.file[0]?.originalname;
  } else if (files.image) {
    uniqueFileName = files.image[0]?.originalname;
  }
  // uniqueFileName = `${files.image[0]?.originalname}`;
  // Specify the output file path with the unique file name
  const outputFilePath = `${outputPath}/${uniqueFileName}`;
  // Write the compressed image buffer to the specified output file path
  fs.writeFileSync(outputFilePath, compressedImageBuffer);
}

async function uploadImagesToCloudinary(logo) {
  try {
    // Handle the uploaded image response as needed
    var uploadResponse = await cloudinary.uploader.upload(logo, {
      folder: "sellDigital", // Specify the folder name
      upload_preset: "sell_digital_images",
    });
  } catch (error) {
    // Handle the error
  }
  return uploadResponse;
}

// Sending Success response
const sendSuccessResponse = (res, userDocuments, message) => {
  return res.send({
    userDocuments,
    statusCode: 200,
    success: true,
    message,
  });
};
// Sending Error response
const sendErrorResponse = (res, userDocuments, message) => {
  return res.send({
    userDocuments,
    statusCode: 400,
    success: false,
    message,
  });
};

// Check whether email is valid or not
const isEmailValid = (email) => {
  const emailRegex =
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,10}){1,2}$/;
  if (email.match(emailRegex)) {
    return true;
  } else {
    return false;
  }
};

// Check whether username is valid or not
const isUsernameValid = (username) => {
  const regexExp = /^[A-Za-z0-9][A-Za-z0-9_ ]*$/;
  if (username.match(regexExp)) {
    return true;
  } else {
    return false;
  }
};

// Constructs a user dictionary based on user information.
const getUserDict = (token, user) => {
  return {
    token,
    username: user.username,
    userId: user._id,
    isAdmin: user.isAdmin,
  };
};
//  Creates a token based on user data.
const buildToken = (user) => {
  return {
    userId: user._id,
    isAdmin: user.isAdmin,
  };
};

// convert hours of operation into date time and days
function convertHoursOfOperation(startDate, endDate) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // Convert received strings to Date objects
  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);
  // Check if the parsing was successful
  if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
    return "Invalid date format"; // Handle invalid date formats
  }
  const startDay = parsedStartDate.getDay();
  const endDay = parsedEndDate.getDay();

  const startDayName = daysOfWeek[startDay];
  const endDayName = daysOfWeek[endDay];

  const startTime = parsedStartDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const endTime = parsedEndDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const startDateFormatted = parsedStartDate.toLocaleDateString("en-US");
  const endDateFormatted = parsedEndDate.toLocaleDateString("en-US");

  if (startDateFormatted === endDateFormatted) {
    // If the start and end dates are the same day
    return `${startDayName} (${startDateFormatted}), ${startTime} to ${endTime}`;
  } else {
    // If the start and end dates span different days
    return `${startDayName} (${startDateFormatted}) - ${endDayName} (${endDateFormatted})`;
  }
}
// Export both functions so they can be used in other modules
module.exports = {
  compressImage,
  uploadImagesToCloudinary,
  sendSuccessResponse,
  sendErrorResponse,
  isEmailValid,
  isUsernameValid,
  getUserDict,
  buildToken,
  convertHoursOfOperation,
};
