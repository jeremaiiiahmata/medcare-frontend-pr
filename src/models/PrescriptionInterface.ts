export interface Prescription {
    id: number;
    doctor: number;
    patient: number;
    title: string;
    description?: string;
    date_created: string;
}
