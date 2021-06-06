import { NowRequest, NowResponse } from '@vercel/node';
import { DomainMap, RepositoryFactory } from '../../db/index';

export const handler = async (req: NowRequest, res: NowResponse) => {
  const repo = RepositoryFactory.createRepoConnection();

  try {
    const requestUrl = new URL(req.body.url);
    const data = {
      domain: requestUrl.host,
      protocol: requestUrl.protocol,
    };

    const existingRecord = await repo.findByDomain(data);
    const sendResponse = (entity: DomainMap) => {
      const proxyUrl = `/api/proxy/${entity.id}${requestUrl.pathname}${requestUrl.search}${requestUrl.hash}`;
      const response = { id: entity.id, requests: entity.requests, state: entity.state, proxyUrl };
      res.send(response);
    };

    if (existingRecord) {
      existingRecord.incrementRequests();
      const stored = await await repo.save(existingRecord);
      sendResponse(stored);
    } else {
      const newDomain = DomainMap.Create(data);
      const stored = await repo.save(newDomain);
      sendResponse(stored);
    }
  } finally {
    repo.dispose();
  }
};

export default handler;
