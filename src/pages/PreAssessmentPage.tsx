import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAxios from "../utils/UseAxios";
import { PreAssessment } from "../models/PreAssessmentInterface";

const PreAssessmentPage = () => {
  const { id } = useParams();
  const api = useAxios();

  const [preAssessment, setPreAssessment] = useState<PreAssessment>();
  const [date, setDate] = useState<string>("");

  const fetchPreAssessment = async () => {
    try {
      const response = await api.get(`pre-assessment?pre_assessmentID=${id}`);
      setPreAssessment(response.data.data)
      console.log("Pre-assessment has been fetched successfully!");
    } catch (error) {
      console.log(`Error in fetching pre-assessment. ${preAssessment}`)
    }
  }

  const convertDate = async () => {
    const dateStr = preAssessment?.date_created;
    const dateObj = dateStr ? new Date(dateStr) : new Date();
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
  });

    setDate(formattedDate)
    console.log(formattedDate);
  }

  useEffect(() => {
    fetchPreAssessment();
    convertDate();
  }, [])

  return (
    <div className="max-w-screen-3xl mx-auto px-5">
      {/* Layout: Grid with Left & Right Sections */}
      <div className="grid grid-cols-12 gap-6 mt-5 h-screen">
        {/* Left Side - Prescription List (35% width) */}
        <div className="col-span-4 flex flex-col gap-6 h-[85%]">
          <div className="bg-[#E7E7E7] shadow-lg rounded-lg p-10 m-5 mt-5 h-full">
            {/* Left panel content */}
          </div>
        </div>

        {/* Right Side */}
        <div className="col-span-8 flex flex-col gap-6 h-[85%]">
          {/* Top Section: Title & Description */}
          <div className="p-5">
            <h1 className="text-5xl font-bold">Title: {preAssessment?.title}</h1>
            <h2 className="text-xl font-semibold mt-2">Date Created: {date} </h2>
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
            <div className="flex-1 p-5 mt-5 mr-5 ml-5 mb-5 bg-[#E7E7E7] shadow-lg rounded-lg">
              {/* Your content here */}
              <div className="flex justify-between p-5 my-5">
                <p>
                  Heart Rate : 
                </p>
                <p>
                  Temperature :
                </p>
              </div>
              <div className="flex justify-between p-5 my-5">
                <p>
                  Chronic Conditions : 
                </p>
              </div>
              <div className="flex justify-between p-5 my-5">
                <p>
                  Smoking History : 
                </p>
              </div>
              <div className="flex justify-between p-5 my-5">
                <p>
                  Complaint : 
                </p>
                <p>
                  Notes :
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreAssessmentPage;
