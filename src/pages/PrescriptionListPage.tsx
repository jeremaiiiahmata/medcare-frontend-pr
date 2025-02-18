import {useContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { Prescription } from '../models/PrescriptionInterface';
import Spinner from "../components/Spinner";

import useAxios from '../utils/UseAxios';
import AuthContext from "../context/AuthContext";

const PrescriptionListPage = () => {

    const authContext = useContext(AuthContext);
    const api = useAxios();
    const patientId = 1; 

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    if (!authContext) {
        throw new Error("PrivateRoute must be used within an AuthProvider");
      }
    
      const { authTokens, user } = authContext;
    
      if (!authTokens) {
        throw new Error("No tokens");
      } else if (!user) {
        throw new Error("No user");
      }
    
      const decodedToken = jwtDecode<{ user_id: number }>(authTokens.access);
      const userId = decodedToken.user_id; 
      console.log("User ID from token:", userId);
      console.log("Fetching from patient ID:", patientId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/prescriptions/${patientId}`);
                console.log("API Response:", response.data);
                setPrescriptions(response.data.data);
            } catch (error) {
                console.log(error);
                setError("Something went wrong. Please try again.");
                setPrescriptions([]);
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchData();
        }

    }, [prescriptions]);

  return (
    <>
    
    {loading && 
        <Spinner/>
    }

    {error && 
        <p style={{ color: "red" }}>{error}</p>
    }

    {prescriptions.length > 0 ? (
        prescriptions.map((prescription) => (
            <div key={prescription.id}>
                <h1 className="font-bold">{prescription.title}</h1>
                <p>{prescription.description || "No description available"}</p>
                <p>Date: {prescription.date_created}</p>
            </div>
        ))
    ) : (
        !loading && <p>No prescriptions found.</p>
    )}
    
    </>
  );
}

export default PrescriptionListPage