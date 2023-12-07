"use server";

import { servertoken } from "@/validate";
import axios from "axios";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getUser } from "../../db";

export async function GET(request: NextRequest) {
  const done = async () => {
    "use server";

    const redirect_uri = () => {
      const url = process.env.DONE_REDIRECT;
      url?.replaceAll(':', "%3A").replaceAll('/', "%2F");
      return url;
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      console.log("Invalid id on redirect, redirecting");
      redirect("https://dsek.se");
    } else {
      const token = await servertoken();

      const userdata = await getUser(id);

      // Updates user's email back to previous user email
      await axios.put(`${process.env.KEYCLOAK_BASEURL}admin/realms/${process.env.KEYCLOAK_REALM}/users/${userdata.id}`, {
        email: userdata.email
      }, {
        headers: {
          "Authorization": "Bearer " + token
        }
      }).catch((error) => {
        console.error("Couldn't update user back to original email");
      });
    }
  }

  done();

  redirect("https://dsek.se");
}