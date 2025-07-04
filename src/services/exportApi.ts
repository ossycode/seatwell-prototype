import { ExportType } from "@/types/export";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const exportApi = createApi({
  reducerPath: "exportApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin/export" }),
  endpoints: (build) => ({
    exportData: build.mutation<Blob, ExportType>({
      query: (type) => ({
        url: `/${type}`,
        responseHandler: async (response) => response.blob(),
      }),
    }),
  }),
});

export const { useExportDataMutation } = exportApi;
