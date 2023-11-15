import { redirect } from "next/navigation";
import axios, { AxiosResponse } from 'axios';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function AuthCallbackPage({searchParams}: {searchParams: { [key: string]: string | string[] | undefined}}) {
  // const callback = async () => {
  //   "use server";

  //   console.log("--------------");

  //   const redirect_uri = () => {
  //     const url = process.env.AUTH_REDIRECT;
  //     url?.replaceAll(':', "%3A").replaceAll('/', "%2F");
  //     return url;
  //   }

  //   const code = searchParams?.code;
  //   if (!code) {
  //     console.log("Authentication callback return with null code");
  //     redirect("auth");
  //   } else {
  //     const token = await axios.post(process.env.AUTH_TOKEN as string, {
  //       grant_type: "authorization_code",
  //       code: code,
  //       redirect_uri: redirect_uri(),
  //       client_id: process.env.AUTH_CLIENT_ID as string
  //     }, {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       }
  //     }).catch((error) => {
  //       console.log(error.response.status);
  //       console.log(error.response.data);
  //     });

  //     cookies().set("accessToken", (token as AxiosResponse<any, any>)?.data?.access_token);
  //   }
  // }

  // callback();
}