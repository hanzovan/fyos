import { Session } from "next-auth";

// declare custom session
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string | undefined;
      name?: string | null | undefined;
      email?: string | null;
      role?: string | undefined;
      avatar?: string | undefined;
    };
  }
}