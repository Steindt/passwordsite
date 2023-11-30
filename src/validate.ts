import axios, { AxiosResponse } from "axios";

export async function validate(client_token: string) {
  "use server";

  const response = await axios.get(`${process.env.KEYCLOAK_BASEURL}realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`, {
    headers: {
      "Authorization": client_token,
    }
  }).catch((error) => {
    console.log(error.response.data);
  });

  console.log((response as AxiosResponse<any, any>)?.data);

  if ((response as AxiosResponse<any, any>)?.status == 200) {
    return true;
  } else {
    console.error("Not validated");
    return false;
  }
}

export async function servertoken() {
  "use server";
  const authResponse = await axios.post(`${process.env.KEYCLOAK_BASEURL}realms/master/protocol/openid-connect/token`, {
    username: process.env.KEYCLOAK_ADMIN_USERNAME,
    password: process.env.KEYCLOAK_ADMIN_PASSWORD,
    grant_type: "password",
    client_id: "admin-cli"
  }, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    }
  }).catch((error) => {
    console.error(error.response.data);
    console.error(error.headers);
  });

  const accessToken = (authResponse as AxiosResponse<any, any>)?.data?.access_token;

  return accessToken;
}