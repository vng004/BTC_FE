import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../Api";
import { OrderSucces } from "../../interfaces/OrderSucces";
export const orderSuccesApiSlice = createApi({
  reducerPath: "orderSuccesApi",
  baseQuery: baseQuery,
  tagTypes: ["orderSucces"],
  endpoints: (builder) => ({
    addParcelsForOrderSucces: builder.mutation<any, string[]>({
      query: (trackingCodes) => ({
        url: "/order-succes/pdf",
        method: "POST",
        body: { trackingCode: trackingCodes },
      }),
      invalidatesTags: ["orderSucces"],
    }),
    getOrderSucces: builder.query<
      any,
      {
        keyword?: string;
        page?: number;
        per_page?: number;
        exportCode?: string;
        start_date?: string;
        end_date?: string;
      }
    >({
      query: ({
        keyword = "",
        page,
        per_page,
        exportCode,
        start_date,
        end_date,
      }) => ({
        url: `/order-succes`,
        params: {
          keyword,
          page,
          per_page,
          exportCode,
          start_date,
          end_date,
        },
      }),
      providesTags: ["orderSucces"],
    }),
    getOrderSuccesById: builder.query<OrderSucces, string | undefined>({
      query: (id) => ({
        url: `/order-succes/${id}`,
      }),
      transformResponse: (res: { data: OrderSucces }) => res.data,
      providesTags: ["orderSucces"],
    }),
    updateOrderSucces: builder.mutation<
      OrderSucces,
      { id: string; data: Partial<OrderSucces> }
    >({
      query: ({ id, data }) => ({
        url: `/order-succes/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["orderSucces"],
    }),
    removeOrderSucces: builder.mutation<OrderSucces, string>({
      query: (id) => ({
        url: `/order-succes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orderSucces"],
    }),
  }),
});
export const {
  useAddParcelsForOrderSuccesMutation,
  useGetOrderSuccesByIdQuery,
  useGetOrderSuccesQuery,
  useUpdateOrderSuccesMutation,
  useRemoveOrderSuccesMutation,
} = orderSuccesApiSlice;
