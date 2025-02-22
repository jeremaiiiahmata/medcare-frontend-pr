import { Patient } from "./PatientInterface";
import { PreAssessment } from "./PreAssessmentInterface";

export interface Prescription {
    id: number;
    doctor: number;
    patient: Patient;
    title: string;
    description?: string;
    date_created: string;
    preassessment?: PreAssessment;
}
