import {useContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { Prescription } from '../models/PrescriptionInterface';
import SearchBar from "../components/SearchBar";
import Spinner from "../components/Spinner";
import PrescriptionTabular from "../components/PrescriptionTabular";

import useAxios from '../utils/UseAxios';
import AuthContext from "../context/AuthContext";

const PrescriptionListPage = () => {

    const authContext = useContext(AuthContext);
    const api = useAxios();
    const patientId = 1; 

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
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
      
      const fetchData = async () => {
        try {
            const response = await api.get(`/prescriptions/${patientId}`);
            console.log("API Response:", response.data);
            setPrescriptions(response.data.data);
        } catch (error) {
            console.log(error);
            setPrescriptions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) {
            fetchData();
        }
    }, []);

  return (
    <div className='flex flex-1'>
    {prescriptions.length > 0 ? (
        <div className="h-full w-full p-7 flex justify-center flex-col">
        <div className="w-full flex justify-between">
          <div className="flex gap-4">
            <div>
              <SearchBar
            placeholder="Search Patient..."
            search={title}
            setSearch={setTitle}
            />
            </div>
          </div>
        </div>
        <PrescriptionTabular prescriptions={prescriptions}/>
        </div>
    ) : (
            <div className='flex items-center justify-center w-full h-full'>
                <p className='p-10 text-6xl'>No Pre-assessments found.</p>
        </div>
    )}
</div>
  
  );
}

export default PrescriptionListPage