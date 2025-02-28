import { useNavigate } from "react-router-dom";
import { PreAssessment } from "../models/PreAssessmentInterface";
import useAxios from "../utils/UseAxios";
import Swal from "sweetalert2";

interface Props {
  preassessments: PreAssessment[];
  fetchData: () => void;
}

const PreAssessmentTabular = ({ preassessments, fetchData }: Props) => {
  const api = useAxios();
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    navigate(`/preassessment/${id}`);
  };

  const handleDelete = async (index: number) => {
    Swal.fire({
      title: `Confirm Delete?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Delete",
      confirmButtonColor: "#F04444",
      denyButtonColor: "#6F7D7D",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire("Pre-Assessment Deleted!", "", "success");
        try {
          const response = await api.delete("/pre-assessment/delete", {
            params: { pre_assessmentID: index },
          });

          console.log(response.status);
          console.log(`Deteled ID : ${index}`);
          fetchData();
        } catch (error) {
          console.log(`Error in deleting pre-assessment : ${error}`);
        }
      } else if (result.isDenied) {
      }
    });
  };

  return (
    <div className="flex flex-col h-[34rem]  w-full my-5 shadow-lg rounded-lg overflow-hidden bg-white">
      <div className="h-[30rem] overflow-auto">
        <table className=" w-full table-fixed">
          <thead className="bg-[#03624C] text-left">
            <tr>
              <th className="px-4 py-4 text-white">Patient</th>
              <th className="px-4 py-4 text-white">Complaint</th>
              <th className="px-4 py-4 text-white">Temperature</th>
              <th className="px-4 py-4 text-white">Heart Rate</th>
              <th className="px-4 py-4 text-white">Blood Pressure</th>
            </tr>
          </thead>
          <tbody>
            {preassessments.map((preassessment, index) => (
              <tr
                className="hover:bg-green-100 border border-gray-300 cursor-pointer transition-colors ease-in-out duration-300 even:bg-slate-50"
                key={index}
                onClick={() =>
                  preassessment.id !== undefined &&
                  handleClick(preassessment.id)
                }
              >
                <td className="px-4 py-2 border-r border-gray-300">
                  <h2 className="font-semibold">
                    {preassessment.patient?.first_name}{" "}
                    {preassessment.patient?.last_name}
                  </h2>
                  <p className="text-gray-600 text-xs uppercase">
                    {preassessment.patient?.email}
                  </p>
                </td>
                <td className="px-4 py-2 border-r border-gray-300">
                  {preassessment.complaint}
                </td>
                <td className="px-4 py-2 border-r border-gray-300">
                  <div className="w-max inline-block">
                    {(() => {
                      const temperatureStr = preassessment.temperature;
                      const tempValue = parseFloat(temperatureStr);
                      const isFahrenheit = temperatureStr.includes("°F");

                      const normalMin = isFahrenheit ? 95.1 : 35.1;
                      const normalMax = isFahrenheit ? 100.3 : 37.9;

                      const bgColor =
                        tempValue >= normalMin && tempValue <= normalMax
                          ? "bg-green-500/20 text-green-900" // Normal
                          : tempValue < normalMin
                          ? "bg-red-500/20 text-red-900" // Low Temperature
                          : "bg-red-500/20 text-red-900"; // High Fever

                      return (
                        <div
                          className={`relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none py-1 px-2 text-xs rounded-md ${bgColor}`}
                          style={{ opacity: 1 }}
                        >
                          <span>{preassessment.temperature}</span>
                        </div>
                      );
                    })()}
                  </div>
                </td>

                <td className="px-4 py-2 border-r border-gray-300">
                  <div className="w-max inline-block">
                    {parseInt(preassessment.heart_rate) < 73 ? (
                      <div
                        className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-red-500/20 text-red-900 py-1 px-2 text-xs rounded-md"
                        style={{ opacity: 1 }}
                      >
                        <span className="">{preassessment.heart_rate} bpm</span>
                      </div>
                    ) : (
                      <div
                        className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none  bg-green-500/20 text-green-900 py-1 px-2 text-xs rounded-md"
                        style={{ opacity: 1 }}
                      >
                        <span className="">{preassessment.heart_rate} bpm</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 border-r border-gray-300">
                  <div className="w-max inline-block">
                    {(() => {
                      const bloodPressureStr = preassessment.blood_pressure;
                      const [systolic, diastolic] = bloodPressureStr
                        ? bloodPressureStr.split("/").map(Number)
                        : [0, 0];

                      let bgColor = "bg-green-500/20 text-green-900"; // Default to Normal

                      if (systolic < 90 || diastolic < 60) {
                        bgColor = "bg-red-500/20 text-red-900"; // Hypotension (Low BP)
                      } else if (systolic >= 140 || diastolic >= 90) {
                        bgColor = "bg-red-500/20 text-red-900"; // Hypertension (High BP)
                      } else if (systolic >= 121 || diastolic >= 81) {
                        bgColor = "bg-red-500/20 text-red-900"; // Pre-Hypertension
                      }
                      return (
                        <div
                          className={`relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none py-1 px-2 text-xs rounded-md ${bgColor}`}
                          style={{ opacity: 1 }}
                        >
                          <span>{preassessment.blood_pressure} mmHg</span>
                        </div>
                      );
                    })()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <PaginationControls
      offset={offset}
      totalCount={totalCount}
      next={next}
      previous={previous}
      setOffset={setOffset}
    /> */}
    </div>
  );
};

export default PreAssessmentTabular;
