import { ID } from 'appwrite';
import { account } from './appwrite';

export const createUser = async (email: string, password: string, name: string) => {
  return await account.create(ID.unique(), email, password, name);
};

export const loginUser = async (email: string, password: string) => {
  return await account.createEmailPasswordSession(email, password);
};

export const getCurrentUser = async () => {
  return await account.get();
};

export const logoutUser = async () => {
  return await account.deleteSession('current');
};
