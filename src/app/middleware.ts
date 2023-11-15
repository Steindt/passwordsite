import { redirect } from "next/navigation";
import axios, { AxiosResponse } from 'axios';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/auth/callback*"]
}

// export function middlware({searchParams}: {searchParams: { [key: string]: string | string[] | undefined}}) {
export async function middleware(request: NextRequest) {

  const redirect_uri = () => {
    const url = process.env.AUTH_REDIRECT;
    url?.replaceAll(':', "%3A").replaceAll('/', "%2F");
    return url;
  }

  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    console.log("Authentication callback return with null code");
    redirect("auth");
  } else {
    const token = await axios.post(process.env.AUTH_TOKEN as string, {
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

    const response = NextResponse.next();
    response.cookies.set("accessToken", (token as AxiosResponse<any, any>)?.data?.access_token);
    
    // cookies().set("accessToken", (token as AxiosResponse<any, any>)?.data?.access_token);
  }
}