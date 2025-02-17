export interface PrescriptionItem {
    id: number,
    doctor: number,
    patient: number,
    title: string,
    description?: string,
    date_created: string
}
