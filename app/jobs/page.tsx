"use client";

import React, { useEffect, useState } from "react";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  link: string;
  date: string;
}

const fetchJobs = async (): Promise<Job[]> => {
  const res = await fetch("https://devstream-backend.onrender.com/api/v1/jobs/getJobs");
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json() as Promise<Job[]>;
};

const Page: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [visited, setVisited] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetchJobs();
        console.log("API response:", response);

        // ✅ if API response looks like { data: [...] }
        const jobList = (response as any).data ?? response;

        // ✅ sort latest first
        const sorted = [...jobList].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setJobs(sorted);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    loadJobs();
  }, []);

  const handleVisit = (idx: number) => {
    setVisited((prev) => new Set(prev).add(idx));
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Jobs Table</h1>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Company</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Link</th>
            <th className="border px-2 py-2">Number</th>
            <th className="border px-2 py-2">Visited</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job, idx) => (
              <tr key={job._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{job.title}</td>
                <td className="border px-4 py-2">{job.company}</td>
                <td className="border px-4 py-2">{job.location}</td>
                <td className="border px-4 py-2">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleVisit(idx)}
                    className={`underline ${
                      visited.has(idx) ? "text-green-600" : "text-blue-500"
                    }`}
                  >
                    Link
                  </a>
                </td>
                <td className="border px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2">
                  {visited.has(idx) ? "✅" : "❌"}
                </td>
                <td className="border px-4 py-2">
                  {new Date(job.date).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No jobs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
