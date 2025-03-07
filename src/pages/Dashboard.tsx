import { useEffect, useState } from "react";
import useAxios from "../utils/UseAxios";
import { DashboardData } from "../models/DashboardInterface";
import { Patient } from "../models/PatientInterface";

const Dashboard = () => {
  const api = useAxios();

  const [dashboard, setDashboard] = useState<DashboardData>();

  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <span
        className={`ml-2 text-sm font-semibold px-3 py-1 rounded-full ${
          isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {isPositive ? `+${growth}%` : `${growth}%`}
      </span>
    );
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("dashboard");
      console.log(response.data);
      setDashboard(response.data);
      setRecentPatients(response.data.recent_patients || []);
    } catch (error) {
      console.log(`Error fetching dashboard information : ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="bg-[#F5F6FA] min-h-screen h-screen flex flex-col">
        <div className="w-full p-7 flex-1 overflow-hidden">
          <h1 className="text-5xl font-bold text-[#030F0F] py-3 mt-4">Dashboard</h1>
          <h2 className="text-xl font-bold text-[#085543] py-1 mb-4">{dashboard?.greeting}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* <!-- Total Patients Card --> */}
            <div className="stat-card patient-card p-6 bg-[#469B7E] rounded-lg shadow border border-gray-100">
              <div className="flex items-center mb-2">
                <div className="rounded-full bg-emerald-100 bg-opacity-20 p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#03624C]"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-white">
                  Total Patients
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-7xl font-bold text-white">
                  {dashboard?.total_patients.count}
                </span>
                {dashboard && formatGrowth(dashboard.total_patients.growth)}
              </div>
              <p className="text-xs text-white text-opacity-80 mt-2">
                Overall patient count since account creation
              </p>
            </div>

            {/* <!-- Total Prescriptions Card --> */}
            <div className="stat-card prescription-card p-6 bg-[#469B7E] rounded-lg shadow border border-gray-100">
              <div className="flex items-center mb-2">
                <div className="rounded-full bg-emerald-100 p-2 mr-2">
                  {/* Pill Capsule Icon for Prescriptions */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#03624C]"
                    fill="currentColor"
                    viewBox="0 -1 17 20"
                  >
                    <path d="M1.828 8.9 8.9 1.827a4 4 0 1 1 5.657 5.657l-7.07 7.071A4 4 0 1 1 1.827 8.9Zm9.128.771 2.893-2.893a3 3 0 1 0-4.243-4.242L6.713 5.429z" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-white">
                  Total Prescriptions
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-7xl font-bold text-white">
                  {dashboard?.total_prescriptions.count}
                </span>
                {dashboard &&
                  formatGrowth(dashboard.total_prescriptions.growth)}
              </div>
              <p className="text-xs text-white mt-2">
                Overall prescription count since account creation
              </p>
            </div>

            {/* <!-- Total Pre-Assessments Card --> */}
            <div className="stat-card assessment-card p-6 bg-[#469B7E] rounded-lg shadow border border-gray-100">
              <div className="flex items-center mb-2">
                <div className="rounded-full bg-emerald-100 p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#03624C]"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7"
                    />
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                  </svg>
                </div>
                <span className="text-lg text-white font-medium">
                  Total Assessments
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-7xl font-bold text-white">
                  {dashboard?.total_pre_assessments.count}
                </span>
                {dashboard &&
                  formatGrowth(dashboard.total_pre_assessments.growth)}
              </div>
              <p className="text-xs text-white mt-2">
                Overall assessment count since account creation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat-card bg-white p-6 md:col-span-2 rounded-lg shadow border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Recently Added Patient
              </h2>

              {loading ? (
                <p className="text-gray-600">
                  Loading recently added patients...
                </p>
              ) : recentPatients.length > 0 ? (
                <div className="flex flex-col w-full my-5 shadow-md rounded-lg overflow-hidden bg-white">
                  <table className=" w-full table-fixed">
                    <thead className="bg-[#03624C] text-left">
                      <tr>
                        <th className="px-4 py-4 text-white">Name</th>
                        <th className="px-4 py-4 text-white">Contact Number</th>
                        <th className="px-4 py-4 text-white">Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPatients.map((patient) => (
                        <tr
                          key={patient.id}
                          className="hover:bg-green-100 border border-gray-300 cursor-pointer transition-colors ease-in-out duration-300 even:bg-slate-50"
                        >
                          <td className="px-4 py-2 border-r border-gray-300">
                            {patient.first_name} {patient.last_name}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-300">
                            {patient.contact_number}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-300">
                            {patient.age}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No recent patients found.</p>
              )}
            </div>

            {/* <!-- Right Column --> */}
            <div className="space-y-6">
              {/* <!-- Average Patient Age Card --> */}
              <div className="stat-card bg-white p-6 rounded-lg shadow border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="rounded-full bg-gray-100 p-2 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-lg font-medium">
                    Average Patient Age
                  </span>
                </div>
                <div className="flex items-baseline justify-center">
                  <span className="text-7xl font-bold text-gray-800">
                    {dashboard?.average_patient_age}
                  </span>
                </div>
                <p className="text-lg text-gray-500 mt-2 text-center">
                  Based from all patient's age
                </p>
              </div>

              {/* <!-- Top 3 Symptoms Card --> */}
              <div className="stat-card bg-white p-6 rounded-lg shadow border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Top 3 Prescribed Medications
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                  Based from all patient's prescriptions
                </p>

                <div className="space-y-2">
                  {dashboard?.top_3_prescribed_medications?.length ?? 0 > 0 ? (
                    dashboard?.top_3_prescribed_medications?.map(
                      (med, index) => (
                        <li key={index} className="text-gray-800 font-medium">
                          {med.charAt(0).toUpperCase() + med.slice(1)}
                        </li>
                      )
                    ) 
                  ) : (
                    <p className="text-gray-500">
                      No prescription data available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
