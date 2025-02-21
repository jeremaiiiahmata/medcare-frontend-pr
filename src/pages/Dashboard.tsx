import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/UseAxios";
import { DashboardData } from "../models/DashboardInterface";

interface JwtPayload {
  user_id: string;
}

const Dashboard = () => {
  //grab the user and logoutUser context
  const context = useContext(AuthContext);
  const api = useAxios();

  const [dashboard, setDashboard] = useState<DashboardData>();

  const fetchData = async () => {
    try {
      const response = await api.get("dashboard");
      console.log(response.data);
      setDashboard(response.data);
    } catch (error) {
      
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
  <div className="flex flex-row justify-evenly pt-24 px-10 pb-4">
    
    <div className="w-10/12">
      <div className="flex flex-row">
        <div className="bg-no-repeat bg-red-200 border border-red-300 rounded-xl w-7/12 mr-2 p-6">
          <p className="text-5xl text-indigo-900">Total<br/><strong>Patients</strong></p>
          <span className="bg-red-300 text-xl text-white inline-block rounded-full mt-12 px-8 py-2"><strong>{dashboard?.total_patients}</strong></span>
        </div>

        <div className="bg-no-repeat bg-orange-200 border border-orange-300 rounded-xl w-5/12 ml-2 p-6">
          <p className="text-5xl text-indigo-900">Inbox <br/><strong>23</strong></p>
          <a href="" className="bg-orange-300 text-xl text-white underline hover:no-underline inline-block rounded-full mt-12 px-8 py-2"><strong>See messages</strong></a>
        </div>
      </div>
      <div className="flex flex-row h-64 mt-6">
        <div className="bg-white rounded-xl shadow-lg px-6 py-4 w-4/12">
          a
        </div>
        <div className="bg-white rounded-xl shadow-lg mx-6 px-6 py-4 w-4/12">
          b
        </div>
        <div className="bg-white rounded-xl shadow-lg px-6 py-4 w-4/12">
          c
        </div>
      </div>
    </div>
  </div>
    </>
  );
};

export default Dashboard;
