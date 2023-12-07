export interface userinfo {
  id: string;
  createdTimestamp: number;
  username: string;
  enabled: boolean;
  totp: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  email: string;
  federationLink: string;
  attributes: {
    LDAP_ENTRY_DN: [string];
    uidNumber: [string];
    aliasEmail: [string];
    LDAP_ID: [string];
    modifyTimestamp: [string];
    createTimestamp: [string];
  };
  disableableCredentialTypes: [string];
  requiredActions: [string];
  notBefore: number;
  access: {
    manageGroupMemberships: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
  };
}