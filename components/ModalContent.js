// components/ModalContent.js
import React from "react";

// Format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? "-" : date.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });
};

export default function ModalContent({ type, data }) {
  if (!data) return null;

  switch(type) {
    case "Job Details":
      return (
        <div className="space-y-2 text-sm text-gray-800">
          <p><strong>Title:</strong> {data.title}</p>
          <p><strong>Location:</strong> {data.location}</p>
          <p><strong>Status:</strong> {data.status}</p>
          <p><strong>Date Posted:</strong> {formatDate(data.datePosted)}</p>
          <p><strong>Description:</strong> {data.description || "-"}</p>
          <p><strong>Applicants:</strong> {data.applicants?.length || 0}</p>
        </div>
      );
    case "Application Details":
      return (
        <div className="space-y-2 text-sm text-gray-800">
          <p><strong>Job:</strong> {data.jobTitle}</p>
          <p><strong>Experience:</strong> {data.experience}</p>
          <p><strong>Applied Date:</strong> {formatDate(data.appliedDate)}</p>
          <p><strong>Status:</strong> {data.status}</p>
          <p><strong>Notes:</strong> {data.notes || "-"}</p>
        </div>
      );
    case "Worker Performance":
      return (
        <div className="space-y-2 text-sm text-gray-800">
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Position:</strong> {data.position}</p>
          <p><strong>Hire Date:</strong> {formatDate(data.hireDate)}</p>
          <p><strong>Performance:</strong> {data.performance}</p>
        </div>
      );
    default:
      return <pre className="text-sm text-gray-700">{JSON.stringify(data, null, 2)}</pre>;
  }
}
