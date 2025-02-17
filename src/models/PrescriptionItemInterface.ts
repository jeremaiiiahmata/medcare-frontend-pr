export interface PrescriptionItem {
    id: number;
    prescription: number; 
    amount: string;
    drug_name: string;
    dosage: string;
    frequency: string;
    notes?: string; 
}