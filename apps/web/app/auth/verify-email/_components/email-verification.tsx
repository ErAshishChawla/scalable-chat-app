"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Spinner } from "@nextui-org/react";
import { toast } from "sonner";

import { paths } from "../../../../helpers/path-helpers";

interface EmailVerificationProps {
  token?: string;
  message: string;
  isError?: boolean;
}

function EmailVerification({ message, isError }: EmailVerificationProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (isError) {
      toast.error(message);
    } else {
      toast.success(message);
    }

    setTimeout(() => {
      router.replace(paths.signin());
    }, 2000);
  }, [isMounted]);

  return (
    <div className="flex flex-col">
      <Spinner size={"lg"} />
    </div>
  );
}

export default EmailVerification;
