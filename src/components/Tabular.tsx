import { Patient } from "../models/PatientInterface";
import PaginationControls from "./PaginationControls";

interface Props {
  patients: Patient[];
  offset: number;
  totalCount: number;
  next: string | null;
  previous: string | null;
  setOffset: (offset: number) => void;
  setSelectedPatient: (patient: Patient) => void;
}

const Tabular = ({
  patients,
  offset,
  totalCount,
  next,
  previous,
  setOffset,
  setSelectedPatient,
}: Props) => {
  return (
    <div className="flex flex-col h-[34rem]  w-full my-5 shadow-lg rounded-lg overflow-hidden bg-white">
      <div className="h-[30rem] overflow-auto">
        <table className=" w-full table-fixed">
          <thead className="bg-[#03624C] text-left">
            <tr>
              <th className="px-4 py-4 text-white">Name</th>
              <th className="px-4 py-4 text-white">Blood Type</th>
              <th className="px-4 py-4 text-white">Gender</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr
                className="hover:bg-green-100 border border-gray-300 cursor-pointer transition-colors ease-in-out duration-300 even:bg-slate-50"
                key={index}
                onClick={() => {
                  setSelectedPatient(patient);
                }}
              >
                <td className="px-4 py-2 border-r border-gray-300">
                  <h2>
                    {patient.first_name} {patient.last_name}
                  </h2>
                  <p className="text-gray-600 text-xs uppercase">
                    {patient.email}
                  </p>
                </td>
                <td className="px-4 py-2 border-r border-gray-300">
                  {patient.blood_type}
                </td>
                <td className="px-4 py-2">{patient.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls
        offset={offset}
        totalCount={totalCount}
        next={next}
        previous={previous}
        setOffset={setOffset}
      />
    </div>
  );
};

export default Tabular;
