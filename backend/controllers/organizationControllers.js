const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const Organization = require("../models/Organization");
const OrganizationType = require("../models/OrganizationType");
const OrganizationQueries = require("../models/OrganizationQueries");
const TrackUsers = require("../models/TrackUser");
const OrganizationJoinRequest = require("../models/OrganizationJoinRequest");
const ApplyForResources = require("../models/applyforResources");
const validatePhoneNumber = require("validate-phone-number-node-js");
const randomatic = require("randomatic");
const path = require("path");
const fs = require("fs");
const csv = require("fast-csv");
const User = require("../models/User");
const moment = require("moment");

const {
  compressImage,
  uploadImagesToCloudinary,
  convertHoursOfOperation,
} = require("../util/functions");
const VerifyOrganization = require("../models/VerifyOrganization");
const { sendEmail } = require("./../util/emails");
// API to get all organizations
const list = async (req, res) => {
  try {
    let { all, currentPage, limit } = req.query;
    const filter = {};
    let name = req.query.name;
    if (name) {
      name = name.trim();
      filter.name = {
        $regex: name.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
        $options: "i",
      };
    }

    currentPage =
      currentPage !== undefined && currentPage !== ""
        ? parseInt(currentPage)
        : 1;

    if (!all) limit = limit !== undefined && limit !== "" ? parseInt(limit) : 5;
    const total = await Organization.countDocuments({ filter });
    if (currentPage > Math.ceil(total / limit) && total > 0)
      currentPage = Math.ceil(total / limit);
    let pipeline = [{ $match: filter }, { $sort: { createdAt: -1 } }];
    if (!all) {
      pipeline.push({ $skip: limit * (currentPage - 1) });
      pipeline.push({ $limit: limit });
    }
    await Organization.aggregate(pipeline);

    // Fetch type information for each organization using $lookup
    const organizationsWithTypes = await Organization.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      ...(!all
        ? [{ $skip: limit * (currentPage - 1) }, { $limit: limit }]
        : []),
      {
        $lookup: {
          from: "organizationtypes", // Assuming the collection name is 'organizationtypes'
          localField: "type", // Field in the current collection (Organization) to match
          foreignField: "_id", // Field in the foreign collection (OrganizationType) to match
          as: "typeInfo", // Alias for the joined data
        },
      },
    ]);

    return res.send({
      success: true,
      statusCode: 200,
      message: "Organization fetched successfully",
      data: {
        organizations: organizationsWithTypes,
        pagination: {
          currentPage,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

const organizationDeatil = async (req, res) => {
  try {
    const { orgId } = req.query;
    const filter = { _id: ObjectId(orgId) };
    const organization = await Organization.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "organizationtypes", // Assuming the collection name is 'organizationtypes'
          localField: "type", // Field in the current collection (Organization) to match
          foreignField: "_id", // Field in the foreign collection (OrganizationType) to match
          as: "typeInfo", // Alias for the joined data
        },
      },
    ]);
    //const organization = await Organization.findById(orgId); // Fetch the organization by _id
    if (!organization) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Organization not found",
      });
    }

    return res.send({
      statusCode: 200,
      success: true,
      data: organization,
      message: "Organization Details fetched succesfully",
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
const rewardDeatilInOrganization = async (req, res) => {
  try {
    const { organizationId } = req.body;
    const pipeline = [
      {
        $match: {
          organizationId: mongoose.Types.ObjectId(organizationId),
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
        $unwind: { path: "$user", preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: "userrewards",
          localField: "user._id",
          foreignField: "userRewardsId",
          as: "UserRewards",
        },
      },
      { $unwind: { path: "$UserRewards", preserveNullAndEmptyArrays: false } },
      {
        $match: {
          "UserRewards.status": 0,
        },
      },
      {
        $project: {
          "user._id": 1,
          "user.username": 1,
          "user.image": 1,
          "UserRewards.status": 1,
          "UserRewards.payoutAmount": 1,
          "UserRewards.actionPerformed": 1,
          "UserRewards._id": 1,
        },
      },
    ];

    const rewardDeatilsPending = await OrganizationJoinRequest.aggregate(
      pipeline
    );

    if (!rewardDeatilsPending) {
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

const rewardSumInOrganization = async (req, res) => {
  try {
    const { organizationId } = req.body;
    const pipeline = [
      {
        $match: {
          organizationId: mongoose.Types.ObjectId(organizationId),
          status: 1,
        },
      },
      {
        $lookup: {
          from: "userrewards",
          localField: "userId",
          foreignField: "userRewardsId",
          as: "UserRewards",
        },
      },
      { $unwind: { path: "$UserRewards", preserveNullAndEmptyArrays: false } },
      {
        $match: {
          "UserRewards.status": 1,
        },
      },
      {
        $group: {
          _id: null,
          totalMoneyGiven: {
            $sum: "$UserRewards.payoutAmount",
          },
        },
      },
    ];
    const pipeline1 = [
      {
        $match: {
          organizationId: mongoose.Types.ObjectId(organizationId),
          status: 1,
        },
      },
      {
        $lookup: {
          from: "userrewards",
          localField: "userId",
          foreignField: "userRewardsId",
          as: "UserRewards",
        },
      },
      { $unwind: { path: "$UserRewards", preserveNullAndEmptyArrays: false } },
      {
        $match: {
          "UserRewards.status": 0,
        },
      },
      {
        $group: {
          _id: null,
          totalMoneyPending: {
            $sum: "$UserRewards.payoutAmount",
          },
        },
      },
    ];

    const rewardDeatilsapproved = await OrganizationJoinRequest.aggregate(
      pipeline
    );

    const rewardDeatilsPending = await OrganizationJoinRequest.aggregate(
      pipeline1
    );
    if (!rewardDeatilsPending || !rewardDeatilsapproved) {
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
      rewardDeatilsapproved: rewardDeatilsapproved,
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

// API to get all organizations
const GetUserOrgnization = async (req, res) => {
  try {
    const { userId } = req.body;
    const userOrganization = await Organization.findOne({
      ownerId: ObjectId(userId),
    });
    if (userOrganization) {
      return res.send({
        statusCode: 200,
        userOrganization: userOrganization._id,
        success: true,
        message: "User Organization get successfully",
      });
    }

    const userOrganization1 = await OrganizationJoinRequest.findOne({
      userId: ObjectId(userId),
      status: 1,
    });

    if (userOrganization1) {
      return res.send({
        statusCode: 200,
        userOrganization: userOrganization1.organizationId,
        success: true,
        message: "User Organization get successfully",
      });
    } else {
      return res.send({
        statusCode: 200,
        success: false,
        message: "User dont have any Organization",
      });
    }
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
// API to get organization detail on the basis of type
const filterType = async (req, res) => {
  try {
    let { type, all, currentPage, limit } = req.query;
    // Create an empty query object
    let query = {};
    // Check if 'type' is provided and not empty
    if (type && type !== "") {
      query = { type: mongoose.Types.ObjectId(type) };
    }
    currentPage =
      currentPage !== undefined && currentPage !== ""
        ? parseInt(currentPage)
        : 1;
    if (!all) limit = limit !== undefined && limit !== "" ? parseInt(limit) : 5;
    const total = await Organization.countDocuments(query);
    if (currentPage > Math.ceil(total / limit) && total > 0)
      currentPage = Math.ceil(total / limit);
    let pipeline = [{ $match: query }, { $sort: { createdAt: -1 } }];
    if (!all) {
      pipeline.push({ $skip: limit * (currentPage - 1) });
      pipeline.push({ $limit: limit });
    }

    await Organization.aggregate(pipeline);

    // Fetch type information for each organization using $lookup
    const organizationsWithTypes = await Organization.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      ...(!all
        ? [{ $skip: limit * (currentPage - 1) }, { $limit: limit }]
        : []),
      {
        $lookup: {
          from: "organizationtypes", // Assuming the collection name is 'organizationtypes'
          localField: "type", // Field in the current collection (Organization) to match
          foreignField: "_id", // Field in the foreign collection (OrganizationType) to match
          as: "typeInfo", // Alias for the joined data
        },
      },
    ]);
    return res.send({
      statusCode: 200,
      data: {
        getFilterTypeDocuments: organizationsWithTypes,
        pagination: {
          currentPage,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
      },
      success: true,
      message: "Organizations filtered by type fetched successfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
// API to get all organizations types
const typeList = async (req, res) => {
  try {
    let { all, page, limit } = req.query;
    const filter = {};
    let name = req.query.name;
    if (name) {
      name = name.trim();
      filter.name = {
        $regex: name.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
        $options: "i",
      };
    }

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    if (!all)
      limit = limit !== undefined && limit !== "" ? parseInt(limit) : 20;

    const total = await OrganizationType.countDocuments({ filter });
    if (page > Math.ceil(total / limit) && total > 0)
      page = Math.ceil(total / limit);

    let pipeline = [{ $match: filter }, { $sort: { createdAt: -1 } }];

    if (!all) {
      pipeline.push({ $skip: limit * (page - 1) });
      pipeline.push({ $limit: limit });
    }

    const organizationType = await OrganizationType.aggregate(pipeline);
    return res.send({
      success: true,
      statusCode: 200,
      message: "Organization Type fetched successfully",
      data: {
        organizationType,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
// API to get all admin organization types
const adminTypeList = async (req, res) => {
  try {
    let { all, page, limit } = req.query;
    const filter = {};
    let name = req.query.name;
    if (name) {
      name = name.trim();
      filter.name = {
        $regex: name.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
        $options: "i",
      };
    }

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    if (!all)
      limit = limit !== undefined && limit !== "" ? parseInt(limit) : 20;

    const total = await OrganizationType.countDocuments({ filter });
    if (page > Math.ceil(total / limit) && total > 0)
      page = Math.ceil(total / limit);

    let pipeline = [{ $match: filter }, { $sort: { createdAt: -1 } }];

    if (!all) {
      pipeline.push({ $skip: limit * (page - 1) });
      pipeline.push({ $limit: limit });
    }

    const organizationType = await OrganizationType.aggregate(pipeline);
    return res.send({
      success: true,
      statusCode: 200,
      message: "Organization Type fetched successfully",
      data: {
        organizationType,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
// API to get particular organization detail on the basis of zip code
const filterZipCode = async (req, res) => {
  try {
    let { zipCode, all, currentPage, limit } = req.query;
    let query = {};
    // Check if zipCode is provided and not empty
    if (zipCode && zipCode !== "") {
      query = { zipCode };
    }
    currentPage =
      currentPage !== undefined && currentPage !== ""
        ? parseInt(currentPage)
        : 1;
    if (!all) limit = limit !== undefined && limit !== "" ? parseInt(limit) : 5;
    const total = await Organization.countDocuments(query);
    if (currentPage > Math.ceil(total / limit) && total > 0)
      currentPage = Math.ceil(total / limit);
    let pipeline = [{ $match: query }, { $sort: { createdAt: -1 } }];
    if (!all) {
      pipeline.push({ $skip: limit * (currentPage - 1) });
      pipeline.push({ $limit: limit });
    }
    await Organization.aggregate(pipeline);

    // Fetch type information for each organization using $lookup
    const organizationsWithTypes = await Organization.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      ...(!all
        ? [{ $skip: limit * (currentPage - 1) }, { $limit: limit }]
        : []),
      {
        $lookup: {
          from: "organizationtypes", // Assuming the collection name is 'organizationtypes'
          localField: "type", // Field in the current collection (Organization) to match
          foreignField: "_id", // Field in the foreign collection (OrganizationType) to match
          as: "typeInfo", // Alias for the joined data
        },
      },
    ]);

    // Find documents matching the query
    return res.send({
      data: {
        getFilterDocuments: organizationsWithTypes,
        pagination: {
          currentPage,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
      },
      statusCode: 200,
      success: true,
      message: "Organizations filtered by zipCode fetched successfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
// API to get Organization detail on the basis of name
const filterOrganizationName = async (req, res) => {
  try {
    let { name, all, currentPage, limit, hours, type, zipCode } = req.query;
    let Type = [];
    let hoursOfOperation = [];
    let pipeline = []; // Initialize pipeline here

    if (type) {
      Type = type.split(",");
    }
    if (hours) {
      hoursOfOperation = hours.split(",");
    }
    let filter = {};
    if (name && name !== "") {
      filter.name = { $regex: name, $options: "i" };
    }
    if (zipCode && zipCode !== "") {
      filter.zipCode = { $regex: zipCode, $options: "i" };
    }
    if (Type && Array.isArray(Type) && Type.length > 0) {
      filter.type = { $in: Type.map((t) => mongoose.Types.ObjectId(t)) };
    }
    if (
      hoursOfOperation &&
      Array.isArray(hoursOfOperation) &&
      hoursOfOperation.length > 0
    ) {
      const daysMapping = {
        "Weekdays 8am- 5pm": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        "Weekdays After 5pm": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        "Weekends After 5pm": ["Saturday", "Sunday"],
        "Weekends 8am- 5pm": ["Saturday", "Sunday"],
        "24/7": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        // Add more mappings for other options if needed
      };
      const updatedOptions = [];
      hoursOfOperation.forEach((option) => {
        if (daysMapping.hasOwnProperty(option)) {
          updatedOptions.push(...daysMapping[option]);
        } else {
          updatedOptions.push(option);
        }
      });
      filter.hoursOfOperation = {
        $regex: updatedOptions.join("|"), // Creating a regex pattern to match any day in the array
      };
    }
    currentPage =
      currentPage !== undefined && currentPage !== ""
        ? parseInt(currentPage)
        : 1;

    if (!all) limit = limit !== undefined && limit !== "" ? parseInt(limit) : 5;
    const total = await Organization.countDocuments(filter);
    if (currentPage > Math.ceil(total / limit) && total > 0)
      currentPage = Math.ceil(total / limit);
    pipeline = [{ $match: filter }, { $sort: { createdAt: -1 } }];
    if (!all) {
      pipeline.push({ $skip: limit * (currentPage - 1) });
      pipeline.push({ $limit: limit });
    }
    await Organization.aggregate(pipeline);

    // Fetch type information for each organization using $lookup
    const organizationsWithTypes = await Organization.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      ...(!all
        ? [{ $skip: limit * (currentPage - 1) }, { $limit: limit }]
        : []),
      {
        $lookup: {
          from: "organizationtypes", // Assuming the collection name is 'organizationtypes'
          localField: "type", // Field in the current collection (Organization) to match
          foreignField: "_id", // Field in the foreign collection (OrganizationType) to match
          as: "typeInfo", // Alias for the joined data
        },
      },
    ]);
    return res.send({
      data: {
        matchingDocuments: organizationsWithTypes,
        pagination: {
          currentPage,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
      },
      statusCode: 200,
      success: true,
      message: "Organizations filtered by name fetched successfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
// API to get particular Organization detail
const viewOrganizationDetails = async (req, res) => {
  try {
    let { id } = req.query;
    const fetchOrganizationDetails = await Organization.findOne({
      _id: id,
    }).populate("type");

    if (!fetchOrganizationDetails)
      return res.send({
        statusCode: 400,
        success: false,
        message: "Organization Id doesn't match",
      });
    const rulingYear = fetchOrganizationDetails.rulingYear;
    const rulingYearDate = new Date(rulingYear);
    const year = rulingYearDate.getFullYear();
    // Appending the 'year' property to the 'getOrganizationDetails' object
    fetchOrganizationDetails.rulingYear = year;
    // Creating a new object with the original properties and adding the year
    const updatedOrganizationDetails = {
      ...fetchOrganizationDetails,
      year: year,
    };
    return res.send({
      statusCode: 200,
      updatedOrganizationDetails,
      success: true,
      message: "Organization Id fetched successfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

// API to submit user contact details who wants to get service from organization
const submitContactDetails = async (req, res) => {
  try {
    const { userId } = req.body;
    const services = req.body.data;
    const message = req.body.message;
    const organizationId = req.body._id;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const selectedContactMethod = req.body.selectedContactMethod;
    if (firstName === "" || lastName === "")
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please provide both first name and last name.",
      });

    if (selectedContactMethod === undefined)
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please provide a valid contact method.",
      });

    if (services.length === 0)
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please provide at least one valid service.",
      });

    const contactInformation = [
      {
        selectedContactMethod:
          selectedContactMethod === undefined ? "" : selectedContactMethod,
      },
    ];
    let organizationServiceFields = [];
    for (let i = 0; i < Object.keys(services).length; i++) {
      const service = services[Object.keys(services)[i]];
      organizationServiceFields.push({
        serviceId: service.id,
        serviceTitle: service.value,
      });
    }
    const obj = {
      firstName,
      lastName,
      contactInformation,
      organizationServiceFields,
      message,
      organizationId,
      userId,
    };
    const userData = {
      organizationId,
      userId,
    };
    const submitContact = await OrganizationQueries.create(obj);
    const contactDetails = await submitContact.save();
    const submitUserData = await TrackUsers.create(userData);
    const submitUserDetails = await submitUserData.save();
    return res.send({
      statusCode: 200,
      contactDetails,
      submitUserDetails,
      success: true,
      message: "Submit Contact Details successfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
};

// API to accept and reject user contact details who wants to get service from organization
const updateContactDetails = async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    const Updateprganization = await ApplyForResources.findOneAndUpdate(
      { _id: ObjectId(applicationId) },
      { status: status }
    );
    return res.send({
      statusCode: 200,
      Updateprganization,
      success: true,
      message: "Resource Updated successfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

// API to get create Organization
const createOrganization = async (req, res) => {
  try {
    const {
      phone,
      rulingYear,
      ein,
      address,
      organizationWebsite,
      email,
      missionStatement,
      city,
      state,
      zipcode,
      lat,
      lon,
      userId,
      headOfFinancials,
      headOfOrganization,
    } = req.body;
    let { hoursOfOperation } = req.body;
    hoursOfOperation = JSON.parse(hoursOfOperation);
    const { startDate, endDate } = hoursOfOperation;
    const formattedHours = convertHoursOfOperation(startDate, endDate);
    if (phone) var result = validatePhoneNumber.validate(phone);
    if (result === false)
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please enter valid phone number",
      });
    const name = req.body.organizationName;
    if (!name) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Organization name is required",
      });
    }

    const exsistingOrganizationName = await Organization.findOne({
      name: name,
    });
    if (exsistingOrganizationName) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Organization name must be unique",
      });
    }
    const type = req.body.selectedOptions;
    let logo;
    let file;
    let annualReports;
    if (type.length === 0)
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please select atleast one Organization Type",
      });

    if (req.files?.image === undefined) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please upload organization Logo",
      });
    }
    if (req.files?.form990 === undefined) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please upload form990",
      });
    }
    if (req.files?.annualReports === undefined) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please upload annual reports",
      });
    }
    if (req.files?.image) {
      logo = req.files.image[0]?.path;
      await compressImage(req.files, logo);
      const uploadLogoResponse = await uploadImagesToCloudinary(logo);
      // // Split the URL using '/' as the delimiter and slice the array to get the desired part.
      const parts = uploadLogoResponse?.secure_url?.split("/");
      var extractedLogoPath = "/" + parts.slice(6).join("/");
    }
    if (req.files?.form990) {
      file = req.files.form990[0]?.path;
      const uploadFileResponse = await uploadImagesToCloudinary(file);
      // // Split the URL using '/' as the delimiter and slice the array to get the desired part.
      const parts = uploadFileResponse?.secure_url?.split("/");
      var extractedFilePath = "/" + parts.slice(6).join("/");
    }
    if (req.files?.annualReports) {
      annualReports = req.files.annualReports[0]?.path;
      const uploadAnnualReportResponse = await uploadImagesToCloudinary(
        annualReports
      );
      // // Split the URL using '/' as the delimiter and slice the array to get the desired part.
      const parts = uploadAnnualReportResponse?.secure_url?.split("/");
      var extractedAnnualReportPath = "/" + parts.slice(6).join("/");
    }

    const referralCode = randomatic("0", 3) + "-" + randomatic("0", 3);
    const obj = {
      name,
      phone,
      email,
      rulingYear,
      EIN: ein,
      street1: address,
      websiteAboutOrganization: organizationWebsite,
      missionStatement,
      city,
      state,
      zipCode: zipcode,
      type,
      logo: extractedLogoPath,
      file: extractedFilePath,
      annualReports: extractedAnnualReportPath,
      lat,
      lon,
      ownerId: userId,
      referralCode,
      hoursOfOperation: formattedHours,
      headOfFinancials,
      headOfOrganization,
    };
    const submitOrganizationDetails = await Organization.create(obj);
    const organizationDetails = await submitOrganizationDetails.save();
    return res.send({
      statusCode: 200,
      organizationDetails,
      success: true,
      message: "Organization created successfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
// API to get similar Organization on the basis of type
const getSimilarOrganizationId = async (req, res) => {
  try {
    const { _id, type } = req.query;
    const organization = await Organization.findById(_id); // Fetch the organization by _id
    if (!organization) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Organization not found",
      });
    }
    // Extracting IDs from an array of objects
    const extractedIds = organization?.type.map((obj) => obj._id); // Assuming _id is the field containing the ID
    // Logic to fetch type names based on extracted IDs goes here
    // Example: Fetch type names from a database using the IDs
    const similarOrganizations = await Organization.find({
      _id: { $ne: _id },
      type: { $in: extractedIds },
    });
    if (!similarOrganizations || similarOrganizations.length === 0) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Similar Organizations not found",
      });
    }

    // Extract the IDs of organization types from the similar organizations
    const typeIds = similarOrganizations.reduce((acc, org) => {
      acc.push(...org.type.map((t) => t._id));
      return acc;
    }, []);

    // Fetch organization types based on the extracted type IDs
    const organizationTypes = await OrganizationType.find({
      _id: { $in: typeIds },
    });

    // Map the organization types to their respective similar organizations
    const populatedSimilarOrganizations = similarOrganizations.map((org) => {
      const orgTypes = org.type.map((t) => {
        const type = organizationTypes.find((ot) => ot._id.equals(t._id));
        return type ? { _id: type._id, name: type.name } : null;
      });
      return { ...org._doc, type: orgTypes };
    });
    // Assuming extractedIds contains the IDs you want to use to fetch organizationTypes
    return res.send({
      statusCode: 200,
      similarOrganizations: populatedSimilarOrganizations,
      success: true,
      message: "Get Similar Organization Details fetched successfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
// API to get create Organization
const createOrganizationType = async (req, res) => {
  try {
    const { name } = req.body;
    const obj = {
      name,
    };
    const submitOrganizationTypeDetails = await OrganizationType.create(obj);
    const organizationTypeDetails = await submitOrganizationTypeDetails.save();
    return res.send({
      statusCode: 200,
      organizationTypeDetails,
      success: true,
      message: "Organization Type created successfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
// API to read data from csv File
const readCsvFile = async (req, res) => {
  try {
    const data = [];
    const absolutePath =
      path.resolve() + "/csv/Community_Resource_List_Sheet1.csv";
    fs.createReadStream(absolutePath)
      .pipe(csv.parse({ headers: true }))
      .on("error", (err) => {
        // Handle the error here
        return res.send({
          success: false,
          statusCode: 500,
          message: err,
        });
      })
      .on("data", async (row) => {
        const rowData = {
          name: row?.OrganizationName,
          street1: row?.Address,
          phone: row?.Phone,
          serviceProvided: row?.Services,
        };
        data.push(rowData);
        await Organization.create(rowData);
      })
      .on("end", () => {
        return res.send({
          statusCode: 200,
          message: "Read data from csv file",
          length: data?.length,
          data: data,
        });
      });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      error: error.message,
    });
  }
};
// Connect user with organization
const connectUserWithOrganization = async (req, res) => {
  try {
    let { organizationId, userId, referralCode } = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.send({
        success: false,
        statusCode: 400,
        message: "User is invalid",
      });
    }
    const organization = await Organization.findOne({
      $or: [{ _id: organizationId }, { referralCode: referralCode }],
    });

    if (!organization) {
      return res.send({
        success: false,
        statusCode: 400,
        message: "Organization is invalid",
      });
    }

    const matchUserWithOrganization = await Organization.findOne({
      $and: [
        {
          _id:
            organizationId !== undefined ? organizationId : organization?._id,
        },
        { ownerId: userId },
      ],
    });
   
    if (matchUserWithOrganization)
      return res.send({
        success: false,
        statusCode: 400,
        message:
          "You are not allowed to join this organization because you are the ownner of this organization",
      });
    if (!organizationId && !referralCode) {
      // If both organizationId and referralCode are not provided, return an error
      return res.send({
        success: false,
        statusCode: 400,
        message: "Please provide either organization or enter Referral Code",
      });
    }

    if (referralCode && referralCode !== organization.referralCode) {
      return res.send({
        success: false,
        statusCode: 400,
        message: "Referral code is invalid",
      });
    }
    const checkOrganizationRequest = await OrganizationJoinRequest.findOne({
      $and: [
        {
          organizationId:
            organizationId !== undefined ? organizationId : organization?._id,
        },
        { userId: userId },
      ],
    });
    if (checkOrganizationRequest && checkOrganizationRequest.status === 1) {
      return res.send({
        success: false,
        statusCode: 400,
        message: "User is already connected with the organization",
      });
    } else if (checkOrganizationRequest && checkOrganizationRequest.status === 0) {
      return res.send({
        success: false,
        statusCode: 400,
        message: "Your status is pending",
      });
    }

    let payload = {
      organizationId:
        organizationId !== undefined ? organizationId : organization?._id,
      userId: userId,
      referralCode,
    };
    const userOrganization = await OrganizationJoinRequest.create(payload);
    await userOrganization.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "Your request to join organization is successfully completed.",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
// Search Organization with name
const searchOrganization = async (req, res) => {
  try {
    const { id } = req.query;
    const { userId } = req.body;
    const organization = await Organization.findOne({
      _id: ObjectId(id),
    });
    // If no organization found, return an empty array
    if (!organization)
      return res.send({
        success: false,
        statusCode: 400,
        organizations: [],
        message: "Organization is invalid",
      });

    return res.send({
      success: true,
      statusCode: 200,
      organizations: [organization],
      message: "Get Organization Information",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error?.message,
    });
  }
};
// send code through phone
const sendCodeWithPhone = async (req, res) => {
  try {
    // Generate a random verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    // You can store the verification code in your database or session for later verification
    return res.send({
      statusCode: 200,
      success: true,
      message: "Verification code sent successfully.",
    });
  } catch (error) {
    console.error("Error sending verification code:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send verification code.",
    });
  }
};
// send code through email
const sendCodeWithEmail = async (req, res) => {
  try {
    let { organizationId, userId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.send({
        success: false,
        statusCode: 400,
        user: [],
        message: "User is invalid",
      });
    }
    const email = user?.email;
    const organization = await Organization.findOne({
      _id: organizationId,
    });
    if (!organization) {
      return res.send({
        success: false,
        statusCode: 400,
        organizations: [],
        message: "Organization is invalid",
      });
    }
    const checkVerificationCode = await VerifyOrganization.findOne({
      organizationId: organizationId,
      userId: userId,
      status: 0,
      verificationType: 0,
    });
    if (checkVerificationCode) {
      await VerifyOrganization.findOneAndDelete({
        _id: checkVerificationCode?._id,
      });
    }

    const organizationName = organization?.name;
    const verificationCode = randomatic("0", 3) + "-" + randomatic("0", 3);
    let payload = {
      organizationId: organizationId,
      userId: userId,
      verificationCode,
      verificationType: 0,
    };
    const verifyOrganization = await VerifyOrganization.create(payload);
    await verifyOrganization.save();
    await sendEmail(
      email,
      "emailVerificationCode",
      {
        email: organization?.email,
        userName: user?.username,
        organizationName: organizationName,
        verificationCode,
      },
      "Verification Code"
    );
    return res.send({
      statusCode: 200,
      success: true,
      message: "Email code sent successfully.",
    });
  } catch (error) {
    return res.send({
      statusCode: 400,
      message: "Error while sending code through email",
      success: false,
    });
  }
};
// send code through mail
const sendCodeWithMail = async (req, res) => {
  try {
    let { organizationId, userId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.send({
        success: false,
        statusCode: 400,
        user: [],
        message: "User is invalid",
      });
    }
    const organization = await Organization.findOne({
      _id: organizationId,
    });
    if (!organization) {
      return res.send({
        success: false,
        statusCode: 400,
        organizations: [],
        message: "Organization is invalid",
      });
    }

    const checkVerificationCode = await VerifyOrganization.findOne({
      organizationId: organizationId,
      userId: userId,
      status: 0,
      verificationType: 2,
    });
    if (checkVerificationCode) {
      await VerifyOrganization.findOneAndDelete({
        _id: checkVerificationCode?._id,
      });
    }
    const verificationCode = randomatic("0", 3) + "-" + randomatic("0", 3);
    let payload = {
      organizationId: organizationId,
      userId: userId,
      verificationCode,
      verificationType: 2,
    };
    const verifyOrganization = await VerifyOrganization.create(payload);
    await verifyOrganization.save();
    return res.send({
      statusCode: true,
      verifyOrganization,
      message: "Verfication Code generated successfully",
      success: true,
    });
  } catch (error) {
    return res.send({
      statusCode: 400,
      message: "Error while generating code through mail",
      success: false,
    });
  }
};
// verify email code
const verifyEmailCode = async (req, res) => {
  try {
    let { organizationId, userId, verificationCode } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.send({
        success: false,
        statusCode: 400,
        user: [],
        message: "User is invalid",
      });
    }
    const organization = await Organization.findOne({
      _id: organizationId,
    });
    if (!organization) {
      return res.send({
        success: false,
        statusCode: 400,
        organizations: [],
        message: "Organization is invalid",
      });
    }

    const checkVerificationCode = await VerifyOrganization.findOne({
      organizationId: organizationId,
      userId: userId,
      verificationCode: verificationCode,
      verificationType: 0,
      status: 0,
    });
    if (!checkVerificationCode)
      return res.send({
        success: false,
        statusCode: 400,
        message: "Invalid Request",
      });

    if (verificationCode === checkVerificationCode?.verificationCode) {
      checkVerificationCode.verificationCode = undefined;
      checkVerificationCode.status = 1;
      await checkVerificationCode.save();
      return res.send({
        statusCode: 200,
        success: true,
        message: "Verfication Code process completed successfully",
      });
    }
    return res.send({
      success: false,
      statusCode: 400,
      message: "Verification Code not match",
    });
  } catch (error) {
    return res.send({
      statusCode: 400,
      message: "Error while verify verfication process",
      success: false,
    });
  }
};
// verify mail code
const verifyMailCode = async (req, res) => {
  try {
    let { organizationId, userId, verificationCode } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.send({
        success: false,
        statusCode: 400,
        user: [],
        message: "User is invalid",
      });
    }
    const organization = await Organization.findOne({
      _id: organizationId,
    });
    if (!organization) {
      return res.send({
        success: false,
        statusCode: 400,
        organizations: [],
        message: "Organization is invalid",
      });
    }
    const checkVerificationCode = await VerifyOrganization.findOne({
      organizationId: organizationId,
      userId: userId,
      verificationCode: verificationCode,
      verificationType: 2,
      status: 0,
    });
    if (!checkVerificationCode)
      return res.send({
        success: false,
        statusCode: 400,
        message: "Invalid Request",
      });

    if (verificationCode === checkVerificationCode?.verificationCode) {
      checkVerificationCode.verificationCode = undefined;
      checkVerificationCode.status = 1;
      await checkVerificationCode.save();
      return res.send({
        statusCode: 200,
        success: true,
        message: "Verfication Code process completed successfully",
      });
    }
    return res.send({
      success: false,
      statusCode: 400,
      message: "Verification Code not match",
    });
  } catch (error) {
    return res.send({
      statusCode: 400,
      message: "Error while verify verfication process",
      success: false,
    });
  }
};
// verify phone code
const verifyPhoneCode = async (req, res) => {
  try {
    let { organizationId, userId, verificationCode } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.send({
        success: false,
        statusCode: 400,
        user: [],
        message: "User is invalid",
      });
    }
    const organization = await Organization.findOne({
      _id: organizationId,
    });
    if (!organization) {
      return res.send({
        success: false,
        statusCode: 400,
        organizations: [],
        message: "Organization is invalid",
      });
    }
    const checkVerificationCode = await VerifyOrganization.findOne({
      organizationId: organizationId,
      userId: userId,
      verificationCode: verificationCode,
      verificationType: 1,
      status: 0,
    });
    if (!checkVerificationCode)
      return res.send({
        success: false,
        statusCode: 400,
        message: "Invalid Request",
      });

    if (verificationCode === checkVerificationCode?.verificationCode) {
      checkVerificationCode.verificationCode = undefined;
      checkVerificationCode.status = 1;
      await checkVerificationCode.save();
      return res.send({
        statusCode: 200,
        success: true,
        message: "Verfication Code process completed successfully",
      });
    }
    return res.send({
      success: false,
      statusCode: 400,
      message: "Verification Code not match",
    });
  } catch (error) {
    return res.send({
      statusCode: 400,
      message: "Error while verify verfication process",
      success: false,
    });
  }
};
// check whether mail id is verfied or not
const unverifiedMailId = async (req, res) => {
  try {
    const { userId } = req.body;
    const unVerifiedMailId = await VerifyOrganization.findOne({
      userId: userId,
      status: 0,
      verificationType: 2,
    });
    if (unVerifiedMailId)
      return res.send({
        success: true,
        statusCode: 200,
        unVerifiedMailId,
        message: "Get Unverified mail successfully ",
      });
    return res.send({
      success: false,
      statusCode: 400,
      message: "There is no mail to unverify",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      message: "Error while getting unverified mail",
      success: false,
    });
  }
};
// verify user and organization whether original user has created the organization or not
const verifyUserWithOrganization = async (req, res) => {
  try {
    const { userId, organizationId } = req.body;
    const verifyUserWithOrganization = await Organization.findOne({
      userId,
      _id: organizationId,
    });
    if (verifyUserWithOrganization)
      return res.send({
        success: true,
        statusCode: 200,
        verifyUserWithOrganization,
        message: "User is verified ",
      });

    return res.send({
      success: false,
      statusCode: 400,
      message: "User is not verified ",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      message: "Error while verifying user with organization",
      success: false,
    });
  }
};

// verify user and organization whether original user has created the organization or not
const updateUserStatusWithOrganization = async (req, res) => {
  try {
    const { appId, status } = req.body;
    const updateUserStatusWithOrganization =
      await OrganizationJoinRequest.findOneAndUpdate(
        { _id: ObjectId(appId) },
        { $set: { status: status, notification: true } }
      );

    if (updateUserStatusWithOrganization)
      return res.send({
        success: true,
        statusCode: 200,
        updateUserStatusWithOrganization,
        message: "User status is Updated successfully",
      });

    return res.send({
      success: false,
      statusCode: 400,
      message: "User is not verified ",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      message: "Error while verifying user with organization",
      success: false,
    });
  }
};

const updateNotificationWithOrganization = async (req, res) => {
  try {
    const { reqId } = req.body;
    const objectIds = reqId.map((id) => ObjectId(id));
    const updateNotificationInOrg = await OrganizationJoinRequest.updateMany(
      { _id: { $in: objectIds } },
      { $set: { notification: false } }
    );

    if (updateNotificationInOrg)
      return res.send({
        success: true,
        statusCode: 200,
        updateNotificationInOrg,
        message: "Notification Updated successfully",
      });

    return res.send({
      success: false,
      statusCode: 400,
      message: "Notification is not updated",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      message: "Error while verifying user with organization",
      success: false,
    });
  }
};

const profileConnectedWithOrganization = async (req, res) => {
  try {
    const { userId } = req.body;
    let isConnectedWithOrganization = await OrganizationJoinRequest.find({
      userId: userId,
      status: { $in: [0, 1] },
    });
    if (isConnectedWithOrganization.length === 0) {
      // !isConnectedWithOrganization
      return res.send({
        statusCode: 400,
        isConnectedWithOrganization,
        message: "User is not connected with the organization",
        success: false,
      });
    }

    const updatedOrganizationUserData = [];
    for (const connection of isConnectedWithOrganization) {
      const getOrganizationData = await Organization.findOne({
        _id: connection.organizationId,
      });

      if (getOrganizationData) {
        const updatedUserData = {
          ...connection,
          organizationData: getOrganizationData,
        };
        updatedOrganizationUserData.push(updatedUserData);
      }
    }
    return res.send({
      statusCode: 200,
      updatedOrganizationUserData,
      message: "User is connected with the organization",
      success: true,
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      message: "Error while checking whether is user with organization or not",
      success: false,
    });
  }
};

const ownerOforganization = async (req, res) => {
  const { userId, organizationId } = req.body;

  if (organizationId === undefined) {
    var matchUser = await Organization.findOne({
      ownerId: userId,
    });
  }
  const matchUserWithOrganization = await Organization.findOne({
    ownerId: userId,
    _id: matchUser ? matchUser?._id : organizationId,
  });

  if (matchUserWithOrganization)
    return res.send({
      success: true,
      statusCode: 200,
      message: "User own its own organization",
      matchUserWithOrganization,
    });
  return res.send({
    success: false,
    statusCode: 400,
    message: "User does not have its own organization",
  });
};

// API to get count organization members
const countOrganizationMembers = async (req, res) => {
  try {
    const { userId, organizationId } = req.body; // Assuming this is the owner's user ID from the frontend

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.send({
        success: false,
        statusCode: 400,
        user: [],
        message: "User is invalid",
      });
    }
    const organization = await Organization.findOne({
      _id: organizationId,
    });
    if (!organization) {
      return res.send({
        success: false,
        statusCode: 400,
        organizations: [],
        message: "Organization is invalid",
      });
    }

    // Count the number of users connected to the organization except the owner

    var [pendingRequest] = await Promise.all([
      OrganizationJoinRequest.find({
        organizationId,
        status: 0,
      })
        .populate("userId") // Assuming 'userId' refers to the user field
        .exec(),
    ]);

    var [memberCount, users] = await Promise.all([
      OrganizationJoinRequest.countDocuments({ organizationId, status: 1 }),
      OrganizationJoinRequest.find({
        organizationId,
      })
        .populate("userId") // Assuming 'userId' refers to the user field
        .exec(),
    ]);
    return res.send({
      statusCode: 200,
      memberCount,
      pendingRequest,
      users,
      success: true,
      message: "Organization members count retrieved successfully",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
// submit application request
const submitApplicationResource = async (req, res) => {
  try {
    let { userId, organizationId, message, appointmentTime } = req.body;

    if (!appointmentTime) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please select your appointment",
      });
    }
    if (!message) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please enter a message",
      });
    }
    // Get the day from the appointmentTime and store it in appointmentDay
    const appointmentDay = moment(appointmentTime).format("dddd");
    // Convert the date format to 'MM/DD/YYYY' as requested ('10/24/2023' format)
    const appointmentDate = moment(appointmentTime).format("MM/DD/YYYY");

    // Format the time to 'hh:mm A' ('10:00 am - 10:30 am' format)
    const appointmentTimeFormatted = moment(appointmentTime).format("hh:mm A");

    const obj = {
      userId,
      organizationId,
      appointmentDay,
      appointmentDate,
      appointmentTime: appointmentTimeFormatted,
      message,
    };
    // Create an object to store in the database

    const existingDoc = await ApplyForResources.findOne({
      userId: ObjectId(userId),
      organizationId: ObjectId(organizationId),
    });

    if (!existingDoc) {
      const applyforResource = await ApplyForResources(obj);
      const applicationResponse = await applyforResource.save();
      return res.send({
        statusCode: 200,
        success: true,
        applicationResponse,
        message: "Resource Application submitted succesfully",
      });
    } else {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Resource Application is already exit",
      });
    }
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
// check application status
const checkApplicationStatus = async (req, res) => {
  try {
    let { userId, organizationId } = req.body;
    const user = await User.findOne({
      _id: userId,
    });
    if (!user)
      return res.send({
        statusCode: 400,
        success: false,
        message: "User  is invalid",
      });

    if (organizationId !== undefined) {
      const getStatus = await ApplyForResources.find({
        userId: userId,
        organizationId: organizationId,
        status: 0,
      }).populate("userId organizationId");
      if (getStatus)
        return res.send({
          statusCode: 200,
          success: true,
          getStatus,
          message: "Get Status successfully",
        });
    }
    const getStatus = await ApplyForResources.find({
      userId: userId,
    }).populate("userId organizationId");
    if (getStatus.length > 0)
      return res.send({
        statusCode: 200,
        success: true,
        getStatus,
        message: "Get Status successfully",
      });
    return res.send({
      statusCode: 400,
      success: false,
      getStatus: [],
      message: "No Valid Status",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

const reviewUserApplication = async (req, res) => {
  try {
    let { applicationId } = req.body;
    const getStatus = await ApplyForResources.find({
      _id: applicationId,
    }).populate("userId organizationId");
    if (getStatus)
      return res.send({
        statusCode: 200,
        success: true,
        getStatus,
        message: "Get Application successfully",
      });
    return res.send({
      statusCode: 400,
      success: false,
      getStatus: [],
      message: "RNo Valid Status",
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  list,
  organizationDeatil,
  rewardDeatilInOrganization,
  rewardSumInOrganization,
  typeList,
  filterZipCode,
  filterType,
  filterOrganizationName,
  viewOrganizationDetails,
  submitContactDetails,
  updateContactDetails,
  GetUserOrgnization,
  createOrganization,
  updateUserStatusWithOrganization,
  updateNotificationWithOrganization,
  getSimilarOrganizationId,
  createOrganizationType,
  readCsvFile,
  connectUserWithOrganization,
  searchOrganization,
  sendCodeWithPhone,
  sendCodeWithEmail,
  verifyEmailCode,
  sendCodeWithMail,
  unverifiedMailId,
  verifyUserWithOrganization,
  verifyMailCode,
  verifyPhoneCode,
  profileConnectedWithOrganization,
  ownerOforganization,
  countOrganizationMembers,
  submitApplicationResource,
  checkApplicationStatus,
  reviewUserApplication,
  adminTypeList,
};
