import { useEffect, useState } from "react";
import useAxios from "../utils/UseAxios";
import { Drug } from "../models/DrugInterface";
import { ReportType } from "../models/ReportTypeInterface";
import Spinner from "../components/Spinner";
import { useParams } from "react-router-dom";
import { Prescription } from "../models/PrescriptionInterface";
import Swal from "sweetalert2";
import { PrescriptionItem } from "../models/PrescriptionItemInterface";
import Modal from "../components/Modal";
import PrimaryBtn from "../components/PrimaryBtn";

const PrescriptionPage = () => {
  const api = useAxios();

  const { id } = useParams();

  const [report, setReport] = useState<ReportType | null>(null);
  const [drug, setDrugs] = useState<PrescriptionItem[]>([]);
  const [prescription, setPrescription] = useState<Prescription>();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const [drugName, setDrugName] = useState<string>("");
  const [dosage, setDosage] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("") || "N/A";


  const generateReport = async () => {
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

  const handleDelete = async (index : number) => {
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
                const response = await api.delete(`/prescription-item/delete?prescription_id=${id}&drug_id=${index}`);
                console.log(response.status);
                console.log(`Deteled ID : ${index}`);
                fetchPrescriptions();
              } catch (error) {
                console.log(`Error in deleting pre-assessment : ${error}`);
              }
            } else if (result.isDenied) {
              console.log("Delete cancelled.")
            }
          });
      console.log("Deleted!");
  }

  const addPrescriptionItem = async () => {

    const newItem : PrescriptionItem = {
      prescription: Number(id),
      amount: amount,
      drug_name: drugName,
      dosage: dosage,
      frequency: frequency,
      notes: notes,
    }

    const response = await api.post(`prescription-item/add?prescription_id=${id}`, newItem)
    console.log("Prescription item has been successfully added!");
  }

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
    <div className="max-w-screen-3xl mx-auto px-5">
    {loading && <Spinner />}
    {isOpen && (
        <Modal title="Add Pre-Assessment" setIsOpen={setIsOpen}>
        <div className="border rounded-full my-2"></div>
        <form onSubmit={addPrescriptionItem}>
          <div className="flex flex-col gap-6">
             {/* Row 1: Drug Name & Amount */}
             <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="drug_name" className="text-sm font-medium">
                  Drug Name
                </label>
                <input
                  type="text"
                  id="drug_name"
                  name="drug_name"
                  className="border rounded p-2"
                  placeholder="Enter drug name"
                  onChange={(e) => {
                    setDrugName(e.target.value);
                  }}
                  required
                />
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
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setDosage(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setFrequency(e.target.value);
                  }}
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
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
                rows={3}
              ></textarea>
            </div>

            {/* Submit Button */}
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
      )}

      {/* Title and Date */}
      <h1 className="text-4xl font-bold mt-5">Title: {prescription?.title}</h1>
      <h2 className="text-xl font-semibold my-1">
        Date Created: {prescription?.date_created}
      </h2>

      {/* Layout: Grid with Left & Right Sections */}
      <div className="grid grid-cols-12 gap-6 mt-5 h-screen">
        
        {/* Left Side - Prescription List (35% width) */}
        <div className="col-span-4 bg-[#E7E7E7] shadow-lg rounded-lg p-5 overflow-auto">
          <div className="flex justify-between items-center align-middle">
            <h3 className="text-3xl font-bold">Prescription List</h3>
            <button className="mr-3 mt-3 mb-3 p-2 bg-amber-400 hover:bg-amber-500 cursor-pointer" onClick={() => setIsOpen(true)}>
              Add Medication
            </button>
          </div>

          {drug.map((drug) => (
              <div
                key={drug.id}
                className="border p-3 rounded-md shadow-sm my-2 bg-white"
              >
                <div className="flex items-center justify-between">
                  {/* Left Side: Information */}
                  <div className="flex-1">
                    <h1 className="font-semibold">Drug Name: {drug.drug_name}</h1>
                    <h3>Dosage: {drug.dosage}</h3>
                    <h3>Amount: {drug.amount}</h3>
                    <h3>Frequency: {drug.frequency}</h3>
                  </div>
                  {/* Right Side: Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      className="cursor-pointer relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs mx-1 text-gray-900 hover:bg-gray-500/70 active:bg-gray-500/90"
                      type="button"
                    >
                      <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="h-4 w-4"
                        >
                          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                        </svg>
                      </span>
                    </button>
                    <button
                      className="cursor-pointer relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs mx-1 text-gray-900 hover:bg-gray-500/70 active:bg-gray-500/90"
                      type="button"
                      onClick={() => drug.id !== undefined && handleDelete(drug.id)}
                    >
                      <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <svg
                          className="w-6 h-6 text-red-800 dark:text-red"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        {/* Right Side - Conditional Display */}
        {isGeneratingReport ? (
          /* Show Spinner When Generating Report */
          <div className="col-span-8 flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          /* Show Report Data When Loaded */
          <div className="col-span-8 flex flex-col gap-6">
            
            {/* Drug-Drug Interactions */}
            <div className="bg-[#E7E7E7] shadow-lg rounded-lg p-5">
              <h3 className="text-2xl font-bold">Drug-Drug Interactions</h3>
              <button
                className="bg-[#03624C] my-3 text-white px-4 py-2 rounded-md hover:bg-[#024534] transition"
                onClick={generateReport}
              >
                Generate Report
              </button>
              {report?.interactions?.map(
                (interaction, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-yellow-500 bg-yellow-100 p-3 mb-3 rounded-md"
                  >
                    <p className="font-bold text-2xl">
                     {interaction.drug_a} + {interaction.drug_b}
                    </p>
                    <p>
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
                    <p>
                      <strong>Description:</strong> {interaction.description}
                    </p>
                    <p>
                      <strong>Management:</strong> {interaction.management}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Dosage Recommendations */}
            <div className="bg-[#E7E7E7] shadow-lg rounded-lg p-5">
              <h3 className="text-2xl font-bold mb-3">Dosage Recommendations</h3>
              {report?.dosage_adjustments?.map(
                (adjustment, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 bg-blue-100 p-3 mb-3 rounded-md"
                  >
                    <p className="font-bold text-2xl">{adjustment.drug}</p>
                    <p>
                      <strong>Reason:</strong>{" "} {adjustment.reason}
                    </p>
                    <p>
                      <strong>Current Dosage:</strong>{" "}
                      {adjustment.current}
                    </p>
                    <p>
                      <strong>Recommended Dosage:</strong>{" "}
                      {adjustment.recommended}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Final Recommendation */}
            <div className="bg-[#E7E7E7] shadow-lg rounded-lg p-5">
              <h3 className="text-2xl font-bold mb-3">Final Recommendation</h3>
              {report?.final_recommendation && (
                <div className="border border-red-500 bg-red-100 p-4 rounded-md">
                  {report?.final_recommendation}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionPage;
