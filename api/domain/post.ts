import { NowRequest, NowResponse } from '@vercel/node';
import { DomainMap, DomainRepository } from '../../db/index';

export const handler = async (req: NowRequest, res: NowResponse) => {
  const repo = new DomainRepository();
  const data = {
    domain: `${req.query.domain}`,
    protocol: `${req.query.protocol}`,
  };

  const existingRecord = await repo.findByDomain(data.domain);

  const sendResponse = (entity: DomainMap) => {
    res.send({ id: entity.id, requests: entity.requests });
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
