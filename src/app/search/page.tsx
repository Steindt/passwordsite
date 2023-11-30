import { servertoken, validate } from "@/validate";
import axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Search({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
  const validated = await validate(cookies().get("accessToken")?.value as string);
  if (!validated) {
    redirect("/auth");
    return;
  }

  const token = await servertoken();

  const getUser = async (username: string) => {
    "use server";
    const searchQuery = await axios.get(`${process.env.KEYCLOAK_BASEURL}admin/realms/${process.env.KEYCLOAK_REALM}/users`, {
      params: {
        username: username,
        exact: true
      },
      headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
      }
    }).catch((error) => {
      if (error.response.data) {
        console.log(error.response.data);
      }
    });

    if (!searchQuery || searchQuery.data.length == 0) {
      return (
        <main>
          <h1>Search failed: User not found</h1>
        </main>
      )
    }

    return(searchQuery.data[0]);
  }

  const updateUser = async () => {
    "use server";


  }

  if (!searchParams?.username) {
    return (
      <main>
        <h1>Search failed: No username supplied</h1>
      </main>
    );
  }

  const userdata = await getUser(searchParams?.username as string);

  return (
    <main>
      <h1>{userdata.username}</h1>
      <p>{userdata.email}</p>
    </main>
  )
}