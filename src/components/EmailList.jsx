import fetchEmails from "../api";
import { useEffect, useState } from "react";

const EmailList = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState("email");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    async function loadEmails() {
      try {
        const emailData = await fetchEmails();
        setEmails(emailData);
      } catch (err) {
        setError("Failed to load emails. Please, try again later.");
        console.error("Error fetching emails:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEmails();
  }, []);

  const handleFilterChange = (event) => {
    setFilterText(event.target.value.toLowerCase());
  };

  const sortEmails = (field) => {
    let sortedEmails = [...emails];
    if (sortBy !== field || sortDirection === "desc") {
      sortedEmails.sort((a, b) =>
        a[field].toString().localeCompare(b[field].toString())
      );
      setSortBy(field);
      setSortDirection("asc");
    } else {
      sortedEmails.reverse();
      setSortDirection("desc");
    }
    setEmails(sortedEmails);
  };

  const filteredEmails = emails.filter(
    (email) => email.email.toLowerCase().includes(filterText)
  );

  if (loading) {
    return <p className="text-lg">Loading emails...</p>;
  }

  if (error) {
    return (
      <>
        <p className="text-2xl text-red-600">{error}</p>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        placeholder="Search by Email..."
        value={filterText}
        onChange={handleFilterChange}
        className="my-8 w-full max-w-md p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <h1 className="text-6xl text-green-900 my-10">Email List</h1>
      <table className="border-collapse mb-10 flex flex-col items-center">
        <thead>
          <tr>
            <th>
              <button className="cursor-pointer hover:text-blue-700 border py-2 px-4 mb-4"
              onClick={() => sortEmails("email")}>Sort by alphabet</button>
            </th>
          </tr>
        </thead>
        <tbody className="border-collapse">
          {filteredEmails.reduce((rows, _, index) => {
            if (index % 4 === 0) rows.push(filteredEmails.slice(index, index + 4));
            return rows;
          }, []).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((el) => (
                <td key={el.id} className="border border-gray-500 px-4 py-2">
                  <span className="font-bold">{el.id}. </span>
                  {el.email}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmailList;
