"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import {
  loginSchema,
  loginSchemaType,
} from "../../../../zod-schemas/signin-schema";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Divider,
  Button,
  Input,
} from "@nextui-org/react";
import { EyeIcon, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { paths } from "../../../../helpers/path-helpers";
import { toastMessages } from "../../../../helpers/toast-messages";
import { signinUser } from "../_api-utils/signin-user";

//Todo: Add Api For on Submit
// Todo: if api returns error, set it to the form

function SignInCard() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const onSubmit = async (data: loginSchemaType) => {
    try {
      // Submit data to API
      const response = await signinUser(data);

      // toast for login success
      toast.success(toastMessages.loginSuccess(response.data?.data?.message));

      // reset form
      reset();
      // redirect to "/app"
      setTimeout(() => {
        router.replace(paths.app());
      }, 2000);
    } catch (error) {
      let message = toastMessages.loginError();

      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          message = toastMessages.loginError(error.response.data.message);
        }
      }

      toast.error(message);
    }
  };

  return (
    <div className="w-full max-w-96">
      <Card>
        <CardHeader className="justify-between gap-4">
          <div className="flex flex-row items-center gap-4">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              width={40}
            />
            <h1 className="text-3xl">Sign In</h1>
          </div>

          <p className="text-xs">
            <Link href={paths.signup()} className="underline">
              {" "}
              New user?
            </Link>
          </p>
        </CardHeader>
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody className="gap-6 py-8 px-4">
            <Controller
              name="email"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    className="focus:outline-none"
                    type="email"
                    label="Email"
                    isInvalid={errors.email ? true : false}
                    errorMessage={errors.email?.message}
                    isDisabled={isSubmitting}
                    {...field}
                  />
                );
              }}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? (
                          <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    isInvalid={errors.password ? true : false}
                    errorMessage={errors.password?.message}
                    isDisabled={isSubmitting}
                    {...field}
                  />
                );
              }}
            />
          </CardBody>
          <Divider />
          <CardFooter className="flex-row-reverse gap-4">
            <Button
              color={"primary"}
              fullWidth
              type="submit"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default SignInCard;
