import { FormEvent, useContext, useEffect, useState, useMemo } from "react";

import Tabular from "../components/Tabular";
import { Patient } from "../models/PatientInterface";
import AuthContext from "../context/AuthContext";
import Modal from "../components/Modal";
import SearchBar from "../components/SearchBar";
import useAxios from "../utils/UseAxios";
import SidePanel from "./SidePanel";
import { PaginatedResult } from "../models/PaginationInterface";
import { allergySuggestions } from "../data/allergySuggestions";
import Swal from "sweetalert2";

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
  const [middleName, setMiddleName] = useState<string>("");
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

  const [search, setSearch] = useState<string>("");

  // Pagination
  const [total, setTotal] = useState<number>(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);

  const patientWeight = `${weight} ${weightUnit}`;

  // Allergies
  const [allergyInput, setAllergyInput] = useState<string>("");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAllergyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setAllergyInput(input);

    if (input.length >= 2) {
      const matches = allergySuggestions.filter((allergy) =>
        allergy.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectAllergy = (allergy: string) => {
    if (!selectedAllergies.includes(allergy)) {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
    setAllergyInput("");
    setShowSuggestions(false);
  };

  const handleRemoveAllergy = (allergy: string) => {
    setSelectedAllergies(selectedAllergies.filter((item) => item !== allergy));
  };

  const addPatient = async (e: FormEvent) => {
    e.preventDefault();

    const newPatient: Patient = {
      doctor: user.user_id, // use id based on current user
      first_name: firstName,
      middle_name: middleName,
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
      allergies: selectedAllergies.toString(),
    };

    try {
      const response = await api.post("/create-patient", newPatient);

      console.log(response.data);
      console.log("New Patient added!");

      Swal.fire({
        title: "Patient Created!",
        text: "Patient has been added successfully.",
        confirmButtonColor : "#03624C",
        confirmButtonText : "Okay",
        icon: "success",
        iconColor: "#2CC295"
      });

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
    setMiddleName("");
    setEmail("");
    setContact("");
    setAge(0);
    setWeight(0);
    setSeniorId("");
    setStreetName("");
    setCity("");
    setProvince("");
    setPostalCode("");
    setBloodType("");
    setGender("");
    setSelectedAllergies([]);
    setAllergyInput("");
    setShowSuggestions(false);
  };

  const filteredPatient = useMemo(() => {
    return patients.filter(
      (patient) =>
        patient.first_name.toLowerCase().includes(search.toLowerCase()) ||
        patient.last_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [patients, search]);

  const fetchPatients = async (offset?: number) => {
    try {
      const response = await api.get<PaginatedResult<Patient>>(
        `/patients?limit=${7}&offset=${offset}`
      );
      const data = await response.data;

      console.log(data);
      setPatients(data.results || []);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setTotal(data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      handleClear();
    }
    fetchPatients(offset); // Initial data fetch
  }, [offset, isOpen]);

  return (
    <div className="h-full w-full p-7 flex justify-center flex-col">
      <div>
        <h1 className="text-5xl font-bold py-5 w-fit">Patients</h1>
      </div>
      {isOpen && (
        <Modal title="Add Patient" setIsOpen={setIsOpen}>
          <div className="border-b my-2"></div>
          <form
            onSubmit={addPatient}
            className="motion-safe:animate-[fade-in_0.3s_ease-in-out]"
          >
            <div className="flex flex-col gap-5">
              {/* Row 1: First Name, Middle Name & Last Name */}
              <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
                  <label className="text-gray-700 mb-1 font-medium">
                    First Name
                  </label>
                  <input
                    className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="text-gray-700 mb-1 font-medium">
                    Middle Name
                  </label>
                  <input
                    className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                    placeholder="Middle Name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="text-gray-700 mb-1 font-medium">
                    Last Name
                  </label>
                  <input
                    className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 2: Email & Contact Number */}
              <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                  <label className="text-gray-700 mb-1 font-medium">
                    Email Address
                  </label>
                  <input
                    className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                    placeholder="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-gray-700 mb-1 font-medium">
                    Contact Number
                  </label>
                  <input
                    className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                    placeholder="Contact Number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 3: Street Address */}
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1 font-medium">
                  Street Name
                </label>
                <input
                  className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                  placeholder="Street Name"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                />
              </div>

              {/* Row 4: City, Province, Postal Code */}
              <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
                  <label className="text-gray-700 mb-1 font-medium">City</label>
                  <input
                    className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="text-gray-700 mb-1 font-medium">
                    State/Province
                  </label>
                  <input
                    className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                    placeholder="Province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="text-gray-700 mb-1 font-medium">
                    Postal Code
                  </label>
                  <input
                    className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                    placeholder="Postal Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 5: Gender, Blood Type & Weight */}
              <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
                  <label className="text-gray-700 mb-1 font-medium">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200 appearance-none bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="text-gray-700 mb-1 font-medium">
                    Blood Type
                  </label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200 appearance-none bg-white"
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
                <div className="flex flex-col w-1/3">
                  <label className="text-gray-700 mb-1 font-medium">
                    Weight
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      className="border rounded-l-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                      placeholder="Weight"
                      value={weight || ""}
                      onChange={(e) =>
                        setWeight(parseFloat(e.target.value) || 0)
                      }
                    />
                    <select
                      value={weightUnit}
                      onChange={(e) => setWeightUnit(e.target.value)}
                      className="border rounded-r-lg px-3 py-2 border-gray-300 w-24 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200 appearance-none bg-white"
                    >
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 6: Senior ID & Age */}
              <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                  <label className="text-gray-700 mb-1 font-medium">
                    Senior ID
                  </label>
                  <input
                    className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                    placeholder="Senior ID"
                    value={seniorId}
                    onChange={(e) => setSeniorId(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-gray-700 mb-1 font-medium">Age</label>
                  <input
                    type="number"
                    className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                    placeholder="Age"
                    value={age || ""}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Allergies Input */}
              <div className="flex flex-col relative">
                <label className="text-gray-700 mb-1 font-medium">
                  Allergies
                </label>

                {/* Display selected allergies as pills */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedAllergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm flex items-center transition duration-200 hover:bg-emerald-200"
                    >
                      {allergy}
                      <button
                        type="button"
                        className="ml-2 text-emerald-700 hover:text-red-600 transition duration-200"
                        onClick={() => handleRemoveAllergy(allergy)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Allergy input field */}
                <input
                  className="border rounded-lg px-4 py-2 border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                  placeholder="Type an allergy..."
                  value={allergyInput}
                  onChange={handleAllergyChange}
                />

                {/* Suggestions dropdown with animation */}
                {showSuggestions && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 motion-safe:animate-[fade-in_0.2s_ease-in-out] overflow-hidden">
                    {filteredSuggestions.map((allergy, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-emerald-50 cursor-pointer transition duration-150"
                        onClick={() => handleSelectAllergy(allergy)}
                      >
                        {allergy}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition duration-200 font-medium w-1/2"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition duration-200 font-medium w-1/2">
                  Add Patient
                </button>
              </div>
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
      <div className="w-full flex justify-start gap-4 py-2">
        <div className="flex gap-4 items-center">
          <SearchBar
            placeholder="Search Patient..."
            search={search}
            setSearch={setSearch}
          />
        </div>
        <button
          type="button"
          className="py-2 px-3 hover:bg-emerald-900 bg-emerald-800 text-white font-bold rounded-md cursor-pointer"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Add Patient
        </button>
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
