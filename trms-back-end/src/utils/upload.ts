import reimbursementService from '../services/reimbursement.service';

const uploadRoute = async (req: any, res: any) => {
  const file = req.files?.file;
  const { rid } = req.params;
  if (file && rid) {
    const reimbursement = await reimbursementService.getById(rid);
    if (reimbursement) {
      console.log(file.name, file.data);
      reimbursement.attachments.push(file);
      const updated = await reimbursementService.update(reimbursement);
      res.status(200).json(updated);
    }
  }
  res.status(500).json(false);
};

export default uploadRoute;
