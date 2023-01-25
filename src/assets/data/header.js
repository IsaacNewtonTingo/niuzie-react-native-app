import { useContext } from "react";
import { CredentialsContext } from "../../componets/context/credentials-context";

const { storedCredentials, setStoredCredentials } =
  useContext(CredentialsContext);

const { data } = storedCredentials ? storedCredentials : "";
const userID = storedCredentials ? data.userID : "";
const token = storedCredentials ? data.token : "";

export const headers = {
  Accept: "application/json",
  "auth-token": token,
};
