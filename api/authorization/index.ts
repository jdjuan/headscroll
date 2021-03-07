import { NowRequest, NowResponse } from '@vercel/node';

const BETA_KEY = process.env.BETA_KEY;

const authorization = async (req: NowRequest, res: NowResponse): Promise<void> => {
  if (req.method === 'GET') {
    const authorized = req.query.key === BETA_KEY;
    res.send({ authorized });
  } else {
    res.send('Not supported');
  }
};

export default authorization;
