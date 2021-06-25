import { Status } from "../../../@types"

export const translateStatusToColor = (status: Status) => {
    switch (status) {
      case 'Urgent':
        return 'active';
      case 'More Information Needed':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'danger';
      default:
        return 'light';
    }
}

export const validDate = (date: Date): string => {
    let year: string | number = date.getFullYear();
    if (year < 10) year = `000${year}`
    else if (year < 100) year = `00${year}`
    else if (year < 1000) year = `0${year}`  
    const day = date.getDate() + 1;
    const month = date.getMonth() + 1;
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  }