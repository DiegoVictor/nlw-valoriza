declare namespace Express {
  export interface Request {
    hostUrl: string;
    currentUrl: string;
    user_id: string;
  }
}
