import React from "react";

import {
  CredentialsContext,
  AuthContext,
} from "../componets/context/credentials-context";
import AdminNav from "./admin-nav";
import AuthNav from "./auth-nav";
import TabNavigator from "./tab-navigator";

export default function Decider() {
  return (
    <CredentialsContext.Consumer>
      {({ storedCredentials }) => (
        <AuthContext.Consumer>
          {({ auth }) => (
            <>
              {storedCredentials !== "" &&
              storedCredentials?.data.admin == true ? (
                <AdminNav />
              ) : auth == true ? (
                <AuthNav />
              ) : (
                <TabNavigator />
              )}
            </>
          )}
        </AuthContext.Consumer>
      )}
    </CredentialsContext.Consumer>
  );
}
