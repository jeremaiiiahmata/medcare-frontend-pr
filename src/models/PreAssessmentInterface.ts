import { Patient } from "./PatientInterface";

export interface PreAssessment{
    id?:number;
    patient?: Patient;
    doctor?: number;
    title?: string;
    date_created?: string;
    heart_rate: string;
    temperature: string;
    chronic_conditions: string;
    smoking_history: string;
    complaint: string;
    notes: string;
    symptoms: string;
    prescription?: number;
}