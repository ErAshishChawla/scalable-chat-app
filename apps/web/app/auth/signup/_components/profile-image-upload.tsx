"use client";

import React, { useRef } from "react";
import {
  FieldErrors,
  UseFormRegister,
  UseFormResetField,
  UseFormSetValue,
} from "react-hook-form";

import { Button, Avatar } from "@nextui-org/react";
import { CameraIcon } from "lucide-react";

import { signupSchemaType } from "../../../../zod-schemas/signup-schema";

interface ProfileImageUploadProps {
  preview: string | null;
  setPreview: (val: string | null) => void;
  register: UseFormRegister<signupSchemaType>;
  reset: UseFormResetField<signupSchemaType>;
  setValue: UseFormSetValue<signupSchemaType>;
  errors: FieldErrors<signupSchemaType>;
}

function ProfileImageUpload({
  preview,
  setPreview,
  register,
  reset,
  setValue,
  errors,
}: ProfileImageUploadProps) {
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const { ref: registerRef, onChange, ...rest } = register("profilePicture");

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const urlImage = URL.createObjectURL(file);
    setPreview(urlImage);
    setValue("profilePicture", file);
  };

  const resetProfilePicture = () => {
    setPreview(null);
    reset("profilePicture");

    // resetting the value of input field, as when same file is uploaded again, it doesn't trigger the change event
    if (profilePictureRef.current) {
      profilePictureRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <Avatar
        showFallback
        src={preview || ""}
        className="w-32 h-32"
        fallback={
          <CameraIcon
            className="animate-pulse w-6 h-6 text-default-500"
            fill="currentColor"
            size={20}
          />
        }
        isBordered
      />
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <Button
          size={"sm"}
          radius={"md"}
          color={"primary"}
          type="button"
          onClick={() => profilePictureRef.current?.click()}
        >
          <input
            type="file"
            className="hidden"
            {...rest}
            onChange={handleProfilePictureChange}
            ref={profilePictureRef}
            multiple={false}
            accept="image/*"
          />
          <span>{!preview ? "Upload Image" : "Change Image"}</span>
        </Button>
        <Button
          size={"sm"}
          radius={"md"}
          color={"danger"}
          type="button"
          isDisabled={!preview}
          onClick={resetProfilePicture}
        >
          Remove Image
        </Button>
      </div>
      {errors.profilePicture && (
        <div className="text-xs text-center text-red-500">
          {errors.profilePicture.message}
        </div>
      )}
    </div>
  );
}

export default ProfileImageUpload;
