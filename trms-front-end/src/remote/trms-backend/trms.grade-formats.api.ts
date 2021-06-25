import GradeFormat from "../../models/grade-format";
import client from "./trms.client";

const uri = '/api/v1/grade-formats'

export const getAllGradeFormats = async (): Promise<GradeFormat[]> => {
  const {data: formats} = await client.get<GradeFormat[]>(`${uri}`);
  return formats;
}

export const addGradeFormat = async (gradeFormat: GradeFormat): Promise<boolean> => {
  const {data: created} = await client.post<boolean>(`${uri}`, {
    ...gradeFormat
  });
  return created;
}
