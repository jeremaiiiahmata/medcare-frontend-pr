import React from "react";
import { useParams, Link } from "react-router-dom";

const PreAssessmentPage = () => {
  const { id } = useParams();

  return (
    <div className="max-w-screen-3xl mx-auto px-5">
      {/* Layout: Grid with Left & Right Sections */}
      <div className="grid grid-cols-12 gap-6 mt-5 h-screen">
        {/* Left Side - Prescription List (35% width) */}
        <div className="col-span-4 flex flex-col gap-6 h-[85%]">
          <div className="bg-[#D9D9D9] shadow-lg rounded-lg p-10 m-5 mt-5 h-full">
            {/* Left panel content */}
          </div>
        </div>

        {/* Right Side */}
        <div className="col-span-8 flex flex-col gap-6 h-[85%]">
          {/* Top Section: Title & Description */}
          <div className="p-5">
            <h1 className="text-5xl font-bold">Title:</h1>
            <h2 className="text-xl font-semibold mt-2">Description:</h2>
          </div>

          {/* Bottom Section: Pre-Assessment Header + Content */}
          <div className="flex flex-col flex-1">
            {/* Header row with Pre-Assessment and Button */}
            <div className="flex items-center justify-between px-5">
              <h1 className="text-5xl font-bold">Pre-Assessment</h1>
              <Link to="/prescription/2">
                <button className="p-2 bg-amber-500 rounded">
                  View Linked Prescription
                </button>
              </Link>
              
            </div>
            {/* Content area that takes up the remaining space */}
            <div className="flex-1 p-5 mt-5 mr-5 ml-5 mb-5 bg-[#D9D9D9] shadow-lg rounded-lg">
              {/* Your content here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreAssessmentPage;
