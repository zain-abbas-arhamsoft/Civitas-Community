import { useState, useEffect } from "react";
import { fetchDocuments } from "@/api/users";
/**
 * Custom React hook to fetch user documents
 * @param {Object} user - User information
 * @returns {Object} - Returns an object containing the fetched documents
 */
const useFetchDocuments = (user, renderFlag) => {
  // State to store the fetched documents
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to retrieve user documents
  const getDocuments = async () => {
    try {
      const response = await fetchDocuments(user);
      if (response) {
        setDocuments(response?.userDocuments);
        setLoading(false);
      }
    } catch (error) {
      // Handle errors, if any
    }
  };
  useEffect(() => {
    getDocuments();
  }, []);

  useEffect(() => {
    if (renderFlag) {
      getDocuments();
    }
  }, [renderFlag]);

  return { documents, loading };
};

export default useFetchDocuments;
