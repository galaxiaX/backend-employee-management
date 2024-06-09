import { Request } from "express";
import { Query } from "express-serve-static-core";

export interface ReqQueryType<T extends Query> extends Request {
  query: T;
}

export interface ReqBodyType<T> extends Request {
  body: T;
}

export type ErrorType = {
  status: number;
  message: string;
};
