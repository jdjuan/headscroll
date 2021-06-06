import { NowRequest, NowResponse } from '@vercel/node';
import { DomainMap, RepositoryFactory } from '../../db/index';

export const handler = async (req: NowRequest, res: NowResponse) => {
  const repo = RepositoryFactory.createRepoConnection();
  try {
    const query = getQuery(req);
    const domains = (await repo.list(query)).map((d) => ({ ...d, url: `${d.protocol}//${d.domain}` }));
    res.send(domains);
  } finally {
    repo.dispose();
  }
};

const getQuery = (req: NowRequest) => {
  const query = { domain: req.query.domain, protocol: req.query.protocol, state: req.query.state, id: req.query.id } as Partial<DomainMap>;
  return query;
};

export default handler;
