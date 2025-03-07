import { Patient } from "./PatientInterface";
import { GrowthData } from "./GrowthData";
export interface DashboardData {
    total_doctors: number;
    total_patients: GrowthData;
    total_prescriptions: GrowthData;
    total_pre_assessments: GrowthData;
    total_drug_interactions: number;
    active_patients: number;
    inactive_patients: number;
    doctor_workload: { doctor: string; prescriptions: number; assessments: number }[];
    recent_patients: Patient[];
    common_drug_interactions: { drug_a: string; drug_b: string; count: number }[];
    average_patient_age: number;
    monthly_prescription_trend: { month: string; count: number }[];
    top_diagnosed_conditions: { condition: string; count: number }[];
    prescription_completion_rate: number;
    top_3_prescribed_medications?: string[];
    greeting: string;
  }
  