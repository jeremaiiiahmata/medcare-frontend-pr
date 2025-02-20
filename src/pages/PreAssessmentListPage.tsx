import {useState, useEffect} from 'react'
import useAxios from '../utils/UseAxios';
import { PreAssessment } from '../models/PreAssessmentInterface'
import PreAssessmentTabular from '../components/PreAssessmentTabular';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import PrimaryBtn from '../components/PrimaryBtn';

const PreAssesmentListPage = () => {

    const api = useAxios();
    const patientId = 4 // hard-coded pa. get the patientID na clinick through props?

    const [preAssessments, setPreAssessments] = useState<PreAssessment[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
   
    const [title, setTitle] = useState<string>("");
    const [heartRate, setHeartRate] = useState<string>("");
    const [temperature, setTemperature] = useState<string>("");
    const [unit, setUnit] = useState('°C');
    const [chronicConditions, setChronicConditions] = useState<string>("");
    const [smokingHistory, setSmokingHistory] = useState<string>("");
    const [complaint, setComplaint] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [symptoms, setSymptoms] = useState<string>("");

    const combinedTemperature = `${temperature} ${unit}`;

    const addPreAssessment = async () => {

        const newPreassessment : PreAssessment = {
            title: title,
            heart_rate: heartRate,
            temperature: combinedTemperature,
            chronic_conditions: chronicConditions,
            smoking_history: smokingHistory,
            complaint: complaint,
            notes: notes,
            symptoms: symptoms
            
        }
        
        try {
            const response = await api.post("/pre-assessment/create", newPreassessment, {
                params: {patient_id : patientId}
            });

            console.log("Pre-assessment has been added successfully.");
            console.log(response.status);

            handleClear();
            fetchData();
        } catch (error) {
            console.log(`Error in adding pre-assessment : ${error}`)
        }
    }

    const fetchData = async () => {
        try {
            const response = await api.get("/pre-assessments", {  
                params: {patient_id : patientId} //
            })
            setPreAssessments(response.data.data)
            console.log(preAssessments);     

        } catch (error) {
            console.log(`Error fetching data : ${error}`)
        }
    }

    const handleClear = () => {
        setTitle("");
        setHeartRate("");
        setTemperature("");
        setChronicConditions("");
        setSmokingHistory("");
        setComplaint("");
        setNotes("");
        setSymptoms("");
      };

    useEffect(() => {
        fetchData();
    }, [])

  return (
    <div className='flex flex-1'>
        {preAssessments.length > 0 ? (
            <div className="h-full w-full p-7 flex justify-center flex-col">
            {isOpen ? (
              <Modal title="Add Pre-Assessment" setIsOpen={setIsOpen}>
                <div className="border rounded-full my-2"></div>
                <form onSubmit={addPreAssessment}>
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between">
                      <div className="flex flex-col w-60">
                        <label>Heart Rate</label>
                        <input
                          className="border rounded-md px-2 border-gray-300"
                          placeholder="Heart Rate"
                          value={heartRate}
                          onChange={(e) => {
                            setHeartRate(e.target.value);
                          }}
                        />
                      </div>
                      <div className="flex flex-col w-60">
                        <label>Temperature</label>
                        <div className='flex'>
                            <input
                            type="number"
                            className="border rounded-md px-2 border-gray-300 w-20"
                            placeholder="Temperature"
                            value={temperature}
                            onChange={(e) => {
                                setTemperature(e.target.value);
                            }}
                            />
                            <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="border rounded-md px-2 border-gray-300 w-20"
                            >
                            <option value="°C">°C</option>
                            <option value="°F">°F</option>
                            </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <label>Chronic Conditions</label>
                      <input
                        className="border rounded-md px-2 border-gray-300"
                        placeholder="Chronic Conditions"
                        value={chronicConditions}
                        onChange={(e) => {
                          setChronicConditions(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex">
                      <label>Smoking History</label>
                      <input
                        className="border rounded-md px-2 border-gray-300"
                        placeholder="Smoking History"
                        value={smokingHistory}
                        onChange={(e) => {
                          setSmokingHistory(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex">
                      <label>Complaint</label>
                      <input
                        className="border rounded-md px-2 border-gray-300"
                        placeholder="Complaint"
                        value={complaint}
                        onChange={(e) => {
                          setComplaint(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex">
                      <label>Notes</label>
                      <input
                        className="border rounded-md px-2 border-gray-300"
                        placeholder='Notes'
                        value={notes}
                        onChange={(e) => {
                          setNotes(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex">
                      <label>Symptoms</label>
                      <input
                        className="border rounded-md px-2 border-gray-300"
                        placeholder="Symptoms"
                        value={symptoms}
                        onChange={(e) => {
                          setSymptoms(e.target.value);
                        }}
                        
                      >
                      </input>
                    </div>
                    <div className='flex justify-end gap-2 mx-4 my-2'>
                        <button className='bg-[#03624C] py-2.5 px-4 rounded-md text-white font-medium' type="submit">Submit</button>
                    </div>
                  </div>
                </form>
              </Modal>
            ) : ( 
              <></>
            )}
            <div className="w-full flex justify-between">
              <div className="flex gap-4">
                <div>
                  <SearchBar
                placeholder="Search Patient..."
                search={heartRate}
                setSearch={setHeartRate}
                />
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
            </div>
            <PreAssessmentTabular preassessments={preAssessments} fetchData={fetchData}/>
            </div>
        ) : (
                <div className='flex items-center justify-center w-full h-full'>
                    <p className='p-10 text-6xl'>No Pre-assessments found.</p>
            </div>
        )}
    </div>
  )
}

export default PreAssesmentListPage