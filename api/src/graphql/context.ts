import { Request, Response } from 'express';
import { Session } from 'express-session';

import { GRAPHQL_SERVER_BASIC_AUTH } from '../common/config';

export interface Context {
  isAdmin: boolean;
  clientIp?: string | string[];
  session?: Session & {
    userId?: number;
    discordTokenInfo?: {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
    };
  };
  req: Request;
  res: Response;
}

export const resolveContext = ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Context => {
  // Is this a great way to handle this...?
  // Nope! But it'll do for now
  let isAdmin = false;
  if (req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    const basicAuth = Buffer.from(parts[1], 'base64').toString();

    isAdmin = basicAuth === GRAPHQL_SERVER_BASIC_AUTH;
  }

  return {
    isAdmin,
    clientIp: req.headers['x-real-ip'] || req.connection.remoteAddress,
    session: req.session,
    req: req,
    res: res,
  };
};
