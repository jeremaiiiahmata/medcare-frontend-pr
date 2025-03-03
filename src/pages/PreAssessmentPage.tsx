import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useAxios from "../utils/UseAxios";
import Modal from "../components/Modal";
import { PreAssessment } from "../models/PreAssessmentInterface";
import { Prescription } from "../models/PrescriptionInterface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { HeartPulse, Thermometer, Droplets } from "lucide-react";

const PreAssessmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useAxios();

  const [preAssessment, setPreAssessment] = useState<PreAssessment>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const addPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding Prescription");

    const newPrescription: Prescription = {
      title: title,
      description: description,
    };

    try {
      const response = await api.post(
        `/prescription/create?patient_id=${
          preAssessment?.patient?.id
        }&pre_assessment_id=${id || ""}`,
        newPrescription
      );

      console.log("Prescription created successfully.", response.data);
      handleClear();
    } catch (error) {
      console.log("Error adding prescription:", error);
    } finally{
      navigate(`/prescription/${preAssessment?.prescription}`);
    }
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
  };

  const fetchPreAssessment = async () => {
    try {
      const response = await api.get(`pre-assessment?pre_assessmentID=${id}`);
      setPreAssessment(response.data.data);
      console.log("Pre-assessment has been fetched successfully!");
    } catch (error) {
      console.log(`Error in fetching pre-assessment. ${error}`);
    }
  };

  const convertDate = async () => {
    const dateStr = preAssessment?.date_created;
    const dateObj = dateStr ? new Date(dateStr) : new Date();
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

    setDate(formattedDate);
    console.log(formattedDate);
  };

  useEffect(() => {
    fetchPreAssessment();
    convertDate();
  }, []);

  return (
    <>
      {
        // Modal for adding prescription
        isModalOpen && (
          <div className="z-50">
            <Modal
              title="Add Prescription"
              setIsOpen={() => setIsModalOpen(false)}
            >
              <div className="border rounded-full my-2"></div>
              <form onSubmit={addPrescription}>
                <div className="flex flex-col gap-6">
                  {/* Row 0: Title */}
                  <div className="flex flex-col">
                    <label>Title</label>
                    <input
                      type="text"
                      className="border rounded-md px-2 py-2 border-gray-300"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>Description</label>
                    <textarea
                      className="border rounded-md px-2 py-2 border-gray-300 h-24"
                      placeholder="Notes"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2 mx-4 my-2">
                    <button
                      className="bg-[#03624C] py-2.5 px-4 rounded-md text-white font-medium cursor-pointer"
                      type="submit"
                    >
                      Create Prescription
                    </button>
                  </div>
                </div>
              </form>
            </Modal>
          </div>
        )
      }
        <div className="bg-[#F5F6FA] min-h-screen p-4">
          <div className="bg-[#F5F6FA] rounded-lg shadow-lg p-6 max-w-full mx-auto">
            {/* <!-- Header --> */}
            <div className="mb-6">
              <Link to="/dashboard">
                <button className="text-gray-600 hover:text-emerald-600 flex items-center transition-colors duration-300 ease-in-out group cursor-pointer">
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="mr-2 transform group-hover:translate-x-[-3px] transition-transform duration-300"
                  />
                  <span className="group-hover:text-emerald-700 transition-colors duration-300">
                    Back to dashboard
                  </span>
                </button>
              </Link>
            </div>

            <div className="mb-1">
              <h1 className="text-4xl font-bold mb-2">Assessment</h1>
              <h2>Date Created : {date}</h2>
            </div>
            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* <!-- Patient Card --> */}
              <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
                <div className="flex flex-col items-center">
                  <div className="bg-teal-100 rounded-lg w-24 h-24 flex items-center justify-center overflow-hidden mb-2">
                    <img
                      src="/medcare-logo.png"
                      alt="MedCare logo"
                      className="rounded-lg"
                    />
                  </div>
                  <h3 className="text-lg font-bold mt-2">
                    {preAssessment?.patient?.first_name}{" "}
                    {preAssessment?.patient?.last_name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Age: {preAssessment?.patient?.age}
                  </p>
                  <Link
                    to={
                      preAssessment?.prescription
                        ? `/prescription/${preAssessment?.prescription}`
                        : "#"
                    }
                  >
                    <button
                      className={`p-2 ${
                        preAssessment?.prescription
                          ? "bg-emerald-400 hover:bg-emerald-500 cursor-pointer"
                          : "bg-gray-400 hover:bg-gray-500 cursor-pointer"
                      } rounded-md font-semibold text-white`}
                      onClick={() => {
                        if (!preAssessment?.prescription) {
                          setIsModalOpen(true);
                        }
                      }}
                    >
                      {preAssessment?.prescription
                        ? "View Linked Prescrption"
                        : "Create Prescription"}
                    </button>
                  </Link>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-3 gap-4">
       
                <div className="bg-white rounded-lg shadow border border-gray-100 p-4 flex flex-col items-center justify-center">
                  <div className="text-red-500 mb-1">
                    <HeartPulse size={86} />
                  </div>
                  <p className="text-gray-600 text-sm">Heart Rate</p>
                  <p className="text-2xl font-bold flex items-baseline">
                    {preAssessment?.heart_rate}
                    <span className="text-xs ml-1 text-gray-500">bpm</span>
                  </p>
                </div>

     
                <div className="bg-white rounded-lg shadow border border-gray-100 p-4 flex flex-col items-center justify-center">
                  <div className="text-yellow-500 mb-1">
                    <Thermometer size={86} />
                  </div>
                  <p className="text-gray-600 text-sm">Body Temperature</p>
                  <p className="text-2xl font-bold flex items-baseline">
                    {preAssessment?.temperature}
                  </p>
                </div>

               
                <div className="bg-white rounded-lg shadow border border-gray-100 p-4 flex flex-col items-center justify-center">
                  <div className="text-red-400 mb-1">
                    <Droplets size={86} />
                  </div>
                  <p className="text-gray-600 text-sm">Blood Pressure</p>
                  <p className="text-2xl font-bold flex items-baseline">
                    {preAssessment?.blood_pressure}
                    <span className="text-xs ml-1 text-gray-500">mmHg</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
                <h2 className="text-lg font-semibold mb-4">Information:</h2>
                <div className="space-y-2">
                  <div className="flex">
                    <div className="w-24 font-medium text-gray-600">
                      Gender:
                    </div>
                    <div>Male</div>
                  </div>
                  <div className="flex">
                    <div className="w-24 font-medium text-gray-600">
                      Blood Type:
                    </div>
                    <div>{preAssessment?.patient?.blood_type}</div>
                  </div>
                  <div className="flex">
                    <div className="w-24 font-medium text-gray-600">
                      Allergies:
                    </div>
                    <div>{preAssessment?.patient?.allergies}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 font-medium text-gray-600">
                      Chronic Conditions:
                    </div>
                    <div>{preAssessment?.chronic_conditions}</div>
                  </div>
                  <div className="flex">
                    <div className="w-24 font-medium text-gray-600">
                      Weight:
                    </div>
                    <div>{preAssessment?.patient?.weight}</div>
                  </div>
                  <div className="flex">
                    <div className="w-24 font-medium text-gray-600">
                      Senior ID:
                    </div>
                    <div>{preAssessment?.patient?.id_number}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
                <h2 className="text-lg font-semibold mb-4">Reports:</h2>
                <div className="space-y-3">
                  <div className="flex items-baseline p-3 border rounded-md h-[100px]">
                    <div className="bg-red-100 p-2 rounded-md mr-3">
                    </div>
                    <div>
                      <h4 className="text-md font-semibold">Complaint</h4>
                      <p className="text-md text-gray-800">
                        {preAssessment?.complaint}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline p-3 border rounded-md h-[100px]">
                    <div className="bg-red-100 p-2 rounded-md mr-3">
                    </div>
                    <div>
                      <h4 className="text-md font-semibold">Medical History</h4>
                      <p className="text-xs text-gray-500">
                        {preAssessment?.medical_history}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default PreAssessmentPage;
