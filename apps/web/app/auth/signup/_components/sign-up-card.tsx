"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";

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

import ProfileImageUpload from "./profile-image-upload";

import {
  signUpSchema,
  signupSchemaType,
} from "../../../../zod-schemas/signup-schema";
import { paths } from "../../../../helpers/path-helpers";

import { registerUser } from "../_api-utils/register-user";
import { uploadAvatarImage } from "../_api-utils/upload-avatar-image";

function SignUpCard() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    resetField,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<signupSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      profilePicture: undefined,
    },
  });

  // Preview State
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const setPreview = (val: string | null) => setPicturePreview(val);

  const onSubmit = async (data: signupSchemaType) => {
    try {
      const modifiedData = {
        ...data,
        profilePicture: undefined,
        profilePictureDetails: data.profilePicture
          ? {
              name: data.profilePicture.name,
              size: data.profilePicture.size,
              type: data.profilePicture.type,
            }
          : undefined,
      };

      // call the register function
      const response = await registerUser(modifiedData);

      // put request to the s3 url to upload the image if it exists
      if (data.profilePicture && response.data?.data.avatarUrl) {
        const s3Response = await uploadAvatarImage(
          response.data?.data.avatarUrl,
          data.profilePicture
        );
      }

      //Reset the form after submission
      reset();
      setPicturePreview(null);

      // if response is successful, show a toast to send a verification email
      toast.success("Verification email has been sent to your email address");

      // start a timer to redirect user to the login page
      return setTimeout(() => {
        redirect(paths.signin());
      }, 2000);
    } catch (error) {
      console.log("Error", error);

      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message ||
            "An error occurred. Please try again later"
        );
      } else {
        toast.error("An error occurred. Please try again later");
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="w-full max-w-[768px]">
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
            <h1 className="text-3xl">Sign Up</h1>
          </div>

          <p className="text-xs">
            <Link href={paths.signin()} className="underline">
              {" "}
              Already a user?
            </Link>
          </p>
        </CardHeader>
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
          <CardBody className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-8">
              <div>
                <ProfileImageUpload
                  register={register}
                  reset={resetField}
                  setValue={setValue}
                  preview={picturePreview}
                  setPreview={setPreview}
                  errors={errors}
                />
              </div>
              <div className="grid grid-cols-1 gap-y-4">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        className="focus:outline-none"
                        type="text"
                        label="First name"
                        isInvalid={errors.firstName ? true : false}
                        errorMessage={errors.firstName?.message}
                        isDisabled={isSubmitting}
                        {...field}
                      />
                    );
                  }}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        className="focus:outline-none"
                        type="text"
                        label="Last name"
                        isInvalid={errors.lastName ? true : false}
                        errorMessage={errors.lastName?.message}
                        isDisabled={isSubmitting}
                        {...field}
                      />
                    );
                  }}
                />
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
              </div>
            </div>
          </CardBody>
          <Divider />
          <CardFooter className="flex-row-reverse gap-4">
            <Button
              color={"primary"}
              fullWidth
              type="submit"
              isLoading={isSubmitting}
            >
              Sign Up
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default SignUpCard;
