"use server";
import { redirect } from "next/navigation";
import axios, { AxiosResponse } from 'axios';
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const callback = async () => {
    "use server";

    const redirect_uri = () => {
      const url = process.env.KEYCLOAK_REDIRECT;
      url?.replaceAll(':', "%3A").replaceAll('/', "%2F");
      return url;
    }

    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
      console.log("Authentication callback return with null code");
      redirect("auth");
    } else {
      const token = await axios.post(`${process.env.KEYCLOAK_BASEURL}realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`, {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri(),
        client_id: process.env.KEYCLOAK_CLIENT as string
      }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).catch((error) => {
        console.log(error.response.status);
        console.log(error.response.data);
      });

      const res = NextResponse.redirect(new URL("/", request.nextUrl.protocol + request.headers.get("host")));
      res.cookies.set("accessToken", (token as AxiosResponse<any, any>)?.data?.access_token, {
        maxAge: 300,
        httpOnly: true,
        secure: true
      });

      return res;
    }
  }

  // if (cookies().get("accessToken")) {
  //   console.log("already has token");
  //   redirect("/");
  //   return;
  // }

  return callback();
}