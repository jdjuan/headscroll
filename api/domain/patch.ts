import { NowRequest, NowResponse } from '@vercel/node';
import { DomainMap, RepositoryFactory, DomainState } from '../../db/index';

export const handler = async (req: NowRequest, res: NowResponse) => {
  const repo = RepositoryFactory.createRepoConnection();

  try {
    const requestUrl = new URL(req.body.url);

    const data = {
      domain: requestUrl.host,
      protocol: requestUrl.protocol,
      state: DomainState[req.body.state],
    };

    if (!data.state) {
      res.statusCode = 400;
      res.send({
        error: `State not defined '${req.body.state}', options are ${Object.entries(DomainState)
          .map(([_, value]) => value)
          .join(', ')}.`,
      });
    }

    if (process.env.VERCEL_ENV !== 'development' && process.env.AUTH_CODE !== req.headers.authorization) {
      res.statusCode = 401;
      res.send({ error: `Authorization required` });
      return;
    }

    const existingRecord = await repo.findByDomain(data);
    if (!existingRecord) {
      const newDomain = DomainMap.Create(data);
      const stored = await repo.save(newDomain);
      res.send({ ...stored });
    } else {
      existingRecord.update(data);
      const stored = await await repo.save(existingRecord);
      res.send({ ...stored });
    }
  } finally {
    await repo.dispose();
  }
};

export default handler;
