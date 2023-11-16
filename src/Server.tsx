"use server";
import { cookies } from "next/headers";
import axios, { AxiosResponse } from "axios";
import { redirect, useSearchParams } from "next/navigation";

export async function setAccessToken(code: string) {
  const redirect_uri = () => {
    const url = process.env.AUTH_REDIRECT;
    url?.replaceAll(":", "%3A").replaceAll("/", "%2F");
    return url;
  }

  const accessToken = await axios.post(process.env.AUTH_TOKEN as string, {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirect_uri(),
    client_id: process.env.AUTH_CLIENT_ID as string
  }, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).catch((error) => {
    console.log(error.response.status);
    console.log(error.response.data);
  });

  console.log(accessToken);
  cookies().set("accessToken", (accessToken as AxiosResponse<any, any>).data.access_token);
}