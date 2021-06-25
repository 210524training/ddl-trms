import { IGradeFormat } from '../@types/';
import { v4 as uuid } from 'uuid';

export default interface GradeFormat extends IGradeFormat {
  gradeFormat: string,
  passingGrade: string,
  description: string,
  id: string,
}

export default class CGradeFormat implements GradeFormat {
  constructor(
    public gradeFormat: string = 'example',
    public passingGrade: string = '100',
    public description: string = '100 to pass 100 to fail xd',
    public id: string = uuid(),
  ) {}
}
