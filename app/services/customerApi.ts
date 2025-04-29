import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Customer,
  CustomerFormData,
  UpdateCustomerParams,
} from "~/types/customer";

const baseUrl = import.meta.env.VITE_API_URL;

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Get the token from your auth state
      const token = localStorage.getItem("access_token");

      // If we have a token, set the authorization header
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => "/customers",
    }),
    getCustomerById: builder.query<Customer, string>({
      query: (id) => `/customers/${id}`,
    }),
    createCustomer: builder.mutation<Customer, Customer>({
      query: (customer) => ({
        url: "/customers",
        method: "POST",
        body: customer,
      }),
    }),
    updateCustomer: builder.mutation<CustomerFormData, UpdateCustomerParams>({
      query: ({ id, customer }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body: customer,
      }),
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
