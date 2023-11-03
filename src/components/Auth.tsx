import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Auth() {
  const onSubmit = async (formData: FormData) => {
    "use server";

    const state = Math.random().toString(36).substring(2, 20);
    const redirect_uri = () => {
      const url = process.env.AUTH_REDIRECT;
      url?.replaceAll(":", "%3A").replaceAll("/", "%2F");
      return url;
    }

    cookies().set("state", state);
    redirect(`${process.env.AUTH_URL}${redirect_uri()}&response_type=code&state=${state}`);
  }

  return (
    <form action={onSubmit}>
      <button type="submit">Login</button>
    </form>
  )
}