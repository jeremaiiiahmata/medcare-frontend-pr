import { Symptom } from "./SymptomInterface";
export interface DashboardData {
    total_doctors: number;
    total_patients: number;
    total_prescriptions: number;
    total_pre_assessments: number;
    total_drug_interactions: number;
    active_patients: number;
    inactive_patients: number;
    doctor_workload: { doctor: string; prescriptions: number; assessments: number }[];
    common_drug_interactions: { drug_a: string; drug_b: string; count: number }[];
    most_common_symptoms: Symptom;
    average_patient_age: number;
    monthly_prescription_trend: { month: string; count: number }[];
    top_diagnosed_conditions: { condition: string; count: number }[];
    prescription_completion_rate: number;
  }
  