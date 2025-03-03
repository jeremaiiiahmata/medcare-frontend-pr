import { Patient } from "./PatientInterface";

export interface PreAssessment{
    id?:number;
    patient?: Patient;
    doctor?: number;
    date_created?: string;
    blood_pressure? :string;
    heart_rate: string;
    temperature: string;
    chronic_conditions: string;
    smoking_history: string;
    alcohol_consumption_history: string;
    complaint: string;
    medical_history: string;
    prescription?: number;
}