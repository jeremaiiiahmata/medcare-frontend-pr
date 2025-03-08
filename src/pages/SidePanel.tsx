import Modal from "../components/Modal";
import { Patient } from "../models/PatientInterface";
import {
  MdOutlineMail,
  MdOutlineDelete,
  MdEdit,
  MdAssignment,
  MdMedicalServices,
  MdHistory,
  MdOutlineHealthAndSafety,
} from "react-icons/md";
import { BsTelephone, BsGenderAmbiguous, BsDroplet } from "react-icons/bs";
import { FaWeightHanging } from "react-icons/fa";
import { GiAges } from "react-icons/gi";
import ProfilePicture from "../components/ProfilePicture";
import useAxios from "../utils/UseAxios";
import { Prescription } from "../models/PrescriptionInterface";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PreAssessment } from "../models/PreAssessmentInterface";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { allergySuggestions } from "../data/allergySuggestions";

interface Props {
  patient: Patient;
  setSelectedPatient: (value: Patient | null) => void;
  fetchPatients: (offset?: number) => void;
}

const SidePanel = ({ patient, setSelectedPatient, fetchPatients }: Props) => {
  const api = useAxios();
  const navigate = useNavigate();

  const [isPatientModalOpen, setIsPatientModalOpen] = useState<boolean>(false);
  //new patient usestates
  const [firstName, setFirstName] = useState<string>(patient.first_name);
  const [middleName, setMiddleName] = useState<string>(patient.middle_name);
  const [lastName, setLastName] = useState<string>(patient.last_name);
  const [email, setEmail] = useState<string>(patient.email);
  const [age, setAge] = useState<number>(patient.age);
  const [streetName, setStreetName] = useState<string>(patient.street_name);
  const [city, setCity] = useState<string>(patient.city || "");
  const [province, setProvince] = useState<string>(
    patient.state_province || ""
  );
  const [postalCode, setPostalCode] = useState<string>(
    patient.postal_code || ""
  );
  const [bloodType, setBloodType] = useState<string>(patient.blood_type);
  const [contact, setContact] = useState<string>(patient.contact_number);
  const [gender, setGender] = useState<string>(patient.gender);
  const [weight, setWeight] = useState<string>(patient.weight);
  const [seniorId, setSeniorId] = useState<string>(patient.id_number);
  const [weightUnit, setWeightUnit] = useState("kg");

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

  //Pre-Assessment Modal
  const [isPreAssessOpen, setIsPreAssessOpen] = useState<boolean>(false);
  const [patientPrescriptions, setPatientPrescriptions] = useState<
    Prescription[]
  >([]);

  const [bloodPressure, setBloodPressure] = useState<string>("");
  const [heartRate, setHeartRate] = useState<string>("");
  const [temperature, setTemperature] = useState<string>("");
  const [unit, setUnit] = useState("°C");
  const [chronicConditions, setChronicConditions] = useState<string>("");
  const [smokingHistory, setSmokingHistory] = useState<string>("");
  const [alcoholHistory, setAlcoholHistory] = useState<string>("");
  const [complaint, setComplaint] = useState<string>("");
  const [medicalHistory, setMedicalHistory] = useState<string>("");
  const combinedTemperature = `${temperature} ${unit}`;

  //Prescription Modal
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState<boolean>(false);
  const [prescriptionTitle, setPrescriptionTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [preAssessments, setPreAssessments] = useState<PreAssessment[]>([]);

  const addPreAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding Pre-Assessment");

    // Add New Pre-Assessment
    const newPreassessment: PreAssessment = {
      blood_pressure: bloodPressure,
      heart_rate: heartRate,
      temperature: combinedTemperature,
      chronic_conditions: chronicConditions,
      smoking_history: smokingHistory,
      alcohol_consumption_history: alcoholHistory,
      complaint: complaint,
      medical_history: medicalHistory,
    };

    try {
      const response = await api.post(
        `/pre-assessment/create?patient_id=${patient.id}`,
        newPreassessment
      );

      console.log(
        `Pre-assessment has been added successfully. Response : ${response.status}`
      );

      const preAssessmentID = response.data.data.id;

      Swal.fire({
        title: "Assessment Created!",
        text: "Assessment has been successfully created!",
        confirmButtonColor: "#03624C",
        confirmButtonText: "Okay",
        icon: "success",
        iconColor: "#2CC295",
      }).then(() => {
        // Navigate to the prescription page
        if (preAssessmentID) {
          navigate(`/preassessment/${preAssessmentID}`);
        }
      });
      handleClear();
    } catch (error) {
      console.log(`Error in adding pre-assessment : ${error}`);
    }
  };

  const addPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding Prescription");
    console.log(`Prescription Title ${prescriptionTitle}`);

    // Add New Prescription
    const newPrescription: Prescription = {
      title: prescriptionTitle,
      description: description,
    };

    try {
      const response = await api.post(
        `/prescription/create?patient_id=${patient.id}`,
        newPrescription
      );

      const prescriptionID = response.data.prescription.id;

      console.log(`Patient ID from Post Method : ${patient.id}`);
      console.log("Prescription has been added successfully.");

      Swal.fire({
        title: "Prescription Created!",
        text: "Prescription has been successfully created!",
        confirmButtonColor: "#03624C",
        confirmButtonText: "Okay",
        icon: "success",
        iconColor: "#2CC295",
      }).then(() => {
        // Navigate to the prescription page
        if (prescriptionID) {
          navigate(`/prescription/${prescriptionID}`);
        }
      });
      fetchPrescriptions();
      handleClear();
    } catch (error) {
      console.log(`Error in adding pre-assessment : ${error}`);
    }
  };

  const handleClear = () => {
    setPrescriptionTitle("");
    setDescription("");
    setHeartRate("");
    setBloodPressure("");
    setTemperature("");
    setChronicConditions("");
    setSmokingHistory("");
    setAlcoholHistory("");
    setComplaint("");
    setMedicalHistory("");
    setIsPreAssessOpen(false);
    setIsPrescriptionOpen(false);
  };

  // Edit Patient
  const editPatient = async () => {
    const editedPatient = {
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
      const response = await api.put(
        `patient/edit?patient_id=${patient.id}`,
        editedPatient
      );
      console.log(response);

      Swal.fire({
              title: "Success!",
              text: "Patient has been edited!",
              confirmButtonColor: "#03624C",
              confirmButtonText: "Okay",
              icon: "success",
              iconColor: "#2CC295",
            });
    } catch (error) {
      console.log(`Error in editing patient : ${error}`);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while editing the patient.",
        icon: "error",
      });
    }
  };

  // Delete Patient
  const deletePatient = async () => {
    Swal.fire({
      title: `Confirm Delete?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Delete",
      confirmButtonColor: "#F04444",
      denyButtonColor: "#6F7D7D",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire("Prescription Item Deleted!", "", "success");
        try {
          const response = await api.delete(
            `/patient/delete?patient_id=${patient.id}`
          );
          if (response.status === 200) {
            console.log(`Patient ${patient.id} successfully deleted`);
            Swal.fire({
              title: "Deleted!",
              text: "Patient has been deleted!",
              confirmButtonColor: "#03624C",
              confirmButtonText: "Okay",
              icon: "success",
              iconColor: "#2CC295",
            });
            fetchPatients();
            setSelectedPatient(null);
          }
        } catch (error) {
          console.log(`Error in deleting patient : ${error}`);
        }
      } else if (result.isDenied) {
        console.log("Delete cancelled.");
      }
    });
    console.log("Deleted!");
  };

  // Fetch Prescriptions
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

  const fetchPreAssessment = async () => {
    try {
      const response = await api.get(
        `/pre-assessments?patient_id=${patient.id}`
      );
      const preAssessments = await response.data;

      setPreAssessments(preAssessments.data);
      console.log(preAssessments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    fetchPreAssessment();
  }, []);

  const [selectedTab, setSelectedTab] = useState<string>("medical");

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <>
      {isPatientModalOpen && (
        <div className="z-50">
          <Modal title="Edit Patient" setIsOpen={setIsPatientModalOpen}>
            <div className="border-b my-2"></div>
            <form
              onSubmit={editPatient}
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
                    <label className="text-gray-700 mb-1 font-medium">
                      City
                    </label>
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
                        onChange={(e) => setWeight(e.target.value)}
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
                    <label className="text-gray-700 mb-1 font-medium">
                      Age
                    </label>
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
                          className="ml-2 text-emerald-700 hover:text-red-600 transition duration-200 cursor-pointer"
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
                    onClick={() => setIsPatientModalOpen(false)}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition duration-200 font-medium w-1/2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition duration-200 font-medium w-1/2"
                  >
                    Edit Patient
                  </button>
                </div>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {isPreAssessOpen && (
        <div className="z-50">
          <Modal title="Add Assessment" setIsOpen={setIsPreAssessOpen}>
            <div className="border rounded-full my-2"></div>
            <form onSubmit={addPreAssessment}>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col w-60">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Heart Rate
                    </label>
                    <div className="flex">
                      <input
                        className="border rounded-l-md px-2 border-gray-300 w-full h-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200"
                        placeholder="Heart Rate"
                        value={heartRate}
                        onChange={(e) => setHeartRate(e.target.value)}
                      />
                      <span className="flex items-center bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-2 text-gray-600">
                        bpm
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col w-60">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Blood Pressure
                    </label>
                    <div className="flex">
                      <input
                        className="border rounded-l-md px-2 border-gray-300 w-full h-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200"
                        placeholder="Blood Pressure"
                        value={bloodPressure}
                        onChange={(e) => setBloodPressure(e.target.value)}
                      />
                      <span className="flex items-center bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-2 text-gray-600">
                        mmHg
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col w-60">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Temperature
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        className="border rounded-l-md px-2 border-gray-300 w-full h-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200"
                        placeholder="Temperature"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                      />
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="flex items-center bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-2 text-gray-600 focus:outline-none"
                      >
                        <option value="°C">°C</option>
                        <option value="°F">°F</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Chronic Conditions
                    </label>
                    <input
                      className="border rounded-md px-2 border-gray-300 h-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200"
                      placeholder="Chronic Conditions"
                      value={chronicConditions}
                      onChange={(e) => setChronicConditions(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Alcohol Consumption History
                    </label>
                    <select
                      value={alcoholHistory}
                      onChange={(e) => setAlcoholHistory(e.target.value)}
                      className="border rounded-md px-2 border-gray-300 w-60 h-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200"
                    >
                      <option value="">Select Drinking Habit</option>
                      <option value="Never">Never</option>
                      <option value="Former">Former</option>
                      <option value="Current">Current</option>
                      <option value="Occasional">Occasional</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Smoking History
                    </label>
                    <select
                      value={smokingHistory}
                      onChange={(e) => setSmokingHistory(e.target.value)}
                      className="border rounded-md px-2 border-gray-300 w-60 h-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200"
                    >
                      <option value="">Select Smoking Habit</option>
                      <option value="Never">Never</option>
                      <option value="Former">Former</option>
                      <option value="Current">Current</option>
                      <option value="Occasional">Occasional</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Chief Complaint
                  </label>
                  <textarea
                    className="border rounded-md px-2 py-2 border-gray-300 h-24 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200"
                    placeholder="Complaint"
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Medical History
                  </label>
                  <textarea
                    className="border rounded-md px-2 py-2 border-gray-300 h-24 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200"
                    placeholder="Medical History"
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 mx-4 my-2">
                  <button
                    className="bg-[#03624C] py-2.5 px-4 rounded-md text-white font-medium cursor-pointer hover:bg-[#024a3a] transition-colors duration-200 shadow-md hover:shadow-lg"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {isPrescriptionOpen && (
        <div className="z-50">
          <Modal title="Add Prescription" setIsOpen={setIsPrescriptionOpen}>
            <div className="border rounded-full my-2"></div>
            <form onSubmit={addPrescription}>
              <div className="flex flex-col gap-6">
                {/* Row 0: Title */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="border rounded-md px-2 py-2 border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200"
                    placeholder="Title"
                    value={prescriptionTitle}
                    onChange={(e) => setPrescriptionTitle(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="border rounded-md px-2 py-2 border-gray-300 h-24 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200"
                    placeholder="Notes"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 mx-4 my-2">
                  <button
                    className="bg-[#03624C] py-2.5 px-4 rounded-md text-white font-medium cursor-pointer hover:bg-[#024a3a] transition-colors duration-200 shadow-md hover:shadow-lg"
                    type="submit"
                  >
                    Create Prescription
                  </button>
                </div>
              </div>
            </form>
          </Modal>
        </div>
      )}

      <Modal
        setIsOpen={() => {
          setSelectedPatient(null);
        }}
        title="Patient Profile"
      >
        <motion.div
          className="flex gap-6 h-full"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          {/* Personal details */}
          <motion.div
            className="rounded-lg shadow-lg w-80 p-6 h-full bg-white border border-gray-100"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-full flex justify-center mb-8">
              <div className="flex flex-col gap-4 items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ProfilePicture />
                </motion.div>

                <div className="flex justify-between items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => {
                        setIsPatientModalOpen(true);
                      }}
                      type="button"
                      className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-700 bg-emerald-500 font-medium hover:bg-gray-100 transition-all duration-200 focus:outline-none"
                    >
                      <MdEdit size={16} />
                      Edit
                    </button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      type="button"
                      onClick={deletePatient}
                      className="p-2 rounded-md text-gray-600 bg-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 focus:outline-none"
                    >
                      <MdOutlineDelete size={24} />
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* About */}
            <h2 className="text-lg font-semibold text-green-800 mb-4 border-b pb-2">
              About
            </h2>
            <div className="flex flex-col gap-5">
              <motion.div
                className="flex flex-col"
                custom={0}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="font-semibold text-xl text-gray-800">
                  {patient.first_name} {patient.last_name}
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col space-y-2"
                custom={1}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="flex items-center gap-2 text-gray-700">
                  <MdOutlineMail className="text-emerald-600" size={18} />
                  {patient.email}
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <BsTelephone className="text-emerald-600" size={16} />
                  {patient.contact_number}
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col space-y-2"
                custom={2}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Address */}
                <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-1">
                  Address
                </h3>
                <div className="bg-emerald-50 p-2 rounded-md">
                  <p className="text-gray-700">{patient.street_name}</p>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{patient.city}</span>
                    <span>{patient.state_province}</span>
                    <span>{patient.postal_code}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            className="w-2/3 flex-auto flex flex-col gap-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm">
              <div className="flex">
                {[
                  {
                    id: "medical",
                    icon: <MdMedicalServices size={16} />,
                    label: "Medical Details",
                  },
                  {
                    id: "prescriptions",
                    icon: <MdAssignment size={16} />,
                    label: "Prescriptions",
                  },
                  {
                    id: "pre-assessments",
                    icon: <MdHistory size={16} />,
                    label: "Assessments",
                  },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`text-sm px-3 py-1.5 mr-1 transition-all duration-200 flex items-center gap-1 rounded-md ${
                      selectedTab === tab.id
                        ? "bg-emerald-600 font-semibold text-white"
                        : "text-gray-600 font-semibold hover:bg-emerald-50 hover:text-emerald-600"
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                  >
                    {tab.icon}
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-2 ml-20">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <button
                    onClick={() => setIsPreAssessOpen(!isPreAssessOpen)}
                    type="button"
                    className="text-sm font-semibold bg-emerald-100 cursor-pointer text-emerald-700 px-3 py-1.5 rounded-md flex items-center gap-1 border border-emerald-500 shadow-sm hover:shadow transition-all duration-200"
                  >
                    <MdHistory size={14} />
                    Add Assessment
                  </button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <button
                    onClick={() => setIsPrescriptionOpen(!isPrescriptionOpen)}
                    type="button"
                    className="text-sm font-semibold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-md flex items-center gap-1 border border-emerald-500 shadow-sm hover:shadow transition-all duration-200"
                  >
                    <MdAssignment size={14} />
                    Add Prescription
                  </button>
                </motion.div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg flex flex-auto h-full p-4 flex-col gap-3 overflow-y-auto bg-white shadow-md">
              {selectedTab === "prescriptions" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-3 h-full"
                >
                  {/* Fixed height container with scrolling for prescriptions */}
                  <div className="h-96 overflow-y-auto pr-2">
                    {patientPrescriptions.length > 0 ? (
                      patientPrescriptions.map((prescription, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="mb-3"
                        >
                          <Link to={`/prescription/${prescription.id}`}>
                            <motion.div
                              whileHover={{
                                scale: 1.02,
                                boxShadow:
                                  "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                              }}
                              className="bg-emerald-50 shadow-sm w-full p-4 transition-all duration-300 hover:border-emerald-400 rounded-lg border border-emerald-100 hover:border"
                            >
                              <h2 className="font-semibold text-emerald-800">
                                Prescription Title:{" "}
                              </h2>
                              <p className="text-gray-800 mb-2">
                                {prescription.title}
                              </p>
                              <h2 className="font-semibold text-emerald-800">
                                Date Created:
                              </h2>
                              <p className="text-gray-600">
                                {prescription.date_created}
                              </p>
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))
                    ) : (
                      <div className="h-full w-full flex justify-center items-center">
                        <h2 className="text-lg font-semibold text-emerald-800/60">
                          Patient has no prescriptions
                        </h2>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {selectedTab === "pre-assessments" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-3 h-full"
                >
                  {/* Fixed height container with scrolling for pre-assessments */}
                  <div className="h-96 overflow-y-auto pr-2">
                    {preAssessments.length > 0 ? (
                      preAssessments.map((assessment, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="mb-3"
                        >
                          <Link to={`/preassessment/${assessment.id}`}>
                            <motion.div
                              whileHover={{
                                scale: 1.02,
                                boxShadow:
                                  "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                              }}
                              className="bg-emerald-50 shadow-sm w-full p-4 transition-all duration-300 hover:border-emerald-400 rounded-lg border border-emerald-100 hover:border"
                            >
                              <h2 className="font-semibold text-emerald-800">
                                Complaint:{" "}
                              </h2>
                              <p className="text-gray-800 mb-2 line-clamp-2">
                                {assessment?.complaint}
                              </p>
                              <h2 className="font-semibold text-emerald-800">
                                Date Created:
                              </h2>
                              <p className="text-gray-600">
                                {assessment.date_created}
                              </p>
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))
                    ) : (
                      <div className="h-full w-full flex justify-center items-center">
                        <h2 className="text-lg font-semibold text-emerald-800/60">
                          Patient has no assessments
                        </h2>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {selectedTab === "medical" && (
                <motion.div
                  className="p-4 bg-white rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-semibold text-xl text-emerald-800 mb-6 border-b pb-2">
                    Medical Details
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <motion.div
                      className="bg-emerald-50 rounded-lg p-4 flex items-center gap-3 shadow-sm border border-emerald-100"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <GiAges className="text-emerald-600" size={24} />
                      <div>
                        <p className="font-semibold text-gray-700">Age</p>
                        <p className="text-gray-800 text-lg">
                          {patient.age || "N/A"}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-emerald-50 rounded-lg p-4 flex items-center gap-3 shadow-sm border border-emerald-100"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FaWeightHanging className="text-emerald-600" size={24} />
                      <div>
                        <p className="font-semibold text-gray-700">Weight</p>
                        <p className="text-gray-800 text-lg">
                          {patient.weight || "None"}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-emerald-50 rounded-lg p-4 flex items-center gap-3 shadow-sm border border-emerald-100"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <BsGenderAmbiguous
                        className="text-emerald-600"
                        size={24}
                      />
                      <div>
                        <p className="font-semibold text-gray-700">Gender</p>
                        <p className="text-gray-800 text-lg">
                          {patient.gender || "None"}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-emerald-50 rounded-lg p-4 flex items-center gap-3 shadow-sm border border-emerald-100"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <BsDroplet className="text-emerald-600" size={24} />
                      <div>
                        <p className="font-semibold text-gray-700">
                          Blood Type
                        </p>
                        <p className="text-gray-800 text-lg">
                          {patient.blood_type || "Unknown"}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-emerald-50 rounded-lg p-4 flex items-center gap-3 shadow-sm border border-emerald-100 col-span-2"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <MdOutlineHealthAndSafety
                        className="text-emerald-600"
                        size={24}
                      />
                      <div className="w-full">
                        <p className="font-semibold text-gray-700">Allergies</p>
                        <p className="text-gray-800">
                          {patient.allergies || "No known allergies"}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </Modal>
    </>
  );
};

export default SidePanel;
