import { PreAssessment } from "../models/PreAssessmentInterface";


interface Props {
    preassessments: PreAssessment[];
}

const PreAssessmentTabular = ({ preassessments }: Props) => {
  return (
    <div className="relative h-full w-full my-5 overflow-auto rounded-lg shadow-lg bg-white">
      <table className="w-full table-fixed text-center rtl:text-right">
        <thead className="bg-[#03624C]">
          <tr>
            <th className="px-6 py-4 text-white">Complaint</th>
            <th className="px-6 py-4 text-white">Heart Rate</th>
            <th className="px-6 py-4 text-white">Date Created</th>
          </tr>
        </thead>
        <tbody>
          {preassessments.map((preassessment, index) => (
            <tr
              className="hover:bg-green-50 border border-gray-300 cursor-pointer transition-colors ease-in-out duration-300"
              key={index}
            >
            <td className="px-6 py-4">
                {preassessment.complaint}
            </td>
            
            <td className="px-6 py-4">
                {preassessment.heart_rate}
            </td>

            <td className="px-6 py-4">
                {preassessment.date_created}
            </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreAssessmentTabular;
