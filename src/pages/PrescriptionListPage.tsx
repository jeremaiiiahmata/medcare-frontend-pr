import { useContext, useEffect, useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { Prescription } from "../models/PrescriptionInterface";
import SearchBar from "../components/SearchBar";
import Spinner from "../components/Spinner";
import PrescriptionTabular from "../components/PrescriptionTabular";

import useAxios from "../utils/UseAxios";
import AuthContext from "../context/AuthContext";

const PrescriptionListPage = () => {
  const authContext = useContext(AuthContext);
  const api = useAxios();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");


  const fetchData = async () => {
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

  // Filter prescriptions based on the search term
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(prescription =>
      prescription.patient?.first_name.toLowerCase().includes(title.toLowerCase())
    );
  }, [prescriptions, title]);


  return (
    <div className="flex flex-1">
        <div className="h-full w-full p-7 flex justify-center flex-col">
          <div>
            <h1 className="text-5xl font-bold py-5 w-fit">Prescriptions</h1>
          </div>
          <div className="w-full flex justify-start gap-4 py-2">
          <div className="flex gap-4 items-center">
            <SearchBar
              placeholder="Search Patient..."
              search={title}
              setSearch={setTitle}
            />
          </div>
        </div>
          <PrescriptionTabular
            prescriptions={filteredPrescriptions}
            fetchData={fetchData}
          />
        </div>
    </div>
  );
};

export default PrescriptionListPage;
