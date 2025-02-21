import { useEffect, useState } from "react";
import useAxios from "../utils/UseAxios";
import { Drug } from "../models/DrugInterface";
import { ReportType } from "../models/ReportTypeInterface";
import Spinner from "../components/Spinner";
import { useParams } from "react-router-dom";
import { Prescription } from "../models/PrescriptionInterface";

const PrescriptionPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState<ReportType | null>(null);
  const [drug, setDrugs] = useState<Drug[]>([]);
  const [prescription, setPrescription] = useState<Prescription>();
  const [loading, setLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [error, setError] = useState("");
  const api = useAxios();

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

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get(`/prescription-items/${id}`);
      setDrugs(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.log(error);
      setDrugs([]);
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

      {/* Title and Date */}
      <h1 className="text-4xl font-bold mt-5">Title: {prescription?.title}</h1>
      <h2 className="text-xl font-semibold my-1">
        Date Created: {prescription?.date_created}
      </h2>

      {/* Layout: Grid with Left & Right Sections */}
      <div className="grid grid-cols-12 gap-6 mt-5 h-screen">
        
        {/* Left Side - Prescription List (35% width) */}
        <div className="col-span-4 bg-[#ACCDC6] shadow-lg rounded-lg p-5 overflow-auto">
          <h3 className="text-2xl font-bold mb-3">Prescription List</h3>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            drug.map((drug) => (
              <div
                key={drug.id}
                className="border p-3 rounded-md shadow-sm my-2"
              >
                <h1 className="font-semibold">Drug Name: {drug.drug_name}</h1>
                <h3>Dosage: {drug.dosage}</h3>
                <h3>Amount: {drug.amount}</h3>
              </div>
            ))
          )}
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
            <div className="bg-[#ACCDC6] shadow-lg rounded-lg p-5">
              <h3 className="text-2xl font-bold">Drug-Drug Interactions</h3>
              <button
                className="bg-[#03624C] my-3 text-white px-4 py-2 rounded-md hover:bg-[#024534] transition"
                onClick={generateReport}
              >
                Generate Report
              </button>
              {report?.potential_drug_interactions?.map(
                (interaction, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-yellow-500 bg-yellow-100 p-3 mb-3 rounded-md"
                  >
                    <p className="font-semibold">
                      🩺 {interaction.drug_a} & {interaction.drug_b}
                    </p>
                    <p>
                      <strong>Severity:</strong>
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
            <div className="bg-[#ACCDC6] shadow-lg rounded-lg p-5">
              <h3 className="text-2xl font-bold mb-3">Dosage Recommendations</h3>
              {report?.dosage_adjustment_recommendations?.map(
                (adjustment, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 bg-blue-100 p-3 mb-3 rounded-md"
                  >
                    <p className="font-semibold">🔹 {adjustment.drug_name}</p>
                    <p>
                      <strong>Reason:</strong> {adjustment.reason}
                    </p>
                    <p>
                      <strong>Recommended Action:</strong>{" "}
                      {adjustment.recommended_action}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Final Recommendation */}
            <div className="bg-[#ACCDC6] shadow-lg rounded-lg p-5">
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
