import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type QueryError = FetchBaseQueryError & {
  data?: { error: string };
};
