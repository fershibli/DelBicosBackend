import { CustomRequest, CustomResponse } from '../interfaces';

export const loading = (req: CustomRequest<{}>, res: CustomResponse) => {
  res.status(200).json({ message: 'Loading screen endpoint' });
};