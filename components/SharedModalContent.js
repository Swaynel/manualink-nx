import React from "react";

// Format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? "-" : date.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });
};

// DataTable Component
const DataTable = ({ columns, data }) => (
  <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
    <table className="w-full min-w-max">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((item, idx) => (
          <tr key={item.id || idx}>
            {columns.map((col) => (
              <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {col.render ? col.render(item) : item[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function SharedModalContent({ type, data }) {
  if (!data) return <p className="text-gray-500">No data available</p>;

  let columns = [];
  let displayData = Array.isArray(data) ? data : [data]; // always array for DataTable

  switch (type) {
    case "job":
      columns = [
        { key: "title", title: "Job Title", render: (d) => <span className="font-medium">{d.title}</span> },
        { key: "location", title: "Location" },
        {
          key: "status",
          title: "Status",
          render: (d) => (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${d.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
              {d.status}
            </span>
          ),
        },
        { key: "datePosted", title: "Posted On", render: (d) => formatDate(d.datePosted) },
      ];
      break;

    case "application":
      columns = [
        { key: "jobTitle", title: "Job Applied For" },
        { key: "experience", title: "Experience" },
        { key: "appliedDate", title: "Applied Date", render: (d) => formatDate(d.appliedDate) },
        {
          key: "status",
          title: "Status",
          render: (d) => (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${d.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>
              {d.status}
            </span>
          ),
        },
      ];
      break;

    case "workerPerformance":
      columns = [
        { key: "workerName", title: "Worker Name" },
        { key: "completedJobs", title: "Completed Jobs" },
        { key: "activeJobs", title: "Active Jobs" },
        { key: "rating", title: "Rating", render: (d) => `${d.rating || "-"} ⭐` },
      ];
      break;

    default:
      return <p className="text-gray-500">Unknown modal type</p>;
  }

  return <DataTable columns={columns} data={displayData} />;
}
