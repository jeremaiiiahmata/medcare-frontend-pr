export interface Patient {
  doctor: string;
  first_name: string;
  last_name: string;
  blood_type: string;
  email: string;
  contactNum: string;
  age: number;
  weight: DoubleRange;
  gender: "Male" | "Female";
  seniorId: string;
}
