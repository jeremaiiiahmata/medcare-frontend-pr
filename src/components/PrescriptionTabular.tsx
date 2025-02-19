import { Prescription } from "../models/PrescriptionInterface";

interface Props {
  prescriptions: Prescription[];
}

const PrescriptionTabular = ({ prescriptions }: Props) => {
  return (
    <div className="relative h-full w-full my-5 overflow-auto rounded-lg shadow-lg bg-white">
      <table className="w-full table-fixed text-center rtl:text-right">
        <thead className="bg-[#03624C]">
          <tr>
            <th className="px-6 py-4 text-white">Title</th>
            <th className="px-6 py-4 text-white">Description</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription, index) => (
            <tr
              className="hover:bg-green-50 border border-gray-300 cursor-pointer transition-colors ease-in-out duration-300"
              key={index}
            >
              <td className="px-6 py-4">
                {prescription.title}
              </td>
              <td className="px-6 py-4">{prescription.description}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrescriptionTabular;
