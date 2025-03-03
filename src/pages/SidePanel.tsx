import Modal from "../components/Modal";
import PrimaryBtn from "../components/PrimaryBtn";
import { Patient } from "../models/PatientInterface";
import { MdOutlineMail, MdOutlineDelete } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import ProfilePicture from "../components/ProfilePicture";
import RedButton from "../components/RedButton";
import useAxios from "../utils/UseAxios";
import { Prescription } from "../models/PrescriptionInterface";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PreAssessment } from "../models/PreAssessmentInterface";
import Swal from "sweetalert2";

interface Props {
  patient: Patient;
  setSelectedPatient: (value: Patient | null) => void;
  fetchPatients: (offset?: number) => void;
}

const SidePanel = ({ patient, setSelectedPatient, fetchPatients }: Props) => {
  const api = useAxios();

  //Pre-Assessment Modal
  const [isPreAssessOpen, setIsPreAssessOpen] = useState<boolean>(false);
  const [patientPrescriptions, setPatientPrescriptions] = useState<
    Prescription[]
  >([]);

  const [bloodPressure, setBloodPressure] = useState<string>("");
  const [heartRate, setHeartRate] = useState<string>("");
  const [temperature, setTemperature] = useState<string>("");
  const [unit, setUnit] = useState("°C");
  const [chronicConditions, setChronicConditions] = useState<string>("");
  const [smokingHistory, setSmokingHistory] = useState<string>("");
  const [alcoholHistory, setAlcoholHistory] = useState<string>("");
  const [complaint, setComplaint] = useState<string>("");
  const [medicalHistory, setMedicalHistory] = useState<string>("");
  const combinedTemperature = `${temperature} ${unit}`;

  //Prescription Modal
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState<boolean>(false);
  const [prescriptionTitle, setPrescriptionTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [preAssessments, setPreAssessments] = useState<PreAssessment[]>([]);

  const addPreAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding Pre-Assessment");

    // Add New Pre-Assessment
    const newPreassessment: PreAssessment = {
      blood_pressure: bloodPressure,
      heart_rate: heartRate,
      temperature: combinedTemperature,
      chronic_conditions: chronicConditions,
      smoking_history: smokingHistory,
      alcohol_consumption_history: alcoholHistory,
      complaint: complaint,
      medical_history: medicalHistory,
    };

    try {
      const response = await api.post(
        `/pre-assessment/create?patient_id=${patient.id}`,
        newPreassessment
      );

      console.log(
        `Pre-assessment has been added successfully. Response : ${response.status}`
      );
      handleClear();
    } catch (error) {
      console.log(`Error in adding pre-assessment : ${error}`);
    }
  };

  const addPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding Prescription");
    console.log(`Prescription Title ${prescriptionTitle}`);

    // Add New Prescription
    const newPrescription: Prescription = {
      title: prescriptionTitle,
      description: description,
    };

    try {
      const response = await api.post(
        `/prescription/create?patient_id=${patient.id}`,
        newPrescription
      );

      console.log(`Patient ID from Post Method : ${patient.id}`);
      console.log("Prescription has been added successfully.");
      console.log(`Status ${response.status}`);
      fetchPrescriptions();
      handleClear();
    } catch (error) {
      console.log(`Error in adding pre-assessment : ${error}`);
    }
  };

  const handleClear = () => {
    setPrescriptionTitle("");
    setDescription("");
    setHeartRate("");
    setBloodPressure("");
    setTemperature("");
    setChronicConditions("");
    setSmokingHistory("");
    setAlcoholHistory("");
    setComplaint("");
    setMedicalHistory("");
    setIsPreAssessOpen(false);
    setIsPrescriptionOpen(false);
  };

  // Delete Patient
  const deletePatient = async () => {
    Swal.fire({
      title: `Confirm Delete?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Delete",
      confirmButtonColor: "#F04444",
      denyButtonColor: "#6F7D7D",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire("Prescription Item Deleted!", "", "success");
        try {
          const response = await api.delete(
            `/patient/delete?patient_id=${patient.id}`
          );
          if (response.status === 200) {
            console.log(`Patient ${patient.id} successfully deleted`);
            fetchPatients();
            setSelectedPatient(null);
          }
        } catch (error) {
          console.log(`Error in deleting patient : ${error}`);
        }
      } else if (result.isDenied) {
        console.log("Delete cancelled.");
      }
    });
    console.log("Deleted!");
  };

  // Fetch Prescriptions
  const fetchPrescriptions = async () => {
    try {
      const response = await api.get(`/prescriptions/${patient.id}`);
      const prescriptions = await response.data;

      setPatientPrescriptions(prescriptions.data);
      console.log(patientPrescriptions);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPreAssessment = async () => {
    try {
      const response = await api.get(
        `/pre-assessments?patient_id=${patient.id}`
      );
      const preAssessments = await response.data;

      setPreAssessments(preAssessments.data);
      console.log(preAssessments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    fetchPreAssessment();
  }, []);

  const [selectedTab, setSelectedTab] = useState<string>("medical");

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <>
      {/*Pre-Assessment Modal*/}
      {isPreAssessOpen && (
        <div className="z-50">
          <Modal title="Add Pre-Assessment" setIsOpen={setIsPreAssessOpen}>
            <div className="border rounded-full my-2"></div>
            <form onSubmit={addPreAssessment}>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col w-60">
                    <label>Heart Rate</label>
                    <div className="flex">
                      <input
                        className="border rounded-l-md px-2 border-gray-300 w-full h-10"
                        placeholder="Heart Rate"
                        value={heartRate}
                        onChange={(e) => setHeartRate(e.target.value)}
                      />
                      <span className="flex items-center bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-2">
                        bpm
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col w-60">
                    <label>Blood Pressure</label>
                    <div className="flex">
                      <input
                        className="border rounded-l-md px-2 border-gray-300 w-full h-10"
                        placeholder="Blood Pressure"
                        value={bloodPressure}
                        onChange={(e) => setBloodPressure(e.target.value)}
                      />
                      <span className="flex items-center bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-2">
                        mmHg
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col w-60">
                    <label>Temperature</label>
                    <div className="flex">
                      <input
                        type="number"
                        className="border rounded-l-md px-2 border-gray-300 w-full h-10"
                        placeholder="Temperature"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                      />
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="flex items-center bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-2"
                      >
                        <option value="°C">°C</option>
                        <option value="°F">°F</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <label>Chronic Conditions</label>
                    <input
                      className="border rounded-md px-2 border-gray-300 h-10"
                      placeholder="Chronic Conditions"
                      value={chronicConditions}
                      onChange={(e) => setChronicConditions(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>Alcohol Consumption History</label>
                    <select
                      value={smokingHistory}
                      onChange={(e) => setSmokingHistory(e.target.value)}
                      className="border rounded-sm px-2 border-gray-300 w-60 h-10"
                    >
                      <option value="">Select Drinking Habit</option>
                      <option value="Never">Never</option>
                      <option value="Former">Former</option>
                      <option value="Current">Current</option>
                      <option value="Occasional">Occasional</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label>Smoking History</label>
                    <select
                      value={alcoholHistory}
                      onChange={(e) => setAlcoholHistory(e.target.value)}
                      className="border rounded-sm px-2 border-gray-300 w-60 h-10"
                    >
                      <option value="">Select Smoking Habit</option>
                      <option value="Never">Never</option>
                      <option value="Former">Former</option>
                      <option value="Current">Current</option>
                      <option value="Occasional">Occasional</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label>Chief Complaint</label>
                  <textarea
                    className="border rounded-md px-2 py-2 border-gray-300 h-24"
                    placeholder="Complaint"
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label>Medical History</label>
                  <textarea
                    className="border rounded-md px-2 py-2 border-gray-300 h-24"
                    placeholder="Medical History"
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 mx-4 my-2">
                  <button
                    className="bg-[#03624C] py-2.5 px-4 rounded-md text-white font-medium cursor-pointer"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {isPrescriptionOpen && (
        <div className="z-50">
          <Modal title="Add Prescription" setIsOpen={setIsPrescriptionOpen}>
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
                    value={prescriptionTitle}
                    onChange={(e) => setPrescriptionTitle(e.target.value)}
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
      )}

      <Modal
        setIsOpen={() => {
          setSelectedPatient(null);
        }}
        title="Patient Profile"
      >
        <div className="flex gap-3 h-full">
          {/* Personal details */}
          <div className="rounded-lg shadow-lg w-2xs p-4 h-full">
            <div className="w-full flex justify-center mb-8">
              <div className="flex flex-col gap-4 items-center">
                <ProfilePicture />

                <div className="flex justify-between gap-2">
                  <PrimaryBtn
                    onClick={() => {
                      console.log("Edit");
                    }}
                    type="button"
                  >
                    {/* <MdModeEdit size={16} /> */}
                    Edit
                  </PrimaryBtn>
                  <RedButton type="button" onClick={deletePatient}>
                    <MdOutlineDelete size={20} />
                  </RedButton>
                </div>
              </div>
            </div>

            {/* About */}
            <h2 className="text-lg font-semibold text-green-800 mb-2">About</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <p className="font-semibold text-[18px]">
                  {patient.first_name} {patient.last_name}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="flex items-center gap-2">{patient.email}</p>
                <p className="flex items-center gap-2">
                  {patient.contact_number}
                </p>
              </div>
              <div className="flex flex-col">
                {/* Address */}
                <h3 className="font-semibold">Address</h3>
                <div>
                  <p>{patient.street_name}</p>
                </div>
                <div className="flex justify-between">
                  <p>{patient.city}</p>
                  <p>{patient.state_province}</p>
                  <p>{patient.postal_code}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="w-1/3 flex-auto  flex flex-col gap-2">
            <div className="flex justify-between items-center  text-sm font-semibold">
              <div className="flex gap-5">
                {["medical", "prescriptions", "pre-assessments"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`cursor-pointer pb-1 transition-all duration-300 ${
                      selectedTab === tab
                        ? "text-green-800 border-b-2 border-green-800 font-bold"
                        : "text-gray-600 hover:text-green-700"
                    }`}
                  >
                    {tab === "medical"
                      ? "Medical Details"
                      : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <PrimaryBtn
                  onClick={() => setIsPreAssessOpen(!isPreAssessOpen)}
                  type="button"
                >
                  {/* <MdModeEdit size={16} /> */}
                  Add Pre-Assessment
                </PrimaryBtn>
                <PrimaryBtn
                  onClick={() => setIsPrescriptionOpen(!isPrescriptionOpen)}
                  type="button"
                >
                  {/* <MdModeEdit size={16} /> */}
                  Add Prescription
                </PrimaryBtn>
              </div>
            </div>
            <div className="border border-gray-300 rounded-md flex flex-auto h-full p-2 flex-col gap-2 overflow-y-auto">
              {selectedTab === "prescriptions" &&
                (patientPrescriptions.length > 0 ? (
                  patientPrescriptions.map((prescription, index) => (
                    <Link to={`/prescription/${prescription.id}`} key={index}>
                      <div className="bg-emerald-50 shadow-md w-full p-2 transition-all duration-150 hover:border-emerald-300 rounded-md border border-transparent hover:border">
                        <h2 className="font-semibold">Prescription Title: </h2>
                        {prescription.title}
                        <h2 className="font-semibold">Date Created:</h2>
                        {prescription.date_created}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="h-full w-full flex justify-center items-center">
                    <h2 className="text-lg font-semibold text-emerald-800/60">
                      Patient has no prescriptions
                    </h2>
                  </div>
                ))}

              {selectedTab === "pre-assessments" &&
                (preAssessments.length > 0 ? (
                  preAssessments.map((assessment, index) => (
                    <Link to={`/preassessment/${assessment.id}`} key={index}>
                      <div className="bg-emerald-50 shadow-md w-full p-2 transition-all duration-150 hover:border-emerald-300 rounded-md border border-transparent hover:border">
                        <h2 className="font-semibold">Complaint: </h2>
                        {assessment?.complaint}
                        <h2 className="font-semibold">Date Created:</h2>
                        {assessment.date_created}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="h-full w-full flex justify-center items-center">
                    <h2 className="text-lg font-semibold text-emerald-800/60">
                      Patient has no assessments
                    </h2>
                  </div>
                ))}

              {selectedTab === "medical" && (
                <div className="p-4">
                  <h2 className="font-semibold text-lg text-gray-800 mb-6">
                    Medical Details
                  </h2>
                  <p className="my-4 py-2">
                    <span className="font-semibold">Age:</span>{" "}
                    {patient.age || "N/A"}
                  </p>
                  <p className="my-4 py-2">
                    <span className="font-semibold">Weight:</span>{" "}
                    {patient.weight || "None"}
                  </p>
                  <p className="my-4 py-2">
                    <span className="font-semibold">Gender:</span>{" "}
                    {patient.gender || "None"}
                  </p>
                  <p className="my-4 py-2">
                    <span className="font-semibold">Blood Type:</span>{" "}
                    {patient.blood_type || "N/A"}
                  </p>
                  <p className="my-4 py-2">
                    <span className="font-semibold">Allergies:</span>{" "}
                    {patient.allergies || "None"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SidePanel;
