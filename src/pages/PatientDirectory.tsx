import { FormEvent, useContext, useEffect, useState, useMemo } from "react";
import PrimaryBtn from "../components/PrimaryBtn";
import Tabular from "../components/Tabular";
import { Patient } from "../models/PatientInterface";
import AuthContext from "../context/AuthContext";
import Modal from "../components/Modal";
import SearchBar from "../components/SearchBar";
import useAxios from "../utils/UseAxios";
import SidePanel from "./SidePanel";
import { PaginatedResult } from "../models/PaginationInterface";

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
  const [weightUnit, setWeightUnit] = useState("kg");

  //new patient usestates
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [streetName, setStreetName] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [bloodType, setBloodType] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [weight, setWeight] = useState<number>(0);
  const [seniorId, setSeniorId] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");

  const [search, setSearch] = useState<string>("");
  const patientWeight = `${weight} ${weightUnit}`

  //pagination
  const [total, setTotal] = useState<number>(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);

  const patientWeight = `${weight} ${weightUnit}`;

  const addPatient = async (e: FormEvent) => {
    e.preventDefault();

    const newPatient: Patient = {
      doctor: user.user_id, // use id based on current user
      first_name: firstName,
      last_name: lastName,
      email: email,
      age: age,
      street_name: streetName,
      city: city,
      state_province: province,
      postal_code: postalCode,
      blood_type: bloodType,
      contact_number: contact,
      gender: gender,
      id_number: seniorId,
      weight: patientWeight,
      allergies: allergies,
    };

    try {
      const response = await api.post("/create-patient", newPatient)

      console.log(response.data);
      console.log("New Patient added!");

      fetchPatients(offset);

      handleClear();
      setIsOpen(!isOpen);
      fetchPatients(offset);
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
    setStreetName("");
  };

    const filteredPatient = useMemo(() => {
      return patients.filter(patient =>
        patient.first_name.toLowerCase().includes(firstName.toLowerCase())
      );
    }, [patients, search]);

  const fetchPatients = async (offset: number) => {
    try {
      const response = await api.get<PaginatedResult<Patient>>(
        `/patients?limit=${7}&offset=${offset}`
      );
      const data = await response.data;
      setPatients(() => data.data); 
      console.log(data);
      setPatients(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setTotal(data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPatients(offset); // Initial data fetch
  }, [offset]);

  return (
    <div className="h-full w-full px-5 flex justify-center flex-col">
      <div>
        <h1 className="text-5xl font-bold py-5 w-fit">Patients</h1>
      </div>
      {isOpen && (
         <Modal title="Add Patient" setIsOpen={setIsOpen}>
        <div className="border rounded-full my-2"></div>
        <form onSubmit={addPatient}>
          <div className="flex flex-col gap-6">
            {/* Row 1: First Name & Last Name */}
            <div className="flex gap-4">
              <div className="flex flex-col w-1/2">
                <label>First Name</label>
                <input
                  className="border rounded-md px-2 border-gray-300"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label>Last Name</label>
                <input
                  className="border rounded-md px-2 border-gray-300"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
      
            {/* Row 2: Email Address */}
            <div className="flex flex-col">
              <label>Email Address</label>
              <input
                className="border rounded-md px-2 border-gray-300"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
      
            {/* Row 3: Street, City, Province, Postal Code */}
            <div className="flex flex-col">
              <label>Street Name</label>
              <input
                className="border rounded-md px-2 border-gray-300"
                placeholder="Street Name"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col w-1/3">
                <label>City</label>
                <input
                  className="border rounded-md px-2 border-gray-300"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-1/3">
                <label>State/Province</label>
                <input
                  className="border rounded-md px-2 border-gray-300"
                  placeholder="Province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-1/3">
                <label>Postal Code</label>
                <input
                  className="border rounded-md px-2 border-gray-300"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
      
            {/* Row 4: Contact Number */}
            <div className="flex flex-col">
              <label>Contact Number</label>
              <input
                className="border rounded-md px-2 border-gray-300"
                placeholder="Contact Number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
      
            {/* Row 5: Gender & Blood Type */}
            <div className="flex gap-4">
              <div className="flex flex-col w-1/2">
                <label>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="border rounded-md px-2 border-gray-300"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="flex flex-col w-1/2">
                <label>Blood Type</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="border rounded-md px-2 border-gray-300"
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
            </div>
      
            {/* Row 6: Age & Weight */}
            <div className="flex gap-4">
              <div className="flex flex-col w-1/2">
                <label>Age</label>
                <input
                  type="number"
                  className="border rounded-md px-2 border-gray-300"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label>Weight</label>
                <div className="flex">
                  <input
                    type="number"
                    className="border rounded-l-md px-2 border-gray-300 w-full"
                    placeholder="Weight"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                  />
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
                    className="border rounded-r-md px-2 border-gray-300 w-24"
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
              </div>
            </div>
      
            {/* Row 7: Senior ID */}
            <div className="flex flex-col">
              <label>Senior ID</label>
              <input
                className="border rounded-md px-2 border-gray-300"
                placeholder="Senior ID"
                value={seniorId}
                onChange={(e) => setSeniorId(e.target.value)}
              />
            </div>
      
            {/* Row 8: Allergies */}
            <div className="flex flex-col">
              <label>Allergies</label>
              <textarea
                className="border rounded-md px-2 py-2 border-gray-300"
                placeholder="Enter Allergies Here.."
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
            </div>
      
            {/* Submit Button */}
            <PrimaryBtn type="submit">Submit</PrimaryBtn>
          </div>
        </form>
      </Modal>
      )}
      {selectedPatient && (
        <SidePanel
          patient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          fetchPatients={fetchPatients}
        />
      )}
      <div className="w-full flex justify-start gap-4">
        <div className="flex gap-4 items-center">
          <SearchBar
            placeholder="Search Patient..."
            search={search}
            setSearch={setSearch}
          />
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
      <Tabular
        next={nextPage}
        previous={previousPage}
        totalCount={total}
        setOffset={setOffset}
        offset={offset}
        patients={filteredPatient}
        setSelectedPatient={setSelectedPatient}
      />
    </div>
  );
};

export default PatientDirectory;
