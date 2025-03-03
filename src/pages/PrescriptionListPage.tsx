import { useEffect, useState, useMemo } from "react";
import { Prescription } from "../models/PrescriptionInterface";
import SearchBar from "../components/SearchBar";
import PrescriptionTabular from "../components/PrescriptionTabular";
import useAxios from "../utils/UseAxios";
import { PaginatedResult } from "../models/PaginationInterface";

const PrescriptionListPage = () => {
  const api = useAxios();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [title, setTitle] = useState("");

  const [total, setTotal] = useState<number>(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);


  const fetchData = async (offset? : number) => {
    try {
        const response = await api.get<PaginatedResult<Prescription>>(
                `prescriptions/all?limit=${7}&offset=${offset}`
        ); 
        console.log("Data Fetched. Response: ", response.data);
        const data = await response.data;
        console.log(data);
        setPrescriptions(data.results || []);
        setNextPage(data.next);
        setPreviousPage(data.previous);
        setTotal(data.count);
        console.log(`Prescriptions: ${prescriptions}`);
    } catch (error) {
      console.log(error);
      setPrescriptions([]);
    } finally {
      console.log("Data Fetched");
    }
  };

  useEffect(() => {
    fetchData(offset);
  }, [offset]);

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
          next={nextPage}
          previous={previousPage}
          totalCount={total}
          setOffset={setOffset}
          offset={offset}
            prescriptions={filteredPrescriptions}
          />
        </div>
    </div>
  );
};

export default PrescriptionListPage;
