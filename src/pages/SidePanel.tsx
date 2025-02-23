import Modal from "../components/Modal";
import PrimaryBtn from "../components/PrimaryBtn";
import { Patient } from "../models/PatientInterface";
import { MdModeEdit, MdOutlineMail, MdOutlineDelete } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import ProfilePicture from "../components/ProfilePicture";
import RedButton from "../components/RedButton";
import useAxios from "../utils/UseAxios";
import { Prescription } from "../models/PrescriptionInterface";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  patient: Patient;
  setSelectedPatient: (value: Patient | null) => void;
}

const SidePanel = ({ patient, setSelectedPatient }: Props) => {
  const api = useAxios();

  const [patientPrescriptions, setPatientPrescriptions] = useState<
    Prescription[]
  >([]);

  const deletePatient = async () => {
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
      const response = await api.get(`/prescriptions/${patient.id}`);
      const prescriptions = await response.data;

      setPatientPrescriptions(prescriptions.data);
      console.log(patientPrescriptions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

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
                  {/* <MdModeEdit size={16} /> */}
                  Edit
                </PrimaryBtn>
                <RedButton
                  type="button"
                  onClick={() => {
                    deletePatient;
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
        <div className="w-1/3 flex-auto  flex flex-col gap-2">
          <div className="flex justify-center items-center gap-5 text-sm font-semibold">
            <label className="hover:text-emerald-800">Medical Details</label>
            <label className="hover:text-emerald-800">Prescriptions</label>
            <label className="hover:text-emerald-800">Pre-assessment</label>
          </div>
          <div className="border border-gray-300 rounded-md flex flex-auto h-full p-2 flex-col gap-2 overflow-y-auto">
            {patientPrescriptions.length > 0 ? (
              patientPrescriptions.map((prescription, index) => (
                <Link to={`/prescription/${prescription.id}`} key={index}>
                  <div className="bg-emerald-50 shadow-md w-full p-2 transition-all duration-150 hover:border-emerald-300 rounded-md border border-transparent hover:border">
                    <h2 className="font-semibold">Prescription Title: </h2>
                    {prescription.title}
                    <h2 className="font-semibold">Date Created:</h2>
                    {prescription.date_created}
                  </div>
                </Link>
              ))
            ) : (
              <div className="h-full w-full flex justify-center items-center">
                <h2 className="text-lg font-semibold text-emerald-800/60">
                  Patient has no prescriptions
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SidePanel;
