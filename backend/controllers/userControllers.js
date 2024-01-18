const User = require("../models/User");
const TreatmentRecords = require("../models/TreatmentRecord");
const UserRewards = require("../models/UserReward");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ReferUser = require("../models/ReferUser");
const OrganizationJoinRequest = require("../models/OrganizationJoinRequest");
const Organization = require("../models/Organization");
const ApplyForResources = require("../models/applyforResources");

const mongoose = require("mongoose");
const {
  compressImage,
  uploadImagesToCloudinary,
  sendSuccessResponse,
  sendErrorResponse,
  isEmailValid,
  isUsernameValid,
  getUserDict,
  buildToken,
} = require("../util/functions");
const randomatic = require("randomatic");
const path = require("path");

//Api to get reward with user information
const rewardDeatil = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          status: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userRewardsId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          "userInfo._id": 1,
          "userInfo.username": 1,
          "userInfo.image": 1,
          "userInfo.wallet": 1,
          payoutAmount: 1,
          actionPerformed: 1,
          status: 1,
        },
      },
    ];

    const pipeline1 = [
      {
        $match: {
          status: 1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userRewardsId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          "userInfo._id": 1,
          "userInfo.username": 1,
          "userInfo.image": 1,
          "userInfo.wallet": 1,
          payoutAmount: 1,
          actionPerformed: 1,
          status: 1,
        },
      },
    ];

    const pipeline2 = [
      {
        $match: {
          status: 1,
        },
      },
      {
        $group: {
          _id: null,
          totalMoney: {
            $sum: "$payoutAmount",
          },
        },
      },
    ];

    const rewardDeatilsPending = await UserRewards.aggregate(pipeline);
    const rewardDeatilsRecieved = await UserRewards.aggregate(pipeline1);
    const totalRecievedReward = await UserRewards.aggregate(pipeline2);
    if (!rewardDeatilsPending || !rewardDeatilsRecieved) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Reward Deatils not found",
      });
    }

    return res.send({
      statusCode: 200,
      success: true,
      rewardDeatilsPending: rewardDeatilsPending,
      rewardDeatilsRecieved: rewardDeatilsRecieved,
      totalRecievedReward: totalRecievedReward,
      message: "Reward Details fetched succesfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

//Api to get reward with user information
const rewardUpdate = async (req, res) => {
  try {
    const { rewardId, status } = req.body;
    const rewardStatusUpadte = await UserRewards.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(rewardId) },
      {
        $set: {
          status: status,
          payoutDate: Date.now(),
        },
      }
    );
    if (!rewardStatusUpadte) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Reward Deatils not Upadted",
      });
    }
    return res.send({
      statusCode: 200,
      success: true,
      StatusUpadte: rewardStatusUpadte,
      message: "Reward Details update succesfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

//Api to get reward with user information
const rewardUpdateAll = async (req, res) => {
  try {
    const updatedRecords = await UserRewards.updateMany(
      { status: 0 },
      { $set: { status: 1, payoutDate: Date.now() } }
    );
    if (!updatedRecords) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Reward Deatils not Upadted",
      });
    }

    return res.send({
      statusCode: 200,
      success: true,
      StatusUpadte: updatedRecords,
      message: "All Reward Details update succesfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
//API to handles user registration, including input validation and hashing the password.
const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!(username && email && password)) {
      throw new Error("All input required");
    }
    const isValidUsername = await isUsernameValid(username);
    const isValidEmail = await isEmailValid(email);
    if (!isValidUsername) {
      return res.send({
        statusCode: 400,
        success: false,
        message:
          "first name and last name should not contains with special characters",
      });
    }
    if (!isValidEmail) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Email must be valid",
      });
    }
    if (password !== confirmPassword)
      return res.send({
        statusCode: 400,
        success: false,
        message: "Password and Confirm Password should be match",
      });
    if (password.length < 8)
      return res.send({
        statusCode: 400,
        success: false,
        message: "Password length must be atleast 8 characters",
      });
    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (existingUser) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Email and username must be unique",
      });
    }

    // Generate a 6-digit alphanumeric referral code using randomatic
    const referralCode = await generateUniqueReferralCode();
    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      referralCode,
      totalPayout: null,
    });
    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);
    return res.json(getUserDict(token, user));
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
//API to register a user with a referral code, linking them to the referring user.
const registerUserWithReferralCode = async (req, res) => {
  try {
    const { username, email, password, referralCode } = req.body;
    if (!(username && email && password))
      return res.send({
        statusCode: 400,
        success: false,
        message: "All input required",
      });
    const normalizedEmail = email.toLowerCase();
    const isValidUsername = await isUsernameValid(username);
    const isValidEmail = await isEmailValid(email);
    if (!isValidUsername) {
      return res.send({
        statusCode: 400,
        success: false,
        message:
          "first name and last name should not contains with special characters",
      });
    }
    if (!isValidEmail) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Email must be valid",
      });
    }
    if (password.length < 8)
      return res.send({
        statusCode: 400,
        success: false,
        message: "Password length must be atleast 8 characters",
      });

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });
    if (existingUser)
      return res.send({
        statusCode: 400,
        success: false,
        message: "Email and username must be unique",
      });

    const verifyUserReferralCode = await User.findOne({
      referralCode: referralCode,
    });
    if (verifyUserReferralCode === null) {
      return res.send({
        statusCode: 400,
        success: false,
        message:
          "Your referral Code doesn't match Please go to Profile and copy referral code again",
      });
    }
    // Generate a random integer between 6 and 20
    const randomNumber = (parseInt(randomatic("0", 2), 10) % 15) + 6;
    // Calculate the new totalPayout value (for example, you can add 10 to the existing value)
    const newTotalPayout = verifyUserReferralCode?.totalPayout + randomNumber;
    // Update the totalPayout field for the user
    verifyUserReferralCode.totalPayout = newTotalPayout;
    // Save the updated user document
    await verifyUserReferralCode.save();
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate a 6-digit alphanumeric referral code using randomatic
    const myReferCode = await generateUniqueReferralCode();
    const user = await User.create({
      username,
      referralCode: myReferCode,
      email: normalizedEmail,
      password: hashedPassword,
      totalPayout: null,
    });
    await user.save();
    const userRewards = await UserRewards.create({
      userRewardsId: verifyUserReferralCode?._id,
      actionPerformed: 1,
      payoutAmount: verifyUserReferralCode?.totalPayout,
    });
    await userRewards.save();
    const createReferInfo = await ReferUser.create({
      referTo: user._id,
      referBy: verifyUserReferralCode[0]?._id,
    });
    await createReferInfo.save();
    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);
    return res.json(getUserDict(token, user));
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
//  Generates a unique 6-digit alphanumeric referral code.
const generateUniqueReferralCode = async () => {
  let isReferralCodeUnique = false;
  let referralCode;
  while (!isReferralCodeUnique) {
    referralCode = randomatic("Aa0", 6);
    const existingUser = await User.findOne({ referralCode });

    if (!existingUser) {
      isReferralCodeUnique = true;
    }
  }
  return referralCode;
};
//API to manages user login, validating email and password.
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password))
      return res.send({
        statusCode: 400,
        success: false,
        message: "All input required",
      });

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user)
      return res.send({
        statusCode: 400,
        success: false,
        message: "Email or password incorrect",
      });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.send({
        statusCode: 400,
        success: false,
        message: "Email or password incorrect",
      });

    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    return res.json(getUserDict(token, user));
  } catch (error) {
    return res.send({ statusCode: 500, error: error.message });
  }
};

//API to updates user profile information, including image handling.
const updateUserprofile = async (req, res) => {
  try {
    const { userId } = req.body;
    const getUser = await User.findById(userId);
    if (!getUser)
      return res.send({
        statusCode: 404,
        success: false,
        message: "User Id not match",
      });
    var { phone, email, currentPassword, newPassword, selectedOption } =
      req.body;
    if (email) {
      const isValidEmail = await isEmailValid(email);
      if (!isValidEmail) {
        return res.send({
          statusCode: 400,
          success: false,
          message: "Email must be valid",
        });
      }
    }
    const user = await User.findOne({ email: email });
    if (user)
      return res.send({
        statusCode: 400,
        success: false,
        message: "Email Already exists",
      });
    if (selectedOption !== undefined)
      var selectedOptionArray = JSON.parse(selectedOption);
    if (currentPassword) {
      var isPasswordValid = await bcrypt.compare(
        currentPassword,
        getUser.password
      );
      if (!isPasswordValid)
        return res.send({
          statusCode: 400,
          success: false,
          message: "Current Password is incorrect",
        });
    }
    if (req.files?.image) {
      logo = req.files.image[0]?.path;
      await compressImage(req.files, logo);
      var uploadResponse = await uploadImagesToCloudinary(logo);
      const parts = uploadResponse?.secure_url?.split("/");
      var extractedPath = "/" + parts.slice(6).join("/");
    }
    const saltOrRounds = 10;
    if (newPassword.trim() === "" && isPasswordValid === true)
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please enter your New Password",
      });
    if (newPassword.trim() !== "" && isPasswordValid === true) {
      var hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);
    }
    const obj = {
      phone,
      email,
      ...(hashedPassword && { password: hashedPassword }),
      image: extractedPath,
      contactPrefernce: selectedOptionArray,
    };
    const nonEmptyFields = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]) {
        nonEmptyFields[key] = obj[key];
      }
    }
    const userData = await User.findOneAndUpdate(
      { _id: userId },
      nonEmptyFields,
      {
        new: true,
      }
    ).select("-password");
    return res.send({
      userData,
      statusCode: 200,
      success: true,
      message: "Your profile has been updated successfully.",
    });
  } catch (error) {
    return res.send({ statusCode: 500, error: error.message });
  }
};
//API to retrieves a user's profile image.
const getUserData = async (req, res) => {
  const { userId } = req.body;
  try {
    const userData = await User.findById({ _id: userId }).select("-password");
    if (!userData)
      return res.send({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    else
      return res.send({
        success: true,
        statusCode: 200,
        image: userData.image,
        userData,
      });
  } catch (error) {
    res.send({ success: false, statusCode: 500, message: error.message });
  }
};

//API to retrieves a admin user's count.
const getAdminUserCount = async (req, res) => {
  try {
    const organization = await Organization.findOne({
      name: { $regex: /Celeix Digital/, $options: "i" },
    });
    const userData = await User.countDocuments({ isAdmin: true });
    const usersWithAdminRole = await User.find({ isAdmin: true });
    const pipeline = [
      {
        $match: {
          organizationId: mongoose.Types.ObjectId(organization._id),
          status: 1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.isAdmin": false,
        },
      },
      {
        $project: {
          "user._id": 1,
          "user.username": 1,
          "user.image": 1,
        },
      },
    ];
    const data = await OrganizationJoinRequest.aggregate(pipeline);
    if (userData && data && usersWithAdminRole) {
      return res.send({
        success: true,
        statusCode: 200,
        message: "Admin user Calculated Successfully",
        adminUserCount: userData,
        data: data,
        usersWithAdminRole: usersWithAdminRole,
      });
    } else {
      return res.send({
        success: false,
        statusCode: 404,
        message: "admin User not found",
      });
    }
  } catch (error) {
    res.send({ success: false, statusCode: 500, message: error.message });
  }
};

// API to make user to Admin
const updateUserToAdmin = async (req, res) => {
  try {
    const { memberId } = req.body;
    const updateUserdata = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(memberId) },
      { isAdmin: true }
    );
    return res.send({
      statusCode: 200,
      data: updateUserdata,
      success: true,
      message: "user Updated successfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

//API to checks if a user has completed their profile.
const completeProfile = async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }
    if (user?.wallet)
      return res.send({
        statusCode: 200,
        success: true,
        message: "User Wallet Exsist",
      });
    return res.send({
      statusCode: 404,
      success: false,
      message: "User Wallet not Exsist",
    });
  } catch (error) {
    res.send({ statusCode: 500, success: false, error: error.message });
  }
};

//API to retrieves user information and their posts.
const getUser = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      throw new Error("User does not exist");
    }

    const posts = await Post.find({ poster: user._id })
      .populate("poster")
      .sort("-createdAt");

    let likeCount = 0;

    posts.forEach((post) => {
      likeCount += post.likeCount;
    });

    const data = {
      user,
      posts: {
        count: posts.length,
        likeCount,
        data: posts,
      },
    };

    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
//API to fetches a specified number of random users.
const getRandomUsers = async (req, res) => {
  try {
    let { size } = req.query;
    const users = await User.find().select("-password");
    const randomUsers = [];

    if (size > users.length) {
      size = users.length;
    }

    const randomIndices = getRandomIndices(size, users.length);

    for (let i = 0; i < randomIndices.length; i++) {
      const randomUser = users[randomIndices[i]];
      randomUsers.push(randomUser);
    }

    return res.status(200).json(randomUsers);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
//API to generates an array of unique random indices within a specified range.
const getRandomIndices = (size, sourceSize) => {
  const randomIndices = [];
  while (randomIndices.length < size) {
    const randomNumber = Math.floor(Math.random() * sourceSize);
    if (!randomIndices.includes(randomNumber)) {
      randomIndices.push(randomNumber);
    }
  }
  return randomIndices;
};
//API to updates a user's wallet address.
const updateWalletAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "User not found",
      });
    }
    let { address } = req.body;
    let wallet = address;
    const nonEmptyFields = {};
    // ... code to filter non-empty fields
    const updateData =
      wallet !== undefined
        ? { ...nonEmptyFields, wallet }
        : { ...nonEmptyFields, wallet: "" };
    const userData = await User.findOneAndUpdate({ _id: userId }, updateData, {
      new: true,
    }).select("-password");
    return res.send({
      userData,
      statusCode: 200,
      success: true,
      message: "User Wallet Address updated successfully",
    });
  } catch (error) {
    return res.send({ statusCode: 500, success: false, error: error.message });
  }
};
//API to validates a user's referral code.
const authorizeReferralCode = async (req, res) => {
  try {
    const referralCode = req.body.id;
    const user = await User.findOne({ referralCode: referralCode });
    // Check if the user has a referralCode
    if (user)
      return res.send({
        user,
        statusCode: 200,
        success: true,
        message: "Referral Code match'",
      });
    else
      return res.send({
        statusCode: 404,
        success: false,
        message: "Referral Code not match'",
      });
  } catch (error) {
    return res.send({ statusCode: 500, success: false, error: error.message });
  }
};
//API to upload documents.
const uploadDocuments = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.files) {
      res.send({
        statusCode: 400,
        success: false,
        message: "No files uploaded.",
      });
    }
    const file = req.files.file[0];
    const name = file?.originalname;
    const fileExtension = file?.mimetype;
    const filePath = file?.path;

    if (fileExtension.startsWith("image/")) {
      await imageUpload(req, filePath, name, userId, res);
    } else {
      const fileName = path.basename(filePath);
      await documentUpload(filePath, name, userId, res);
    }
  } catch (err) {
    res.send({
      statusCode: 500,
      success: false,
      message: err.message,
    });
  }
};

//API to handling image upload
const imageUpload = async (req, filePath, name, userId, res) => {
  try {
    await compressImage(req.files, filePath);
    const uploadResponse = await uploadImagesToCloudinary(filePath);
    const parts = uploadResponse?.secure_url?.split("/");
    const extractedPath = "/" + parts.slice(6).join("/");

    const obj = { file: extractedPath, name, userId };
    const userDocuments = await TreatmentRecords.create(obj);
    await userDocuments.save();

    return sendSuccessResponse(
      res,
      userDocuments,
      "Image has been created successfully."
    );
  } catch (error) {
    res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

//API to handling document upload
const documentUpload = async (fileName, name, userId, res) => {
  try {
    const uploadResponse = await uploadImagesToCloudinary(fileName);
    const parts = uploadResponse?.secure_url?.split("/");
    const extractedPath = "/" + parts.slice(6).join("/");
    const obj = { file: extractedPath, name, userId };
    const userDocuments = await TreatmentRecords.create(obj);
    await userDocuments.save();
    return sendSuccessResponse(
      res,
      userDocuments,
      "Document has been created successfully."
    );
  } catch (error) {
    return res.send({ success: false, statusCode: 500, error: error.message });
  }
};

//API to fetch all the documents
const fetchDocuments = async (req, res) => {
  const userId = req.body.userId;
  try {
    // Fetch all documents from the TreatmentRecords table/collection
    const allDocuments = await TreatmentRecords.find({
      userId: mongoose.Types.ObjectId(userId),
    });
    if (allDocuments.length > 0) {
      // Map allDocuments to format the updatedAt field
      const formattedDocuments = allDocuments.map((doc) => {
        // Convert updatedAt to MM/DD/YY format
        const updatedAtDate = new Date(doc.updatedAt);
        const formattedDate = `${
          updatedAtDate.getMonth() + 1
        }/${updatedAtDate.getDate()}/${updatedAtDate
          .getFullYear()
          .toString()
          .slice(2)}`;

        return { ...doc._doc, updatedAt: formattedDate }; // Replace updatedAt with the formatted date
      });
      return sendSuccessResponse(
        res,
        formattedDocuments,
        "Documents have been fetched successfully."
      );
    } else {
      return sendErrorResponse(res, [], "Zero Documents found.");
    }
  } catch (error) {
    // Handle any potential errors here
    return res.send({
      statusCode: 500,
      success: false,
      error: error.message,
    });
  }
};
//API to fetch specific document detail
const fetchDocumentDetail = async (req, res) => {
  try {
    const { id } = req.body;
    const fetchDocument = await TreatmentRecords.find({ _id: id });
    if (fetchDocument.length > 0) {
      const formattedDocuments = fetchDocument.map((doc) => {
        const { name, ...rest } = doc._doc;
        // Remove the file extension (in this case, ".pdf")
        const nameWithoutExtension = name.replace(/\.[^.]+$/, "");

        // Convert updatedAt to MM/DD/YY format
        const updatedAtDate = new Date(doc.updatedAt);
        const formattedDate = `${
          updatedAtDate.getMonth() + 1
        }/${updatedAtDate.getDate()}/${updatedAtDate
          .getFullYear()
          .toString()
          .slice(2)}`;

        return {
          ...rest,
          name: nameWithoutExtension,
          updatedAt: formattedDate,
        };
      });
      // It's important to note that fetchDocument is already an array of objects,
      // so if you want to return this formatted data in the response, use formattedDocuments
      return res.send({
        success: true,
        statusCode: 200,
        modifiedDocument: formattedDocuments,
      });
    } else {
      return res.send({
        success: false,
        statusCode: 404,
        message: "Document not found",
      });
    }
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      error: error.message,
    });
  }
};

//API to fetch specific document detail
const reviewApplicationStatus = async (req, res) => {
  try {
    const { applicationId, userId, status } = req.body;
    ApplyForResources.findByIdAndUpdate(
      { _id: applicationId }, // Define the condition to find the specific document
      { $set: { status: status } }, // Define the update operation using $set to update the 'status' field
      (err, result) => {
        if (err) {
          // Handle the error, return an error response, or perform necessary actions
          return res.send({
            success: false,
            statusCode: 500,
            message: "Failed to update status",
          });
        }
        // Handle success, send a success response, or perform necessary actions
        return res.send({
          success: true,
          statusCode: 200,
          message: "Application Status updated successfully",
        });
      }
    );
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  register,
  rewardDeatil,
  rewardUpdate,
  rewardUpdateAll,
  login,
  getUser,
  getRandomUsers,
  updateUserprofile,
  updateUserToAdmin,
  getUserData,
  getAdminUserCount,
  updateWalletAddress,
  completeProfile,
  authorizeReferralCode,
  registerUserWithReferralCode,
  uploadDocuments,
  fetchDocuments,
  fetchDocumentDetail,
  reviewApplicationStatus,
};
