import { redirect } from "next/navigation";

export default async function AuthCallbackPage(request: Request, response: Response) {
  "use server";

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) {
    console.log("Authentication callback return with null code");
    redirect("auth");
  } else {
    const token = await fetch(process.env.AUTH_URL);

    return new Response("Success", {
      status: 200,
      headers: {
        "Set-Cookie": `token=${token}`
      }
    })
  }
}