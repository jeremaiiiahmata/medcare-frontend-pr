import {useState, useEffect} from 'react'
import useAxios from '../utils/UseAxios';

import { PreAssessment } from '../models/PreAssessmentInterface'

const PreAssesmentListPage = () => {

    const api = useAxios();
    const patientId = 1 //hard-coded pa. get the patientID na clinick through props?

    const [preAssessments, setPreAssessments] = useState<PreAssessment[]>([]);

    const handleSubmit = () => {
        
        try {
            //POST method
        } catch (error) {
            
        }
    }

    const fetchData = async() => {
        try {

            const response = await api.get("/pre-assessments", {  
                params: {patient_id : patientId} //
            })
    
            setPreAssessments(response.data.data)
            console.log(preAssessments);     

        } catch (error) {
            
        }
        
    }

    useEffect(() => {
        fetchData();
    }, [])

  return (
    <div>
        {preAssessments.length > 0 ? (
            preAssessments.map((preassessment) => (
                <div key={preassessment.id}>
                <h1 className="font-bold">Doctor ID : {preassessment.doctor}</h1>
                <h2>Patient ID : {preassessment.patient}</h2>
                <p>Date Created : {preassessment.date_created}</p>
                <p>Heart Rate : {preassessment.heart_rate}</p>
                <p>Temperature : {preassessment.temperature}</p>
                <p>Chronic Conditions : {preassessment.chronic_conditions}</p>
                <p>Smoking History : {preassessment.smoking_history}</p>
                <p>Complaint : {preassessment.complaint}</p>
                <p>Notes : {preassessment.notes}</p>
                <p>Symptoms : {preassessment.symptoms}</p>
            </div>
            ))
        ) : (
            <p>No Pre-assessments found.</p>
        )}
    </div>
  )
}

export default PreAssesmentListPage