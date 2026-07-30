import { ADMIN_SESSION_COOKIE } from "@/lib/constants";

const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours
export const ADMIN_LOGOUT_COOKIE = "questionate_admin_logged_out";

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  } as const;
}

export function adminSessionCookieSetOptions() {
  return {
    ...adminSessionCookieOptions(),
    maxAge: SESSION_MAX_AGE,
  };
}

export function adminSessionCookieClearOptions() {
  return {
    ...adminSessionCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  };
}

export function adminLogoutCookieSetOptions() {
  return {
    ...adminSessionCookieOptions(),
    maxAge: SESSION_MAX_AGE,
  };
}

export { ADMIN_SESSION_COOKIE };
