import { useEffect, useState } from 'react'
import useAxios from '../utils/UseAxios';
import { Drug } from '../models/DrugInterface';
import { ReportType } from '../models/ReportTypeInterface';


const PrescriptionPage = () => {

    const interactionStyle: React.CSSProperties = {
        padding: "10px",
        marginBottom: "10px",
        backgroundColor: "#fff3cd",
        borderLeft: "5px solid #ffc107",
        borderRadius: "5px"
    };
    
    const recommendationStyle: React.CSSProperties = {
        padding: "10px",
        marginBottom: "10px",
        backgroundColor: "#e3f2fd",
        borderLeft: "5px solid #2196F3",
        borderRadius: "5px"
    };
    
    const finalRecommendationStyle: React.CSSProperties = {
        padding: "15px",
        border: "2px solid red",
        borderRadius: "8px",
        backgroundColor: "#f8d7da",
        marginTop: "15px"
    };
    
    const [report, setReport] = useState<ReportType | null>(null);    
    const [data, setData] = useState<Drug[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const api = useAxios();


    const handleSubmit = async () => {
        try {
            const response = await api.post("/generate-report/?prescription_id=1");
            let rawData = response.data?.reply;
    
            // Ensure it's a string before processing
            if (typeof rawData === "string") {
                // Remove markdown syntax (backticks and "json" label)
                rawData = rawData.replace(/^```json\n/, "").replace(/\n```$/, "");
    
                // Parse JSON safely
                const parsedData = JSON.parse(rawData);
                setReport(parsedData);
                console.log(parsedData);

            } else {
                setReport(rawData);
                console.log(rawData);
            } 

        } catch (error) {
            console.log(`Error. ${error}`);
        }
        
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/prescription/1");
                console.log("API Response:", response.data);
                setData(Array.isArray(response.data.data) ? response.data.data : []);
            } catch (error) {
                console.log(error);
                setError("Something went wrong. Please try again.");
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

  return (
    <div>

    <h1>Prescription Page</h1>
    
    {error ? (
            <p style={{ color: "red" }}>{error}</p>
        ) : (
            data.map(drug => (
                <div key={drug.id}>
                    <h1>{drug.drug_name}</h1>
                    <h3>{drug.dosage} :</h3>
                    <h3>{drug.amount} :</h3>
                </div>
            ))
        )}

    <button onClick={handleSubmit}>Generate Report</button>

    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ textAlign: "center", color: "#333" }}>📋 Drug Interaction Report</h2>

        {report?.potential_drug_interactions?.map((interaction, index) => (
            <div key={index} style={interactionStyle}>
                <p><strong>🩺 {interaction.drug_a} & {interaction.drug_b}</strong></p>
                <p><strong>Severity:</strong> 
                    <span style={{ color: interaction.severity === "Major" ? "red" : "orange" }}>
                        {interaction.severity}
                    </span>
                </p>
                <p><strong>Description:</strong> {interaction.description}</p>
                <p><strong>Management:</strong> {interaction.management}</p>
            </div>
        ))}

        <h3 style={{ color: "#0275d8" }}>💊 Dosage Adjustment Recommendations</h3>
        {report?.dosage_adjustment_recommendations?.map((adjustment, index) => (
            <div key={index} style={recommendationStyle}>
                <p><strong>🔹 {adjustment.drug_name}</strong></p>
                <p><strong>Reason:</strong> {adjustment.reason}</p>
                <p><strong>Recommended Action:</strong> {adjustment.recommended_action}</p>
            </div>
        ))}

            <h3 style={{ color: "green" }}>📢 Final Recommendation</h3>
            <div style={finalRecommendationStyle}>
                <p><strong>Status:</strong> {report?.final_recommendation}</p>
            </div>
        </div>
    </div>
  )
}

export default PrescriptionPage