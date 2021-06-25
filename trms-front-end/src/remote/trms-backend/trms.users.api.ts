import Reimbursement from "../../models/reimbursement";
import User from "../../models/user";
import client from "./trms.client";

const uri = '/api/v1/users'

export const getUserByID = async (id: string): Promise<User> => {
  const res = await client.get<User>(`${uri}/${id}`);
  console.log(res)
  return res.data;
}

export const fetchMe = async (): Promise<User> => {
  const {data: user} = await client.get<User>(`${uri}/me`);
  return user;
}

export const myReimbursements = async (id: string): Promise<Reimbursement[]> => {
  const {data: reimbursements} = await client.get<Reimbursement[]>(`${uri}/reimbursements/${id}`);
  console.log(reimbursements);
  return reimbursements;
}

export const getAllUsers = async (): Promise<User[]> => {
  const {data: users} = await client.get<User[]>(`${uri}`);
  return users;
}

export const addUser = async (user: User): Promise<boolean> => {
  const {data: created} = await client.post<boolean>(`${uri}`, {
    ...user
  });
  return created;
}