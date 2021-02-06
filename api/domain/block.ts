import { NowRequest, NowResponse } from '@vercel/node';
import { DomainRepository, DomainState } from '../../db/index';

export const handler = async (req: NowRequest, res: NowResponse) => {
  const repo = new DomainRepository();
  const requestUrl = new URL(req.body.url);

  if (process.env.VERCEL_ENV !== 'development' && process.env.AUTH_CODE !== req.headers.authorization) {
    res.statusCode = 401;
    return res.send({ error: `Authorization required` });
  }

  const existingRecord = await repo.findByDomain(requestUrl.host);

  if (!existingRecord) {
    res.statusCode = 404;
    return res.send({ error: `Resource not found ${requestUrl.host}` });
  }

  existingRecord.updateState(DomainState.Denied);
  const stored = await await repo.save(existingRecord);
  return res.send({ ...stored });
};

export default handler;
