import { NextRequest, NextResponse } from "next/server";

import { paths } from "./helpers/path-helpers";
import { ApiResponseType } from "./types/api-response";

export default async function middleware(req: NextRequest, res: NextResponse) {
  const response = await fetch("http://localhost:3001/api/auth/check-auth", {
    method: "GET",
    headers: {
      Cookie: `chatapp-access-token=${
        req.cookies.get("chatapp-access-token")?.value
      }; chatapp-refresh-token=${
        req.cookies.get("chatapp-refresh-token")?.value
      }`,
    },
    credentials: "include",
  });

  // Create a new response to send back to the client
  let nextResponse = NextResponse.next();

  // If the API call sets any cookies, forward them to the client
  const cookies = response.headers.get("Set-cookie");
  if (cookies) {
    nextResponse.headers.set("Set-cookie", cookies);
  }

  const responseData: ApiResponseType = await response.json();
  let isAuthenticated = responseData.success;

  const currentPath = req.nextUrl.pathname;

  const isPublicPath = paths.publicPaths().includes(currentPath);
  const isProtectedPath = paths.protectedPaths().includes(currentPath);
  const isAuthPath = paths.authPaths().includes(currentPath);

  console.log("----------------------------");
  console.log("isPublicPath", isPublicPath);
  console.log("isProtectedPath", isProtectedPath);
  console.log("isAuthPath", isAuthPath);
  console.log("responseData", responseData);
  console.log("currentPath", currentPath);

  if (isPublicPath) {
    return nextResponse;
  }

  if (!isAuthenticated && isAuthPath) {
    return nextResponse;
  }

  if (isAuthenticated && isAuthPath) {
    const redirectResponse = NextResponse.redirect(
      new URL(paths.app(), req.url)
    );
    if (cookies) {
      redirectResponse.headers.set("Set-cookie", cookies);
    }
    return redirectResponse;
  }

  if (!isAuthenticated && isProtectedPath) {
    const redirectResponse = NextResponse.redirect(
      new URL(paths.signin(), req.url)
    );
    if (cookies) {
      redirectResponse.headers.set("Set-cookie", cookies);
    }
    return redirectResponse;
  }

  return nextResponse;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
