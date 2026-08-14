"use client";

import { useState } from "react";
import { updateApplicationStatus } from "@/actions/projects";

export type ApplicationItem = {
  id: string;
  project_title: string;
  applicant_name: string;
  applicant_handle: string;
  status: "pending" | "accepted" | "rejected";
};

type ApplicationsListProps = {
  applications: ApplicationItem[];
};

const statusStyles = {
  pending: "text-iconBlue",
  accepted: "text-iconGreen",
  rejected: "text-iconPink",
};

const ApplicationsList = ({ applications }: ApplicationsListProps) => {
  const [items, setItems] = useState(applications);

  const handleStatus = async (
    applicationId: string,
    status: "accepted" | "rejected"
  ) => {
    const result = await updateApplicationStatus(applicationId, status);
    if (!result?.error) {
      setItems((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status } : a))
      );
    }
  };

  return (
    <div className="">
      <div className="px-4 pt-4 border-b-[1px] border-borderGray">
        <h1 className="text-xl font-bold text-textGrayLight mb-3">
          Applications
        </h1>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {items.length === 0 ? (
          <div className="p-10 text-center text-textGray">
            No applications yet. Share your project to attract builders.
          </div>
        ) : (
          items.map((application) => (
            <div
              key={application.id}
              className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <h2 className="font-bold">{application.applicant_name}</h2>
                  <span className="text-textGray text-sm">
                    @{application.applicant_handle}
                  </span>
                </div>
                <span
                  className={`text-sm font-semibold capitalize ${statusStyles[application.status]}`}
                >
                  {application.status}
                </span>
              </div>
              <div className="text-sm text-textGray">
                Applied to{" "}
                <span className="text-textGrayLight font-semibold">
                  {application.project_title}
                </span>
              </div>
              {application.status === "pending" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatus(application.id, "accepted")}
                    className="py-2 px-4 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatus(application.id, "rejected")}
                    className="py-2 px-4 rounded-full border-[1px] border-borderGray text-sm font-semibold hover:bg-inputGray"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;
