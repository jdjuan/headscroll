import { NowRequest, NowResponse } from '@vercel/node';
import { handler as getHandler } from './get';

const proxy = async (req: NowRequest, res: NowResponse): Promise<void> => {
  if (req.method === 'GET') {
    await getHandler(req, res);
  } else if (req.method === 'POST') {
    res.send('Not supported');
  }
};

export default proxy;
