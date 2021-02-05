import { NowRequest, NowResponse } from '@vercel/node';
import { DomainMap, DomainRepository } from '../../db/index';

export const handler = async (req: NowRequest, res: NowResponse) => {
  const repo = new DomainRepository();
  const requestUrl = new URL(req.body.url);

  const data = {
    domain: requestUrl.host,
    protocol: requestUrl.protocol,
  };

  const existingRecord = await repo.findByDomain(data.domain);

  const sendResponse = (entity: DomainMap) => {
    const proxyUrl = `/api/proxy/${entity.id}${requestUrl.pathname}${requestUrl.search}${requestUrl.hash}`;
    const response = { id: entity.id, requests: entity.requests, state: entity.state, proxyUrl };
    res.send(response);
  };

  if (existingRecord) {
    existingRecord.update(data);
    const stored = await await repo.save(existingRecord);
    sendResponse(stored);
  } else {
    const newDomain = DomainMap.Create(data);
    const stored = await repo.save(newDomain);
    sendResponse(stored);
  }
};

export default handler;
