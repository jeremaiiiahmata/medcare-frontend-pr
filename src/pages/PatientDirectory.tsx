import { FormEvent, useContext, useEffect, useState } from "react";
import PrimaryBtn from "../components/PrimaryBtn";
import Tabular from "../components/Tabular";
import { Patient } from "../models/PatientInterface";
import AuthContext from "../context/AuthContext";
import Modal from "../components/Modal";
import SearchBar from "../components/SearchBar";
import useAxios from "../utils/UseAxios";
import SidePanel from "./SidePanel";

const PatientDirectory = () => {
  const authContext = useContext(AuthContext);
  const api = useAxios();

  if (!authContext) {
    throw new Error("PrivateRoute must be used within an AuthProvider");
  }

  const { authTokens, user } = authContext;

  if (!authTokens) {
    throw new Error("No tokens");
  } else if (!user) {
    throw new Error("No user");
  }

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  //new patient usestates
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [address, setAddress] = useState<string>("");
  const [bloodType, setBloodType] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [weight, setWeight] = useState<number>(0);
  const [seniorId, setSeniorId] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");

  const addPatient = async (e: FormEvent) => {
    e.preventDefault();

    const newPatient: Patient = {
      doctor: user.user_id, // use id based on current user
      first_name: firstName,
      last_name: lastName,
      email: email,
      age: age,
      address: address,
      blood_type: bloodType,
      contact_number: contact,
      gender: gender,
      id_number: seniorId,
      weight: weight,
      allergies: allergies,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/create-patient", {
        method: "POST",
        body: JSON.stringify(newPatient),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });

      if (!response) {
        throw new Error(`Error! status: ${response}`);
      }

      const newData = await response.json();
      console.log("New Patient added!", newData);

      fetchPatients();

      handleClear();
      setIsOpen(!isOpen);
      fetchPatients();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setAge(0);
    setBloodType("");
    setContact("");
    setGender("");
    setWeight(0);
    setSeniorId("");
    setAllergies("");
    setAddress("");
  };
  const fetchPatients = async () => {
    try {
      const response = await api.get("/patients");
      const data = await response.data;
      setPatients(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPatients(); // Initial data fetch
  }, []);

  return (
    <div className="h-full w-full p-7 flex justify-center flex-col">
      {isOpen && (
        <Modal title="Add Patient" setIsOpen={setIsOpen}>
          <div className="border rounded-full my-2"></div>
          <form onSubmit={addPatient}>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between">
                <div className="flex flex-col w-60">
                  <label>First Name</label>
                  <input
                    className="border rounded-md px-2 border-gray-300"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col w-60">
                  <label>Last Name</label>
                  <input
                    className="border rounded-md px-2 border-gray-300"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex">
                <label>Email Address</label>
                <input
                  className="border rounded-md px-2 border-gray-300"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="flex">
                <label>Address</label>
                <input
                  className="border rounded-md px-2 border-gray-300"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                />
              </div>
              <div className="flex">
                <label>Contact Number</label>
                <input
                  className="border rounded-md px-2 border-gray-300"
                  placeholder="Contact Number"
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                  }}
                />
              </div>
              <div className="flex">
                <label>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                  className="border rounded-md px-2 border-gray-300"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="flex">
                <label>Blood Type</label>
                <select
                  className="border rounded-md px-2 border-gray-300"
                  value={bloodType}
                  onChange={(e) => {
                    setBloodType(e.target.value);
                  }}
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="flex">
                <label>Age</label>
                <input
                  type="number"
                  className="border rounded-md px-2 border-gray-300"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => {
                    setAge(parseInt(e.target.value));
                  }}
                />
              </div>
              <div className="flex">
                <label>Weight</label>
                <input
                  type="number"
                  className="border rounded-md px-2 border-gray-300"
                  placeholder="Weight"
                  value={weight}
                  onChange={(e) => {
                    setWeight(parseFloat(e.target.value));
                  }}
                />
              </div>
              <div className="flex">
                <label>Senior ID</label>
                <input
                  className="border rounded-md px-2 border-gray-300"
                  placeholder="Senior ID"
                  value={seniorId}
                  onChange={(e) => {
                    setSeniorId(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col">
                <label>Allergies</label>
                <textarea
                  className="border rounded-md px-2 border-gray-300"
                  placeholder="Enter Allergies Here.."
                  value={allergies}
                  onChange={(e) => {
                    setAllergies(e.target.value);
                  }}
                />
              </div>
              <PrimaryBtn type="submit">Submit</PrimaryBtn>
            </div>
          </form>
        </Modal>
      )}
      {selectedPatient && (
        <SidePanel
          patient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
        />
      )}
      <div className="w-full flex justify-between">
        <div className="flex gap-4 items-center">
          <SearchBar
            placeholder="Search Patient..."
            search={firstName}
            setSearch={setFirstName}
          />
          <div>Filter Here</div>
        </div>
        <PrimaryBtn
          type="button"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Add Patient
        </PrimaryBtn>
      </div>
      <Tabular patients={patients} setSelectedPatient={setSelectedPatient} />
    </div>
  );
};

export default PatientDirectory;
