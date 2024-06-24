// middleware.ts

import { NextResponse } from "next/server";

export function middleware() {
  // Create a new response object
  const res = new NextResponse(null, {
    status: 204, // Status 204 for preflight OPTIONS request
    headers: {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, DELETE, PATCH, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers":
        "Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    },
  });

  return res;
}

// Specify the path regex to apply the middleware to
export const config = {
  matcher: "/api/:path*",
};
