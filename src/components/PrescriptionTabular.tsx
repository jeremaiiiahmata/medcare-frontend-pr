import { Link, useNavigate } from "react-router-dom";
import { Prescription } from "../models/PrescriptionInterface";
import Swal from "sweetalert2";
import useAxios from "../utils/UseAxios";

interface Props {
  prescriptions: Prescription[];
  fetchData: () => void;
}

const PrescriptionTabular = ({ prescriptions, fetchData }: Props) => {
  const api = useAxios();
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    navigate(`/prescription/${id}`);
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
        Swal.fire("Prescription Deleted!", "", "success");
        try {
          const response = await api.delete(
            `/prescription/delete?prescription_id=${index}`
          );
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
              <th className="px-4 py-4 text-white">Title</th>
              <th className="px-4 py-4 text-white">Description</th>
              <th className="px-4 py-4 text-white">Date Created</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription, index) => (
              <tr
                className="hover:bg-green-100 border border-gray-300 cursor-pointer transition-colors ease-in-out duration-300 even:bg-slate-50"
                key={index}
                onClick={() =>
                  prescription.id !== undefined &&
                  handleClick(prescription.id)
                }
              >
                <td className="px-4 py-2 border-r border-gray-300">
                  <h2 className="font-semibold">
                    {prescription.patient?.first_name}{" "}
                    {prescription.patient?.last_name}
                  </h2>
                  <p className="text-gray-600 text-xs uppercase">
                    {prescription.patient?.email}
                  </p>
                </td>
                <td className="px-4 py-2 border-r border-gray-300">
                  {prescription.title}
                </td>
                <td className="px-4 py-2 border-r border-gray-300">
                 {prescription.description}
                </td>
                <td className="px-4 py-2 border-r border-gray-300">
                 {prescription.date_created}
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

export default PrescriptionTabular;
