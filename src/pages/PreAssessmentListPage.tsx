import { useState, useEffect, useMemo } from "react";
import useAxios from "../utils/UseAxios";
import { PreAssessment } from "../models/PreAssessmentInterface";
import PreAssessmentTabular from "../components/PreAssessmentTabular";
import SearchBar from "../components/SearchBar";
import { PaginatedResult } from "../models/PaginationInterface";

const PreAssesmentListPage = () => {
  const api = useAxios();

  const [preAssessments, setPreAssessments] = useState<PreAssessment[]>([]);

  const [total, setTotal] = useState<number>(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);

  // Used for search filtering
  const [firstName, setFirstName] = useState<string>("");

  const fetchData = async (offset?: number) => {
    try {
      const response = await api.get<PaginatedResult<PreAssessment>>(
              `pre-assessments/all?limit=${7}&offset=${offset}`
      ); 
      
      console.log("Data Fetched. Response: ", response.data);
      const data = await response.data;
      console.log(data);
      setPreAssessments(data.results || []);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setTotal(data.count);
      console.log(preAssessments);
    } catch (error) {
      console.log(`Error fetching data : ${error}`);
    }
  };

  const filteredAssessments = useMemo(() => {
    return preAssessments.filter((preAssessment) =>
      preAssessment.patient?.first_name
        .toLowerCase()
        .includes(firstName.toLowerCase())
    );
  }, [preAssessments, firstName]);

  useEffect(() => {
    fetchData(offset);
  }, [offset]);

  return (
    <div className="flex flex-1">
      <div className="h-full w-full p-7 flex justify-center flex-col">
        <div>
          <h1 className="text-5xl font-bold py-5 w-fit">Assessments</h1>
        </div>
        <div className="w-full flex justify-start gap-4 py-2">
          <div className="flex gap-4 items-center">
            <SearchBar
              placeholder="Search Patient..."
              search={firstName}
              setSearch={setFirstName}
            />
          </div>
        </div>
        <PreAssessmentTabular
          next={nextPage}
          previous={previousPage}
          totalCount={total}
          setOffset={setOffset}
          offset={offset}
          preassessments={filteredAssessments}
        />
      </div>
    </div>
  );
};

export default PreAssesmentListPage;
