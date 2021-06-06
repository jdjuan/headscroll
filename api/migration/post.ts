import { DbMigration, DatabaseName } from '../../db/index';
import { NowRequest, NowResponse } from '@vercel/node';

export const handler = async (req: NowRequest, res: NowResponse) => {
  if (process.env.VERCEL_ENV !== 'development' && process.env.AUTH_CODE !== req.headers.authorization) {
    res.statusCode = 401;
    res.send({ error: `Authorization required` });
    return;
  }

  const sourceRepository = req.body.source as DatabaseName;
  const targetRepository = req.body.target as DatabaseName;

  const migration = new DbMigration();
  await migration.migrate(sourceRepository, targetRepository);
  res.send("ok");
};

export default handler;
