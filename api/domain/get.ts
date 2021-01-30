import { NowRequest, NowResponse } from '@vercel/node';
import { DomainRepository } from '../../db/index';

export const handler = async (req: NowRequest, res: NowResponse) => {
  const repo = new DomainRepository();
  const domains = await repo.list();
  res.send(domains);
};

export default handler;
