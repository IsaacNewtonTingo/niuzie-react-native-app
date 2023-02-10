import React from "react";

import { CredentialsContext } from "../componets/context/credentials-context";
import AdminNav from "./admin-nav";
import TabNavigator from "./tab-navigator";

export default function Decider() {
  return (
    <CredentialsContext.Consumer>
      {({ storedCredentials }) => (
        <>
          {storedCredentials !== "" && storedCredentials?.data.admin == true ? (
            <AdminNav />
          ) : (
            <TabNavigator />
          )}
        </>
      )}
    </CredentialsContext.Consumer>
  );
}
