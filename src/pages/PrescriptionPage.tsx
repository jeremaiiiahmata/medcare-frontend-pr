import { useEffect, useState } from "react";
import useAxios from "../utils/UseAxios";
import { ReportType } from "../models/ReportTypeInterface";
import Spinner from "../components/Spinner";
import { Link, useParams } from "react-router-dom";
import { Prescription } from "../models/PrescriptionInterface";
import Swal from "sweetalert2";
import { PrescriptionItem } from "../models/PrescriptionItemInterface";
import Modal from "../components/Modal";
import { DrugSuggestions } from "../data/DrugSuggestions";
import { PreAssessment } from "../models/PreAssessmentInterface";
import PrimaryBtn from "../components/PrimaryBtn";
import { FaTrash } from "react-icons/fa";

const PrescriptionPage = () => {
  const api = useAxios();

  const { id } = useParams();

  const [report, setReport] = useState<ReportType | null>(null);
  const [drug, setDrugs] = useState<PrescriptionItem[]>([]);
  const [prescription, setPrescription] = useState<Prescription>();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [initial, setInitial] = useState<boolean>(true);

  const [isPreAssessOpen, setIsPreAssessOpen] = useState<boolean>(false);

  const [drugName, setDrugName] = useState<string>("");
  const [dosage, setDosage] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("") || "N/A";

  const [filteredDrugs, setFilteredDrugs] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

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

  // Create New Pre-Assessment
  const addPreAssessment = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPreassessment: PreAssessment = {
      prescription: Number(id),
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
      console.log(`Prescription id : ${id}`);

      const response = await api.post(
        `/pre-assessment/create?prescription_id=${id}`,
        newPreassessment
      );

      console.log("Pre-Assessment Created:", response.data);
      setIsPreAssessOpen(false);
      handleClear();
    } catch (error) {
      console.log(`Error creating pre-assessment: ${error}`);
    }
  };

  const handleClear = () => {
    setHeartRate("");
    setBloodPressure("");
    setTemperature("");
    setChronicConditions("");
    setSmokingHistory("");
    setAlcoholHistory("");
    setComplaint("");
    setMedicalHistory("");
    setIsPreAssessOpen(false);
  };

  // Handle Drug Name Input
  const handleDrugInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDrugName(input);

    if (input.length > 0) {
      const matches = DrugSuggestions.filter((drug) =>
        drug.toLowerCase().includes(input.toLowerCase())
      );

      setFilteredDrugs(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle Selecting a Drug from Dropdown
  const handleSelectDrug = (drug: string) => {
    setDrugName(drug); // Set selected drug
    setShowSuggestions(false); // Hide suggestions
  };

  const generateReport = async () => {
    setInitial(false);
    setIsGeneratingReport(true); // Start showing spinner

    try {
      const response = await api.post(
        `/generate-report/?prescription_id=${id}`
      );

      let rawData = response.data?.reply;
      if (typeof rawData === "string") {
        rawData = rawData.replace(/^```json\n/, "").replace(/\n```$/, "");
        const parsedData = JSON.parse(rawData);
        setReport(parsedData);
        console.log(parsedData);
      } else {
        setReport(rawData);
        console.log(rawData);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    } finally {
      setIsGeneratingReport(false); // Hide spinner when request is done
    }
  };

  const handleDelete = async (index: number) => {
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
            `/prescription-item/delete?prescription_id=${id}&drug_id=${index}`
          );
          console.log(response.status);
          console.log(`Deteled ID : ${index}`);
          fetchPrescriptions();
        } catch (error) {
          console.log(`Error in deleting pre-assessment : ${error}`);
        }
      } else if (result.isDenied) {
        console.log("Delete cancelled.");
      }
    });
    console.log("Deleted!");
  };

  const addPrescriptionItem = async () => {
    const newItem: PrescriptionItem = {
      prescription: Number(id),
      amount: amount,
      drug_name: drugName,
      dosage: dosage,
      frequency: frequency,
      notes: notes,
    };

    const response = await api.post(
      `prescription-item/add?prescription_id=${id}`,
      newItem
    );
    console.log(
      `Prescription item has been successfully added! Response : ${response}`
    );
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get(`/prescription-items/${id}`);
      setDrugs(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParent = async () => {
    try {
      const response = await api.get(`/prescription-container/${id}`);
      setPrescription(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParent();
    fetchPrescriptions();
  }, []);

  return (
    <div className="h-full p-5">
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
                    className="bg-[#03624C] py-2.5 px-4 rounded-md text-white font-medium"
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

      {!loading && prescription?.id == null && (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-bold text-6xl">No Prescription found</h1>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Create Prescription
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <Modal title="Add Prescription Item" setIsOpen={setIsOpen}>
          <div className="border rounded-full my-2"></div>
          <form onSubmit={addPrescriptionItem}>
            <div className="flex flex-col gap-6">
              {/* Row 1: Drug Name & Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col relative">
                  <label htmlFor="drug_name" className="text-sm font-medium">
                    Drug Name
                  </label>
                  <input
                    type="text"
                    id="drug_name"
                    name="drug_name"
                    className="border rounded p-2 w-full"
                    placeholder="Enter drug name"
                    value={drugName}
                    onChange={handleDrugInputChange}
                    required
                  />

                  {/* Suggestions Dropdown */}
                  {showSuggestions && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1">
                      {filteredDrugs.map((drug, index) => (
                        <li
                          key={index}
                          className="px-3 py-2 hover:bg-green-100 cursor-pointer"
                          onClick={() => handleSelectDrug(drug)}
                        >
                          {drug}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount
                  </label>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    className="border rounded p-2"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Dosage & Frequency */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="dosage" className="text-sm font-medium">
                    Dosage
                  </label>
                  <input
                    type="text"
                    id="dosage"
                    name="dosage"
                    className="border rounded p-2"
                    placeholder="Enter dosage"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="frequency" className="text-sm font-medium">
                    Frequency
                  </label>
                  <input
                    type="text"
                    id="frequency"
                    name="frequency"
                    className="border rounded p-2"
                    placeholder="Enter frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 3: Notes (optional) */}
              <div className="flex flex-col">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  className="border rounded p-2"
                  placeholder="Enter any additional notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                ></textarea>
              </div>

              {/* Submit Button */}
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
      )}

      <div className="flex h-full gap-2">
        <div className="h-full flex flex-col gap-2 w-2/6">
          <div className="shadow-md border border-gray-300 rounded-md">
            <div className="bg-emerald-600 h-fit p-2 rounded-t-md flex items-center justify-center">
              <h3 className="font-bold text-xl text-white">
                Prescription Details
              </h3>
            </div>
            <div className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <span className="flex gap-2">
                    <strong>Title</strong>
                    <p className="text-gray-500">{prescription?.title}</p>
                  </span>
                  <span className="flex gap-2">
                    <strong>Date Created</strong>
                    <p className="text-gray-500">
                      {prescription?.date_created}
                    </p>
                  </span>
                </div>
                <Link
                  to={
                    prescription?.preassessment?.id
                      ? `/preassessment/${prescription.preassessment.id}`
                      : "#"
                  }
                >
                  <button
                    className={`mr-3 mt-3 mb-3 p-2 ${
                      prescription?.preassessment?.id
                        ? "bg-blue-400 hover:bg-blue-500 cursor-pointer"
                        : "bg-gray-400 cursor-pointer"
                    } rounded-md font-semibold text-white`}
                    onClick={() => {
                      if (!prescription?.preassessment?.id) {
                        setIsPreAssessOpen(true);
                      }
                    }}
                  >
                    {prescription?.preassessment?.id
                      ? "View Linked Pre-Assessment"
                      : "Create Pre-Assessment"}
                  </button>
                </Link>
              </div>
              <div className="border border-gray-200 my-3" />
              <div className="flex flex-col">
                <h4 className="font-bold">Description</h4>
                <p className="text-gray-500">{prescription?.description}</p>
              </div>
            </div>
          </div>
          <div className="h-full w-full shadow-md rounded-md border border-gray-300">
            <div className="bg-emerald-600 h-fit p-2 rounded-t-md flex items-center justify-center">
              <h3 className="font-bold text-xl text-white">
                Prescription List
              </h3>
            </div>
            <div className="p-2 flex flex-col">
              <PrimaryBtn
                type="button"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Add Medication
              </PrimaryBtn>

              <div className="mt-2 overflow-y-auto h-[22.5rem] space-y-1">
                {drug.map((drug, index) => (
                  <div
                    key={index}
                    className="h-14 rounded-sm p-2 grid grid-cols-5 gap-1 items-center bg-slate-50 border border-gray-300"
                  >
                    <div className="flex flex-col text-sm">
                      <h3 className="font-semibold">Name</h3>
                      <p>{drug.drug_name}</p>
                    </div>
                    <div className="flex flex-col text-sm">
                      <h3 className="font-semibold">Amount</h3>
                      <p>{drug.amount}</p>
                    </div>
                    <div className="flex flex-col text-sm">
                      <h3 className="font-semibold">Dosage</h3>
                      <p>{drug.dosage}</p>
                    </div>
                    <div className="flex flex-col text-sm">
                      <h3 className="font-semibold">Frequency</h3>
                      <p>{drug.frequency}</p>
                    </div>
                    <button
                      className="justify-self-end bg-rose-600 w-fit p-1.5 rounded-sm cursor-pointer hover:scale-110 transition-transform ease-in-out duration-200"
                      onClick={() =>
                        drug.id !== undefined && handleDelete(drug.id)
                      }
                    >
                      <FaTrash size={12} color="#fff" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h-full flex-1 shadow-md rounded-md flex items-center justify-center flex-col gap-1 border-gray-300 border ">
          {/* Generate Report Prompt */}
          {initial ? (
            <>
              <h2 className="font-bold text-xl text-emerald-800/60">
                No Report Found
              </h2>
              <PrimaryBtn type="button" onClick={generateReport}>
                Generate
              </PrimaryBtn>
            </>
          ) : isGeneratingReport ? (
            <>
              <Spinner />
            </>
          ) : (
            <div className="w-full h-full flex flex-col gap-2 p-2 justify-center ">
              <div>
                <h2 className="font-bold text-xl text-emerald-900">
                  Report Generated
                </h2>
                <h3 className="text-sm text-rose-600">
                  Disclaimer: AI-generated reports are for reference only. Final
                  decisions rest with the attending physician/s
                </h3>
              </div>
              <div className="overflow-y-auto flex flex-col gap-2 h-[36rem] p-1">
                {/* Interactions */}
                <div className="p-2 flex flex-col gap-2 bg-amber-200 rounded-sm">
                  <h4 className="font-semibold">Drug-To-Drug Interactions</h4>
                  {report?.interactions?.map((interaction, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-yellow-500 bg-yellow-100 p-2 rounded-md"
                    >
                      <p className="font-bold text-lg">
                        {interaction.drug_a} + {interaction.drug_b}
                      </p>
                      <p className="text-sm">
                        <strong>Severity: </strong>
                        <span
                          className={
                            interaction.severity === "Major"
                              ? "text-red-500"
                              : "text-orange-500"
                          }
                        >
                          {interaction.severity}
                        </span>
                      </p>
                      <p className="text-sm">
                        <strong>Description:</strong> {interaction.description}
                      </p>
                      <p className="text-sm">
                        <strong>Management:</strong> {interaction.management}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Adjustments */}
                <div className="p-2 flex flex-col gap-2 bg-sky-200 rounded-sm">
                  <h4 className="font-semibold">Dosage Adjustments</h4>
                  {report?.dosage_adjustments?.map((adjustment, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 bg-blue-100 p-2 rounded-md"
                    >
                      <p className="font-bold text-lg">{adjustment.drug}</p>
                      <p className="text-sm">
                        <strong>Reason:</strong> {adjustment.reason}
                      </p>
                      <p className="text-sm">
                        <strong>Current Dosage:</strong> {adjustment.current}
                      </p>
                      <p className="text-sm">
                        <strong>Recommended Dosage:</strong>
                        {adjustment.recommended}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Recommendations */}
                <div className="p-2 flex flex-col gap-2 bg-emerald-100 rounded-sm">
                  <h4 className="font-semibold">Final Recommendation</h4>
                  {report?.final_recommendation && (
                    <div className="bg-emerald-200 p-2 rounded-md">
                      <p className="text-sm">{report.final_recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;

// <div className="grid grid-cols-12 gap-6 mt-5">
// <div className="col-span-4 bg-[#FAFAFA] shadow-lg rounded-lg p-5 overflow-auto">
//   <div className="flex justify-between items-center align-middle">
//     <h3 className="text-3xl font-bold">Prescription List</h3>
//     <button
//       className="mr-3 mt-3 mb-3 p-2 bg-amber-400 hover:bg-amber-500 cursor-pointer rounded-md font-semibold text-black"
//       onClick={() => setIsOpen(true)}
//     >
//       Add Medication
//     </button>
//   </div>

//   {drug.map((drug) => (
//     <div
//       key={drug.id}
//       className="border p-3 rounded-md shadow-sm my-2 bg-white"
//     >
//       <div className="flex items-center justify-between">
//         {/* Left Side: Information */}
//         <div className="flex-1">
//           <h1 className="font-semibold">Drug Name: {drug.drug_name}</h1>
//           <h3>Dosage: {drug.dosage}</h3>
//           <h3>Amount: {drug.amount}</h3>
//           <h3>Frequency: {drug.frequency}</h3>
//         </div>
//         {/* Right Side: Buttons */}
//         <div className="flex items-center gap-2">
//           <button
//             className="cursor-pointer relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs mx-1 text-gray-900 hover:bg-gray-500/70 active:bg-gray-500/90"
//             type="button"
//           >
//             <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 aria-hidden="true"
//                 className="h-4 w-4"
//               >
//                 <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
//               </svg>
//             </span>
//           </button>
//           <button
//             className="cursor-pointer relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs mx-1 text-gray-900 hover:bg-gray-500/70 active:bg-gray-500/90"
//             type="button"
//             onClick={() => drug.id !== undefined && handleDelete(drug.id)}
//           >
//             <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
//               <svg
//                 className="w-6 h-6 text-red-800 dark:text-red"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
//                 />
//               </svg>
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   ))}
// </div>;

// {
//   /* Right Side - Conditional Display */
// }
// {
//   isGeneratingReport ? (
//     /* Show Spinner When Generating Report */
//     <div className="col-span-8 flex justify-center items-center">
//       <Spinner />
//     </div>
//   ) : (
//     /* Show Report Data When Loaded */
//     <div className="col-span-8 flex flex-col gap-6">
//       {/* Drug-Drug Interactions */}
//       <div className="bg-[#FAFAFA] shadow-lg rounded-lg px-5">
//         <div className="flex flex-row justify-between items-center">
//           <h3 className="text-2xl font-bold">Drug-Drug Interactions</h3>
//           <button
//             className="bg-[#03624C] my-2 text-white px-4 py-2 rounded-md hover:bg-[#024534] transition"
//             onClick={generateReport}
//           >
//             Generate Report
//           </button>
//         </div>
//         <p className="text-[12px]">
//           Disclaimer: AI-generated reports are for reference only. Final
//           decisions rest with the attending physician.
//         </p>
//         {report?.interactions?.map((interaction, index) => (
//           <div
//             key={index}
//             className="border-l-4 border-yellow-500 bg-yellow-100 p-3 mb-3 rounded-md"
//           >
//             <p className="font-bold text-2xl">
//               {interaction.drug_a} + {interaction.drug_b}
//             </p>
//             <p>
//               <strong>Severity: </strong>
//               <span
//                 className={
//                   interaction.severity === "Major"
//                     ? "text-red-500"
//                     : "text-orange-500"
//                 }
//               >
//                 {interaction.severity}
//               </span>
//             </p>
//             <p>
//               <strong>Description:</strong> {interaction.description}
//             </p>
//             <p>
//               <strong>Management:</strong> {interaction.management}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Dosage Recommendations */}
//       <div className="bg-[#FAFAFA] shadow-lg rounded-lg p-5">
//         <h3 className="text-2xl font-bold mb-3">Dosage Recommendations</h3>
//         {report?.dosage_adjustments?.map((adjustment, index) => (
//           <div
//             key={index}
//             className="border-l-4 border-blue-500 bg-blue-100 p-3 mb-3 rounded-md"
//           >
//             <p className="font-bold text-2xl">{adjustment.drug}</p>
//             <p>
//               <strong>Reason:</strong> {adjustment.reason}
//             </p>
//             <p>
//               <strong>Current Dosage:</strong> {adjustment.current}
//             </p>
//             <p>
//               <strong>Recommended Dosage:</strong> {adjustment.recommended}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Final Recommendation */}
//       <div className="bg-[#FAFAFA] shadow-lg rounded-lg p-5">
//         <h3 className="text-2xl font-bold mb-3">Final Recommendation</h3>
//         {report?.final_recommendation && (
//           <div className="border border-red-500 bg-red-100 p-4 rounded-md">
//             {report?.final_recommendation}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// </div>
