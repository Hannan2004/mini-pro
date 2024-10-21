import clientPromise from "../lib/mongodb";
import { GetServerSideProps } from "next";
import { useState } from "react";
import Navbar from "../components/Navbar";

interface Logs {
  _id: string;
  timestamp: string;
  source_ip: string;
  activity: string;
}

interface LogsProps {
  logs: Logs[];
}

const LogsTable: React.FC<LogsProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter logs based on the search term
  const filteredLogs = logs.filter(
    (log) =>
      log.timestamp.includes(searchTerm) ||
      log.source_ip.includes(searchTerm) ||
      log.activity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Timestamp", "Source IP", "Activity"],
      ...logs.map(log => [log.timestamp, log.source_ip, log.activity])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "logs.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "logs.json");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
    <div>
      <Navbar />
    </div>
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-extrabold mb-4 text-center text-teal-400">
        Network Activity Logs
      </h1>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search by IP, Activity, or Timestamp..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-3 w-1/2 rounded-md bg-gray-800 text-white border-2 border-gray-700 focus:border-teal-400 outline-none transition-all duration-300 shadow-lg"
        />
      </div>

      {/* Export Buttons */}
      <div className="mb-8 flex justify-center space-x-4">
        <button
          onClick={exportToCSV}
          className="px-4 py-2 rounded-md bg-teal-500 text-white font-bold hover:bg-teal-400 transition-all duration-300"
        >
          Export as CSV
        </button>
        <button
          onClick={exportToJSON}
          className="px-4 py-2 rounded-md bg-teal-500 text-white font-bold hover:bg-teal-400 transition-all duration-300"
        >
          Export as JSON
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr>
              <th className="py-4 px-6 text-left font-medium bg-gray-700 text-teal-300">
                Timestamp
              </th>
              <th className="py-4 px-6 text-left font-medium bg-gray-700 text-teal-300">
                Source IP
              </th>
              <th className="py-4 px-6 text-left font-medium bg-gray-700 text-teal-300">
                Activity
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log, index) => (
              <tr
                key={log._id}
                className={`border-t border-gray-700 ${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                } hover:bg-teal-600 hover:text-gray-100 transition-all duration-200`}
              >
                <td className="py-4 px-6">{log.timestamp}</td>
                <td className="py-4 px-6">{log.source_ip}</td>
                <td className="py-4 px-6">{log.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md bg-teal-500 text-white font-bold ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-400"
          } transition-all duration-300`}
        >
          Previous
        </button>
        <span className="text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md bg-teal-500 text-white font-bold ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-400"
          } transition-all duration-300`}
        >
          Next
        </button>
      </div>
    </div>
    </>
  );
};

export default LogsTable;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const logs = await db
      .collection("logs")
      .find({})
      .sort({ metacritic: -1 })
      .limit(20)
      .toArray();
    return {
      props: { logs: JSON.parse(JSON.stringify(logs)) },
    };
  } catch (e) {
    console.error(e);
    return { props: { logs: [] } };
  }
};