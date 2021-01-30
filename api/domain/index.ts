import { NowRequest, NowResponse } from '@vercel/node';
import { handler as get } from './get';
import { handler as post } from './post';

const domains = async (req: NowRequest, res: NowResponse): Promise<void> => {
  if (req.method === 'GET') {
    return get(req, res);
  } else if (req.method === 'POST') {
    return post(req, res);
  }
};

export default domains;
