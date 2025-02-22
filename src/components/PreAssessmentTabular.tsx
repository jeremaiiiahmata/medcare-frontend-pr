import { Link } from "react-router-dom";
import { PreAssessment } from "../models/PreAssessmentInterface";
import useAxios from "../utils/UseAxios";
import Swal from "sweetalert2";

interface Props {
  preassessments: PreAssessment[];
  fetchData: () => void;
}

const PreAssessmentTabular = ({ preassessments, fetchData }: Props) => {
  const api = useAxios();

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
    <div className="relative h-full w-full my-5 overflow-auto rounded-lg shadow-lg  bg-white">
      <table className="w-full min-w-max table-auto text-left">
        <thead className="bg-[#03624C] text-center">
          <tr>
          <th className="bg-blue-gray-50/50 px-6 py-4">
              <p className="block antialiased leading-none text-white font-semibold">
                Patient Name
              </p>
            </th>
            <th className="bg-blue-gray-50/50 px-6 py-4">
              <p className="block antialiased leading-none text-white font-semibold">
                Title
              </p>
            </th>
            <th className="bg-blue-gray-50/50 px-6 py-4">
              <p className="block antialiased leading-none text-white font-semibold">
                Complaint
              </p>
            </th>
            <th className="bg-blue-gray-50/50 px-6 py-4">
              <p className="block antialiased leading-none text-white font-semibold">
                Temperature
              </p>
            </th>
            <th className="bg-blue-gray-50/50 px-6 py-4">
              <p className="block antialiased leading-none text-white font-semibold">
                Heart Rate
              </p>
            </th>
            <th className="bg-blue-gray-50/50 px-6 py-4">
              <p className="block antialiased leading-none text-white font-semibold">
                Symptoms
              </p>
            </th>
            <th className="bg-blue-gray-50/50 px-6 py-4">
              <p className="block antialiased leading-none text-white font-semibold text-center">
                Actions
              </p>
            </th>
          </tr>
        </thead>
        <tbody>
          {preassessments.map((preassessment, index) => (
            <tr key={index}>
              <td className="p-4 border-b border-blue-gray-">
                <div className="text-center">
                  <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                    {preassessment.patient?.first_name} {preassessment.patient?.last_name}
                  </p>
                </div>
              </td>
              <td className="p-4 border-b border-blue-gray-">
                <div className="text-center">
                  <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                    {preassessment.title}
                  </p>
                </div>
              </td>
              <td className="p-4 border-b border-blue-gray-50 text-center">
                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                  {preassessment.complaint}
                </p>
              </td>
              <td className="p-4 border-b border-blue-gray-50 text-center">
                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                  {preassessment.temperature}
                </p>
              </td>
              <td className="p-4 border-b border-blue-gray-50 text-center">
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
              <td className="p-4 border-b border-blue-gray-50 text-center">
                <div className="text-center">
                  <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900">
                    {preassessment.symptoms}
                  </p>
                </div>
              </td>
              <td className="p-4 border-b border-blue-gray-50 text-center">
                <div className="inline-block">
                  {preassessment.id ? (
                    <Link to={`/preassessment/${preassessment.id}`}>
                      <button
                        className="cursor-pointer relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs mx-1 text-gray-900 hover:bg-gray-500/70 active:bg-gray-500/90"
                        type="button"
                      >
                        <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                          <svg
                            className="w-6 h-6 text-gray-800 dark:text-black"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
                            />
                          </svg>
                        </span>
                      </button>
                    </Link>
                  ) : (
                    <span className="text-red-500">No ID</span>
                  )}

                  <button
                    className="cursor-pointer relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs mx-1 text-gray-900 hover:bg-gray-500/70 active:bg-gray-500/90"
                    type="button"
                  >
                    <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="h-4 w-4"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                      </svg>
                    </span>
                  </button>

                  <button
                    className="cursor-pointer relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs mx-1 text-gray-900 hover:bg-gray-500/70 active:bg-gray-500/90"
                    type="button"
                    onClick={() =>
                      preassessment.id !== undefined &&
                      handleDelete(preassessment.id)
                    }
                  >
                    <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <svg
                        className="w-6 h-6 text-red-800 dark:text-red"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreAssessmentTabular;
