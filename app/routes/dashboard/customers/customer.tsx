"use client";

import { CustomerForm } from "~/components/forms/customer-form";
import { useNavigate } from "react-router";
import type { Route } from "./+types/customer";
import type { Customer, CustomerFormData } from "~/types/customer";
import { Form } from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "~/lib/validations/customer";
import {
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from "~/services/customerApi";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customer Details" },
    { name: "description", content: "Customer Details" },
  ];
}

const CustomerDetails = ({ params }: Route.ComponentProps) => {
  const { customerId } = params;
  const {
    data: customer,
    error,
    isLoading: loading,
  } = useGetCustomerByIdQuery(customerId);

  if (!customer) {
    return <div>Customer not found</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: Error in get customer details</div>;
  }

  return <CustomerEdit customer={customer} />;
};

const CustomerEdit = ({ customer }: { customer: Customer }) => {
  const navigate = useNavigate();
  const [updateCustomer] = useUpdateCustomerMutation();
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer,
  });

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      await updateCustomer({
        id: customer._id,
        customer: {
          ...data,
          _id: customer._id,
        },
      }).unwrap(); // Added unwrap() to handle the promise correctly
      navigate("/admin/customers");
    } catch (error) {
      console.log("Error updating customer:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CustomerForm form={form} title="Edit Customer" />
        </form>
      </Form>
    </div>
  );
};

export default CustomerDetails;
