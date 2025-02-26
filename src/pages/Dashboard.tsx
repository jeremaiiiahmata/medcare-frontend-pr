import { useEffect, useState } from "react";
import useAxios from "../utils/UseAxios";
import { DashboardData } from "../models/DashboardInterface";

const Dashboard = () => {
  const api = useAxios();

  const [dashboard, setDashboard] = useState<DashboardData>();

  const fetchData = async () => {
    try {
      const response = await api.get("dashboard");
      console.log(response.data);
      setDashboard(response.data);
    } catch (error) {
      console.log(`Error fetching dashboard information : ${error}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-row justify-evenly pt-24 px-10 pb-4">
        <div className="w-10/12">
          <div className="flex flex-row">
            <div className="bg-no-repeat bg-emerald-500 border border-emerald-600 rounded-xl w-7/12 mr-2 p-6">
              <p className="text-5xl">
                Total
                <br />
                <strong>Patients</strong>
              </p>
              <span className="bg-emerald-300 text-5xl text-white inline-block rounded-xl mt-12 px-8 py-2">
                <strong>{dashboard?.total_patients}</strong>
              </span>
            </div>

            <div className="bg-no-repeat bg-emerald-200 border border-emerald-300 rounded-xl w-5/12 ml-2 p-6">
              <p className="text-5xl">
                Total <br />
                <strong>Prescriptions</strong> <br />
              </p>
              <p className="bg-emerald-700 text-5xl text-white inline-block rounded-xl mt-12 px-8 py-2">
                <strong>{dashboard?.total_prescriptions}</strong>
              </p>
            </div>
          </div>
          <div className="flex flex-row h-64 mt-6">
            <div className="bg-white rounded-xl shadow-lg px-6 py-4 w-4/12">
            <p className="text-5xl">
                Average <br />
                <strong>Patient Age</strong> <br />
              </p>
              <p className="bg-emerald-700 text-5xl text-white inline-block rounded-xl mt-12 px-8 py-2">
                <strong>{dashboard?.average_patient_age}</strong>
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg mx-6 px-6 py-4 w-4/12">
              <p className="text-5xl">
                Most Common <strong>Symptom</strong> <br />
              </p>
              <p className="bg-emerald-700 text-5xl text-white inline-block rounded-xl mt-12 px-8 py-2">
                <strong>None</strong>
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg px-6 py-4 w-4/12">
              <p className="text-5xl">
                Total <strong>Pre-Assessments</strong> <br />
              </p>
              <p className="bg-emerald-700 text-5xl text-white inline-block rounded-xl mt-12 px-8 py-2">
                <strong>{dashboard?.total_pre_assessments}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
