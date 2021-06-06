import { NowRequest, NowResponse } from '@vercel/node';
import { handler as postHandler } from './post';

const proxy = async (req: NowRequest, res: NowResponse): Promise<void> => {
  if (req.method === 'POST') {
    await postHandler(req, res);
  } else {
    res.send('Not supported');
  }
};

export default proxy;
