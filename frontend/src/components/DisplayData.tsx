import { useEffect, useState } from "react";
import axios from "axios";
import CustomPagination from "./CustomPagination.tsx"; // Adjust the import based on your file structure

interface Contact {
  name: string;
  label: string;
  description: string;
  groupName: string;
  type: string;
}

const DisplayData = () => {
  const [message, setMessage] = useState<string>("");
  const [contactData, setContactData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleRefreshToken = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/display/refreshtoken"
      );
      setMessage(response.data.message);
      console.log(message);
    } catch (error) {
      console.error("Error refreshing token:", error);
      setMessage("Failed to refresh token.");
      console.log(message);
    }
  };

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/display/contact"
        );
        setContactData(response.data);
      } catch (err) {
        setError("Error fetching data from the API");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center">{error}</div>;
  }

  // Calculate the current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contactData.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(contactData.length / itemsPerPage);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold">HubSpot Contact Data</h1>
      <div className="flex justify-end mt-4">
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          onClick={handleRefreshToken}
        >
          Refresh Access Token
        </button>
      </div>

      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Label</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Group Name</th>
            <th className="border px-4 py-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((contact, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{contact.name}</td>
              <td className="border px-4 py-2">{contact.label}</td>
              <td className="border px-4 py-2">{contact.description}</td>
              <td className="border px-4 py-2">{contact.groupName}</td>
              <td className="border px-4 py-2">{contact.type}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DisplayData;
