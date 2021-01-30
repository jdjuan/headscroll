import { DomainRepository } from '../../db/index';
import { NowRequest, NowResponse } from '@vercel/node';
import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';

export const handler = async (req: NowRequest, res: NowResponse) => {
  const domainId = req.query.domainId as string;
  const targetPath = req.query.targetPath ?? '';

  const repo = new DomainRepository();
  const domainMap = await repo.get(domainId);
  const targetUrl = `${domainMap.protocol}://${domainMap.domain}/${targetPath}`;

  const response = await axios.get(targetUrl);

  const parsedResponse = await parseResponse(response);
  for (const [key, value] of parsedResponse.headers) {
    res.setHeader(key, value);
  }

  return res.send(parsedResponse.body);
};

const parseResponse = async (response: AxiosResponse): Promise<{ body: string; headers: Map<string, string> }> => {
  if (response.headers['content-type'].includes('text/html')) {
    const html = response.data;
    const $ = cheerio.load(html);
    const originalDomainURL = new URL(response.config.url);

    const baseTag = `<base href="${originalDomainURL.protocol}//${originalDomainURL.host}" target="_blank">`;
    $('head').prepend(baseTag);

    const body = $.html();
    const headers = cleanUpHeaders(response.headers);

    return { body, headers };
  } else {
    return { headers: new Map(), body: 'Sorry Only HTML Websites' };
  }
};

const cleanUpHeaders = (headers: any): Map<string, string> => {
  const copy = Object.assign({}, headers, {
    'content-type': 'text/html; charset=UTF-8',
  });

  delete copy['transfer-encoding'];
  return new Map(Object.entries(copy));
};

export default handler;
