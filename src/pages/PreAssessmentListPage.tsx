import { useState, useEffect, useMemo } from "react";
import useAxios from "../utils/UseAxios";
import { PreAssessment } from "../models/PreAssessmentInterface";
import PreAssessmentTabular from "../components/PreAssessmentTabular";
import Modal from "../components/Modal";
import SearchBar from "../components/SearchBar";
import PrimaryBtn from "../components/PrimaryBtn";

const PreAssesmentListPage = () => {
  const api = useAxios();
  const patientId = 1; // hard-coded pa. get the patientID na clinick through props?

  const [preAssessments, setPreAssessments] = useState<PreAssessment[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await api.get("pre-assessments/all");
      console.log("Data Fetched.");
      setPreAssessments(response.data.data);
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
    fetchData();
  }, []);

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
          preassessments={filteredAssessments}
          fetchData={fetchData}
        />
      </div>
    </div>
  );
};

export default PreAssesmentListPage;
