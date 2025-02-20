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
      confirmButtonColor: '#F04444',
      denyButtonColor: "#6F7D7D"
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire("Pre-Assessment Deleted!", "", "success");
          try {

            const response = await api.delete("/pre-assessment/delete", { 
              params : { pre_assessmentID : index}
            })
            
            console.log(response.status)
            console.log(`Deteled ID : ${index}`);
            fetchData();
          } catch (error) {
            console.log(`Error in deleting pre-assessment : ${error}`)
          }
        } else if (result.isDenied) {
      }
    });
  } 
  

  return (
    <div className="relative h-full w-full my-5 overflow-auto rounded-lg shadow-lg bg-white">
      <table className="w-full table-auto text-center rtl:text-right">
        <thead className="bg-[#03624C]">
          <tr>
            <th className="px-6 py-4 text-white">Title</th>
            <th className="px-6 py-4 text-white">Complaint</th>
            <th className="px-6 py-4 text-white">Date Created</th>
            <th className="py-4 text-white"></th>
            <th className="py-4 text-white"></th>
          </tr>
        </thead>
        <tbody>
          {preassessments.map((preassessment, index) => (
            <tr
              className="hover:bg-green-50 border border-gray-300 cursor-pointer transition-colors ease-in-out duration-300"
              key={index}
            >
            <td className="px-6 py-4">
                {preassessment.title}
            </td>
          
            <td className="px-6 py-4">
                {preassessment.complaint}
            </td>

            <td className="px-6 py-4">
                {preassessment.date_created}
            </td>

            <td className="px-6 py-4" colSpan={2}>
              <div className="flex justify-center items-center space-x-10">
                <button
                  className="bg-red-700 px-5 py-2 rounded-md text-white font-bold cursor-pointer"
                  onClick={() =>
                    preassessment.id !== undefined && handleDelete(preassessment.id)
                  }
                >
                  Delete
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
