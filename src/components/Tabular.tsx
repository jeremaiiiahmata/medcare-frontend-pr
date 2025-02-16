import { Patient } from "../models/PatientInterface";

interface Props {
  patients: Patient[];
}

const Tabular = ({ patients }: Props) => {
  return (
    <div className="relative h-full w-full overflow-auto rounded-lg shadow-lg bg-white">
      <table className="w-full table-fixed text-center rtl:text-right">
        <thead className="bg-green-800">
          <tr>
            <th className="px-6 py-4 text-white">Name</th>
            <th className="px-6 py-4 text-white">Email</th>
            <th className="px-6 py-4 text-white">Blood Type</th>
            <th className="px-6 py-4 text-white">Gender</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr
              className="hover:bg-green-50 border border-gray-300 cursor-pointer transition-colors ease-in-out duration-300"
              key={index}
            >
              <td className="px-6 py-4">
                {patient.first_name} {patient.last_name}
              </td>
              <td className="px-6 py-4">{patient.email}</td>
              <td className="px-6 py-4">{patient.blood_type}</td>
              <td className="px-6 py-4">{patient.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tabular;
