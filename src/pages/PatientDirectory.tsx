import { useContext, useEffect, useState } from "react";
import PrimaryBtn from "../components/PrimaryBtn";
import Tabular from "../components/Tabular";
import { Patient } from "../models/PatientInterface";
import AuthContext from "../context/AuthContext";
import Modal from "../components/Modal";

const PatientDirectory = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("PrivateRoute must be used within an AuthProvider");
  }

  const { authTokens } = authContext;

  if (!authTokens) {
    //temporary
    throw new Error("No tokens");
  }

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/patients", {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        });

        const data = await response.json();

        setPatients(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPatients();
    console.log(patients);
  }, []);

  return (
    <div className="h-full w-full p-7 flex justify-center flex-col">
      {isOpen ? (
        <Modal title="Add Patient" setIsOpen={setIsOpen}>
          <div className="border rounded-full my-2"></div>
          <form>
            <div className="flex flex-col gap-6">
              <div className="flex">
                <div className="flex flex-col">
                  <label>First Name</label>
                  <input placeholder="First Name" />
                </div>
                <div className="flex flex-col">
                  <label>Last Name</label>
                  <input placeholder="Last Name" />
                </div>
              </div>
              <div className="flex">
                <label>Gender</label>
                <select>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="flex">
                <label>Blood Type</label>
                <select>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
              <div className="flex">
                <label>Email Address</label>
                <input placeholder="Email Address" />
              </div>
              <div className="flex">
                <label>Contact Number</label>
                <input placeholder="Contact Number" />
              </div>
              <div className="flex">
                <label>Age</label>
                <input placeholder="Age" />
              </div>
              <div className="flex">
                <label>Senior ID</label>
                <input placeholder="Senior ID" />
              </div>
              <div className="flex flex-col">
                <label>Allergies</label>
                <textarea />
              </div>
              <PrimaryBtn type="submit">Submit</PrimaryBtn>
            </div>
          </form>
        </Modal>
      ) : (
        <></>
      )}
      <div className="w-full flex justify-between">
        <div className="flex gap-4">
          <div>Search Bar Here</div>
          <div>Filter Here</div>
        </div>
        <PrimaryBtn
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          Add Patient
        </PrimaryBtn>
      </div>
      <Tabular patients={patients} />
    </div>
  );
};

export default PatientDirectory;
