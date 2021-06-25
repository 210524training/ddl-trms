import Reimbursement from "../../models/reimbursement";
import client from "./trms.client";

const uri = '/api/v1/reimbursements'

export const deleteReimbursement = async (id: string): Promise<boolean> => {
  const {data: deleted} = await client.delete<boolean>(`${uri}/${id}`);
  return deleted;
}

export const addReimbursement = async (reimbursement: Reimbursement): Promise<boolean> => {
  const {data: created} = await client.post<boolean>(`${uri}`, {
    ...reimbursement,
  });
  return created;
}

export const updateReimbursement = async (reimbursement: Reimbursement): Promise<boolean> => {
  const {data: updated} = await client.put<boolean>(`${uri}`, {
    ...reimbursement,
  });
  return updated;
}

export const createReimbursement = async (reimbursement: Reimbursement): Promise<boolean> => {
  const {data: updated} = await client.post<boolean>(`${uri}`, {
    ...reimbursement,
  });
  return updated;
}

export const getReimbursement = async (id: string): Promise<Reimbursement> => {
  const {data: r} = await client.get<Reimbursement>(`${uri}/${id}`);
  return r;
}

export const getReimbursementsToApprove = async (): Promise<Reimbursement[]> => {
  const {data: rs} = await client.get<Reimbursement[]>(`${uri}/pending`);
  return rs;
}