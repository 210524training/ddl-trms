import { v4 as uuid } from 'uuid';
import { IGradeFormat } from '../@types/trms/index.d';

export default class GradingFormat implements IGradeFormat {
  constructor(
    public gradeFormat: string,
    public passingGrade: string,
    public description: string = '',
    public id: string = uuid(),
  ) {}
}
