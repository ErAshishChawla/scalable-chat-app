import Link from "next/link";

import { Button } from "@nextui-org/react";

import { paths } from "../helpers/path-helpers";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 justify-center items-center p-8">
      <div className="flex flex-col gap-4 justify-center items-center">
        <h1 className="text-6xl capitalize font-bold text-center">
          Chat app project
        </h1>
        <p className="text-sm capitalize font-bold text-center text-white/50">
          A chat app project using Next.js, Tailwind CSS, and WebSockets
        </p>
        <div className="flex flex-row gap-4 justify-center items-center">
          <Link href={paths.signup()}>
            <Button size={"md"} radius={"md"} color={"secondary"}>
              Sign Up
            </Button>
          </Link>
          <Link href={paths.signin()}>
            <Button size={"md"} radius={"md"} color={"primary"}>
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
