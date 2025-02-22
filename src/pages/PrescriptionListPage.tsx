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

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(false);
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
      
      const fetchData = async () => {

        setLoading(true);

        try {
            const response = await api.get(`/prescriptions/all`);
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
      fetchData();  
    }, []);

  return (
    <div className='flex flex-1'>
    {prescriptions.length > 0 ? (
        <div className="h-full w-full p-7 flex justify-center flex-col">
        <div>
          <h1 className="text-5xl font-bold py-5 w-fit">Prescriptions</h1>
        </div>
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
        <PrescriptionTabular prescriptions={prescriptions} fetchData={fetchData}/>
        </div>
    ) : (
            <div className='flex items-center justify-center w-full h-full'>
                <p className='p-10 text-6xl'>No Prescriptions found.</p>
        </div>
    )}
</div>
  
  );
}

export default PrescriptionListPage