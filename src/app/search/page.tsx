import Textfield from "@/components/Textfield";
import { addUser } from "@/db";
import { userinfo } from "@/types";
import { servertoken, validate } from "@/validate";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Search({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
  const validated = await validate(cookies().get("accessToken")?.value as string);
  if (!validated) {
    redirect("/auth");
    return;
  }
  
  const back = async () => {
    "use server";
  
    redirect("/");
  }

  const failed = (
    <main>
        <h1>Search failed: User not found</h1>
        <form action={back}>
          <button type="submit">Back</button>
        </form>
      </main>
  );
  
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
        <form action={back}>
          <button type="submit">Back</button>
        </form>
      </main>
      );
    }

    return(searchQuery.data[0]);
  }
  
  if (!searchParams?.username) {
    return (
      <main>
        <h1>Search failed: No username supplied</h1>
      </main>
    );
  }
  
  const userdata: userinfo = await getUser(searchParams?.username as string);

  if (!userdata.username) {
    return failed;
  }

  
  const updateUser = async (formData: FormData) => {
    "use server";

    if (!userdata) {
      return (
        <main>
          <h1>Internal Error</h1>
        </main>
      );
    }

    // Updates user's email to the given email
    await axios.put(`${process.env.KEYCLOAK_BASEURL}admin/realms/${process.env.KEYCLOAK_REALM}/users/${userdata.id}`, {
      email: formData.get("result")
    }, {
      headers: {
        "Authorization": "Bearer " + token
      }
    }).catch((error) => {
      console.error("Couldn't update user");
    });

    // Updates requiredActions on user's account to force password reset
    await axios.put(`${process.env.KEYCLOAK_BASEURL}admin/realms/${process.env.KEYCLOAK_REALM}/users/${userdata.id}`, {
      id: userdata.id,
      emailVerified: false,
      requiredActions: ["UPDATE_PASSWORD"]
    }, {
      headers: {
        "Authorization": "Bearer " + token
      }
    }).catch((error) => {
      console.error("Couldn't update requiredActions");
    });

    // Makes keycloak send an action email to the user
    await axios.put(`${process.env.KEYCLOAK_BASEURL}admin/realms/${process.env.KEYCLOAK_REALM}/users/${userdata.id}/execute-actions-email`, null, {
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      params: {
        client_id: process.env.KEYCLOAK_CLIENT,
        redirect_uri: process.env.BASEURL + "redirect/" + userdata.id
      }
    }).catch((error) => {
      console.error("Couldn't execute mail actions");
      console.error(error);
      redirect("/");
    });


    // setTimeout(async () => {
    //   // Updates user's email back to previous user email
    //   await axios.put(`${process.env.KEYCLOAK_BASEURL}admin/realms/${process.env.KEYCLOAK_REALM}/users/${userdata.id}`, {
    //     email: userdata.email
    //   }, {
    //     headers: {
    //       "Authorization": "Bearer " + token
    //     }
    //   }).catch((error) => {
    //     console.error("Couldn't update user back to original email");
    //   });
    // }, 24 * 60 * 60 * 1000);

    // addUser(userdata);

    redirect("/");
  }

  const getTimeString = () => {
    let timestamp = userdata.attributes.createTimestamp.toString();
    let date = timestamp.slice(0, 4) + "/" + timestamp.slice(4, 6) + "/" + timestamp.slice(6, 8) + " " + timestamp.slice(8, 10) + ":" + timestamp.slice(10, 12) + ":" + timestamp.slice(12, 14);
    return date;
  }

  return (
    <main>
      <h1>{userdata.username}</h1>
      <p>Namn: {`${userdata.firstName} ${userdata.lastName}`}</p>
      <p>Email: {userdata.email}</p>
      <p>Aktiverad: {userdata.enabled ? "true" : "false"}</p>
      <p>Verifierad: {userdata.emailVerified ? "true" : "false"}</p>
      <p>Skapad: {getTimeString()}</p>
      <Textfield buttonText={"Reset password"} placeholder={"Email to send to"} func={updateUser}/>
      {/* <form action={updateUser}>
        <input type="email" name="email" placeholder="Email to send to"></input>
        <button type="submit">Reset password</button>
      </form> */}
      <form action={back}>
        <button type="submit">Back</button>
      </form>
    </main>
  );
}
