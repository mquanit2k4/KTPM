import { ElectronHandler } from '../main/preload';
import { IpcRendererEvent } from 'electron';
import {
  LoginPayload,
  SignupPayload,
  IpcResponse,
  User,
  Resident,
  DashboardData,
  TransferFee,
  RequiredFee,
  ContributeFee,
  BaseFee,
} from '../interface/interface';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    electronAPI: {
      signup: (userData: SignupPayload) => Promise<IpcResponse>;
      login: (userData: LoginPayload) => Promise<IpcResponse>;
      onMessage: (
        channel: String,
        callback: (event: IpcRendererEvent, data: IpcResponse) => void,
      ) => void;
      clearListener: (channel: String) => void;
      fetchResidentsList: () => Resident[];
      addResident: (residentData: Resident) => void;
      editResident: (residentData: Resident) => void;
      fetchUser: (id?: number) => User[];
      editUserAccount: (formData: SignupPayload, userId: number) => void;
      deleteUserAccount: (userId: number) => void;
      fetchRequiredFee: () => RequiredFee[];
      addRequiredFee: (feeData: RequiredFee) => void;
      editRequiredFee: (feeData: RequiredFee, editId: number) => void;
      deleteRequiredFee: (feeId: number) => void;
      queryRequiredFee: (query: string) => RequiredFee[];
      addSubmittedFee: (
        room_number: number,
        amount_money: number,
        representator: string,
      ) => number;
      editFee: (
        room_number: number,
        amount_money: number,
        representator: string,
      ) => number;
      // addResident: (
      //   room_number: string,
      //   full_name: string,
      //   birth_year: number,
      //   occupation: string,
      //   phone_number: string,
      //   email: string,
      // ) => Promise<boolean>;

      fetchContributeFee: () => ContributeFee[];
      addContributeFee: (feeData: ContributeFee) => void;
      editContributeFee: (feeData: ContributeFee, editId: number) => void;
      deleteContributeFee: (feeId: number) => void;
      queryContributeFee: (query: string) => ContributeFee[];
      fetchResidentsData: () => DashboardData;

      fetchTransferFee: () => TransferFee[];
      addTransferFee: (
        room_number: number,
        money: number,
        fee_name: string,
        transferer: string,
        fee_type: string,
        payment_date?: string,
      ) => number;

      fetchMyFee: () => BaseFee[];
    };
  }
}

export {};
