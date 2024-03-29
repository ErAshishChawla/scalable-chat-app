"use client";

import { apiInstance } from "../../../lib/api-instance";
import React from "react";
import { useForm } from "react-hook-form";

function LogoutButton() {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data: any) => {
    const response = await apiInstance.post("/auth/signout", {});
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button
        type="submit"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </form>
  );
}

export default LogoutButton;
