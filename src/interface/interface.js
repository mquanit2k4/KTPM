export interface IpcResponse {
  success: boolean;
  message: string;
}

export interface UserPayload {
  username: string;
  password: string;
}

export type UnitOptions =  'Tháng' | 'Cái' | 'Lần' | 'Người' | 'kWh' | 'Số';

export interface RequiredFee {
  id: number;
  name: String;
  unit_price: number;
  unit: UnitOptions
}

export interface ContributeFee {
  id: number;
  name: String;
  total: number;
}

export interface Fee = RequiredFee | ContributeFee;

export interface BaseFee {
  id: number;
  room_number: number;
  amount_money: number;
  representator: string;
  email: String;
  phone_number: string;
}

export interface TransferFee {
  room_number: number;
  money: number;
  fee_name: String;
  transferer: String;
  fee_type: String;
  payment_date?: string;
}

export interface Resident {
  id: number;
  room_number: number;
  full_name: string;
  gender: String;
  birth_year: number;
  occupation: string;
  phone_number: string;
  email: string;
}

export interface LoginPayload extends UserPayload {
  admin: boolean;
}

export interface SignupPayload extends UserPayload {
  email: string;
  name: String;
}

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export type ViewAccountProps = {
  users: User[];
  handleDelete: (id: number) => void;
};

export type CreateAccountProps = {
  onAccountCreated: () => void;
};

export type EditUser = {
  name: string;
  username: string;
  email: string;
  password: string;
};
export type HandleLoginState = {
  onAction: import("react").Dispatch<import("react").SetStateAction<boolean>>;
}
export interface ChartData {
  name: String;
  value: Number;
}
export interface DashboardData {
  ageCount: ChartData[];
  genderCount: ChartData[];
}
