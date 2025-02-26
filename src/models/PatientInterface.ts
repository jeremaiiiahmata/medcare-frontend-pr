export interface Patient {
  id?: number;
  doctor: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  blood_type: string;
  email: string;
  contact_number: string;
  age: number;
  street_name: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  weight: string;
  gender: string;
  id_number: string;
  allergies?: string;
}
