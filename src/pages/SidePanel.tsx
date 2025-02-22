import Modal from "../components/Modal";
import PrimaryBtn from "../components/PrimaryBtn";
import { Patient } from "../models/PatientInterface";
import { MdModeEdit, MdOutlineMail, MdOutlineDelete } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import ProfilePicture from "../components/ProfilePicture";
import RedButton from "../components/RedButton";

interface Props {
  patient: Patient;
  setSelectedPatient: (value: Patient | null) => void;
}

const SidePanel = ({ patient, setSelectedPatient }: Props) => {
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
                    console.log("delete");
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
        <div className="rounded-lg shadow-lg w-1/3 flex-auto p-4 h-full flex flex-col gap-2">
          <div className="flex justify-center items-center gap-5 text-sm font-semiboldx">
            <label className="hover:text-emerald-800">Medical Details</label>
            <label className="hover:text-emerald-800">Prescriptions</label>
            <label className="hover:text-emerald-800">Preassessment</label>
          </div>
          <div className="bg-amber-200 flex flex-auto"></div>
        </div>
      </div>
    </Modal>
  );
};

export default SidePanel;
