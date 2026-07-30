import { NextResponse } from "next/server";
import {
  ADMIN_LOGOUT_COOKIE,
  ADMIN_SESSION_COOKIE,
  adminLogoutCookieSetOptions,
  adminSessionCookieClearOptions,
} from "@/lib/admin-session";

function clearSessionAndRedirect(request: Request) {
  // 303 = POST-redirect-GET; also works cleanly for full-page GET navigation.
  const response = NextResponse.redirect(new URL("/admin/login", request.url), 303);

  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    "",
    adminSessionCookieClearOptions(),
  );
  // Explicitly revoke authentication even if a stale/duplicate session cookie
  // cannot be removed by the browser.
  response.cookies.set(
    ADMIN_LOGOUT_COOKIE,
    "1",
    adminLogoutCookieSetOptions(),
  );

  return response;
}

export async function POST(request: Request) {
  return clearSessionAndRedirect(request);
}

export async function GET(request: Request) {
  return clearSessionAndRedirect(request);
}
