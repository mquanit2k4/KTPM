// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  UserPayload,
  IpcResponse,
  SignupPayload,
  RequiredFee,
  ContributeFee,
  Resident,
} from '../interface/interface';
import {
  addResident,
  deleteRequiredFee,
  editRequiredFee,
  editResident,
  queryRequiredFee,
} from '../db/HandleData';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

contextBridge.exposeInMainWorld('electronAPI', {
  // Register user
  signup: (userData: UserPayload): Promise<IpcResponse> => {
    return ipcRenderer.invoke('signup', userData);
  },

  // Login user
  login: (userData: UserPayload): Promise<IpcResponse> => {
    return ipcRenderer.invoke('login', userData);
  },

  onMessage: (
    channel: string,
    callback: (event: IpcRendererEvent, data: IpcResponse) => void,
  ) => {
    const validChannels = [
      'signup-response',
      'login-response',
      'edit-response',
      'delete-user-response',
    ]; // Add valid channels
    if (validChannels.includes(channel)) {
      ipcRenderer.once(channel, callback);
    }
  },

  clearListener: (channel: string) => {
    const validChannels = [
      'signup-response',
      'login-response',
      'edit-response',
      'delete-user-response',
    ]; // Add valid channels
    if (validChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
    }
  },

  fetchUser: (id?: number) => {
    return ipcRenderer.invoke('fetch-user', id);
  },

  editUserAccount: (formData: SignupPayload, userId: number) => {
    return ipcRenderer.invoke('edit-account', formData, userId);
  },

  deleteUserAccount: (userId: number) => {
    return ipcRenderer.invoke('delete-account', userId);
  },

  fetchResidentsList: () => {
    return ipcRenderer.invoke('fetch-residents-list');
  },

  fetchRequiredFee: () => {
    return ipcRenderer.invoke('fetch-required-fee');
  },

  addRequiredFee: (feeData: RequiredFee) => {
    return ipcRenderer.invoke('add-required-fee', feeData);
  },

  editRequiredFee: (feeData: RequiredFee, editId: number) => {
    return ipcRenderer.invoke('edit-required-fee', feeData, editId);
  },

  deleteRequiredFee: (feeId: number) => {
    return ipcRenderer.invoke('delete-required-fee', feeId);
  },

  queryRequiredFee: (query: string) => {
    return ipcRenderer.invoke('query-required-fee', query);
  },

  deleteCompulsoryFee: (room_number: number) => {
    return ipcRenderer.invoke('delete-compulsory-fee', room_number);
  },

  addSubmittedFee: (
    room_number: number,
    amount_money: number,
    representator: string,
  ) => {
    return ipcRenderer.invoke(
      'add-submitted-fee',
      room_number,
      amount_money,
      representator,
    );
  },

  editFee: (
    room_number: number,
    amount_money: number,
    representator: string,
  ) => {
    return ipcRenderer.invoke(
      'edit-fee',
      room_number,
      amount_money,
      representator,
    );
  },

  fetchContributeFee: () => {
    return ipcRenderer.invoke('fetch-contribute-fee');
  },

  addContributeFee: (feeData: ContributeFee) => {
    return ipcRenderer.invoke('add-contribute-fee', feeData);
  },

  editContributeFee: (feeData: ContributeFee, editId: number) => {
    return ipcRenderer.invoke('edit-contribute-fee', feeData, editId);
  },

  deleteContributeFee: (feeId: number) => {
    return ipcRenderer.invoke('delete-contribute-fee', feeId);
  },

  queryContributeFee: (query: string) => {
    return ipcRenderer.invoke('query-contribute-fee', query);
  },

  fetchResidentsData: () => {
    return ipcRenderer.invoke('fetch-number-residents');
  },

  addResident: (residentData: Resident) => {
    return ipcRenderer.invoke('add-resident', residentData);
  },

  editResident: (residentData: Resident) => {
    return ipcRenderer.invoke('edit-resident', residentData);
  },

  addTransferFee: (
    room_number: number,
    money: number,
    fee_name: string,
    transferer: string,
    fee_type: string,
    payment_date?: string,
  ) => {
    return ipcRenderer.invoke(
      'add-transfer-fee',
      room_number,
      money,
      fee_name,
      transferer,
      fee_type,
      payment_date,
    );
  },

  fetchTransferFee: () => {
    return ipcRenderer.invoke('fetch-transfer-fee');
  },

  fetchMyFee: () => {
    return ipcRenderer.invoke('fetch-my-fee');
  },
});

export type ElectronHandler = typeof electronHandler;
