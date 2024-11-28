import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define role-based paths
const rolePaths: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  VENDOR: "/dashboard/vendor",
  USER: "/dashboard/user",
};

// Extend withAuth to include role-based redirection
export default withAuth(
  async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Check if the request is for an API route
    if (pathname.startsWith("/api")) {
      const response = NextResponse.next();

      // Disable cache specifically for login
      if (pathname === "/api/auth/callback/credentials") {
        response.headers.set("Cache-Control", "no-store"); // Disable caching for login
      } else if (process.env.NODE_ENV === "development") {
        response.headers.set("Cache-Control", "no-store"); // Disable cache in dev
      } else {
        response.headers.set(
          "Cache-Control",
          "s-maxage=3600, stale-while-revalidate=59"
        ); // Enable cache for other API routes
      }
      return response;
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If user is not authenticated, let withAuth handle it (redirect to login)
    if (!token) return NextResponse.next();

    const userRole = token.role as string;

    // Redirect users to their appropriate dashboard if accessing unauthorized routes
    if (
      pathname.startsWith("/dashboard") &&
      !pathname.startsWith(rolePaths[userRole])
    ) {
      return NextResponse.redirect(new URL(rolePaths[userRole], req.url));
    }

    return NextResponse.next(); // Allow access if everything is valid
  },
  {
    pages: {
      signIn: "/login", // Redirect unauthenticated users to login
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"], // Apply middleware to all dashboard and API routes
};
