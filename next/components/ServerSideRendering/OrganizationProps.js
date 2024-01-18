import {
  filterByOrganizationId,
  getSimilarOrganizationId,
} from "@/api/organizations";

// Function to fetch organization data for server-side rendering
export async function getOrganizationServerSideProps(id) {
  try {
    // Fetch data from API using the provided ID
    const organizations = await filterByOrganizationId({ id: id });
    // Handling the case where organizations are not found
    if (!organizations) {
      throw new Error("Organizations not found"); // Handle the case where organizations is not found
    }
    let organizationTypes = []; // Initializing as an empty array
    if (organizations?.updatedOrganizationDetails?._doc?.type) {
      // Fetching similar organization data based on the type
      const response = await getSimilarOrganizationId({
        _id: organizations?.updatedOrganizationDetails?._doc?._id,
        type: organizations?.updatedOrganizationDetails?._doc?.type,
      });
      organizationTypes =
        response?.updatedOrganizationDetails?._doc?.type || [];
    }

    // Returning the fetched data as props
    return {
      organizations: organizations.updatedOrganizationDetails, // Organizing fetched organization data
      organizationTypes, // Organizing similar organization data based on type
    };
  } catch (error) {
    return {
      organizations: null, // Set organizations to null in case of error
      organizationTypes: [], // Setting organizationTypes to an empty array
    };
  }
}
