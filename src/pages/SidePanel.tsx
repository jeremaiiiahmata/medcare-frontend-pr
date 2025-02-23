import Modal from "../components/Modal";
import PrimaryBtn from "../components/PrimaryBtn";
import { Patient } from "../models/PatientInterface";
import { MdModeEdit, MdOutlineMail, MdOutlineDelete } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import ProfilePicture from "../components/ProfilePicture";
import RedButton from "../components/RedButton";
import useAxios from "../utils/UseAxios";

interface Props {
  patient: Patient;
  setSelectedPatient: (value: Patient | null) => void;
}

const SidePanel = ({ patient, setSelectedPatient }: Props) => {
  const api = useAxios();

  const deletePatient = async (patient: Patient) => {
    try {
      const response = await api.delete(
        `/patient/delete?patient_id=${patient.id}`
      );

      if (response.status === 200) {
        console.log(`Patient ${patient.id} successfully deleted`);
        setSelectedPatient(null);
      } else {
        console.log("Delete failed", response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = api.get("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      setIsOpen={() => {
        setSelectedPatient(null);
      }}
      title="Patient Profile"
    >
      <div className="flex gap-3 h-full">
        {/* Personal details */}
        <div className="rounded-lg shadow-lg w-2xs p-4 h-full">
          <div className="w-full flex justify-center mb-8">
            <div className="flex flex-col gap-4 items-center">
              <ProfilePicture />

              <div className="flex justify-between gap-2">
                <PrimaryBtn
                  onClick={() => {
                    console.log("Edit");
                  }}
                  type="button"
                >
                  <MdModeEdit size={16} />
                  Edit
                </PrimaryBtn>
                <RedButton
                  type="button"
                  onClick={() => {
                    deletePatient(patient);
                  }}
                >
                  <MdOutlineDelete size={20} />
                </RedButton>
              </div>
            </div>
          </div>

          {/* About */}
          <h2 className="text-lg font-semibold text-green-800 mb-2">About</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              {/* Name */}
              <h3>Name</h3>
              <p>
                {patient.first_name} {patient.last_name}
              </p>
            </div>
            <div className="flex flex-col">
              {/* Contacts */}
              <h3>Contacts</h3>
              <p className="flex items-center">
                <MdOutlineMail size={20} />
                {patient.email}
              </p>
              <p className="flex items-center">
                <BsTelephone size={20} />
                {patient.contact_number}
              </p>
            </div>
            <div className="flex flex-col">
              {/* Address */}
              <h3>Address</h3>
              <p>{patient.address}</p>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="rounded-lg shadow-lg w-1/3 flex-auto p-4 flex flex-col gap-2">
          <div className="flex justify-center items-center gap-5 text-sm font-semibold">
            <label className="hover:text-emerald-800">Medical Details</label>
            <label className="hover:text-emerald-800">Prescriptions</label>
            <label className="hover:text-emerald-800">Pre-assessment</label>
          </div>
          <div className="bg-amber-200 flex flex-auto h-full"></div>
        </div>
      </div>
    </Modal>
  );
};

export default SidePanel;
