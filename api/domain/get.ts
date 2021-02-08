import { NowRequest, NowResponse } from '@vercel/node';
import { DomainMap, DomainRepository } from '../../db/index';

export const handler = async (req: NowRequest, res: NowResponse) => {
  const repo = new DomainRepository();
  const query = getQuery(req);
  const domains = (await repo.list(query)).map((d) => ({ ...d, url: `${d.protocol}//${d.domain}` }));
  res.send(domains);
};

const getQuery = (req: NowRequest) => {
  const query = { domain: req.query.domain, protocol: req.query.protocol, state: req.query.state, id: req.query.id } as Partial<DomainMap>;
  return query;
};

export default handler;
