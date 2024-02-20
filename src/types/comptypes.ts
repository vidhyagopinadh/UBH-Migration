export interface BaseModalProps {
    open : boolean,
    onClose :(e?:any,r?:any) => void;
    title : string,
    confirmAction :(r:boolean) => void;
    content : string,
    subContent ?: [],
    successButtonName: string,
    timeRemaining ?:any,
    lastReminderSendAt ?:any,
    type ?:string,
    closeButtonName:string,
    feedbackFailedUploads ?:[],
    feedbackFailedSubTitle ?:string,
}

export interface UserProps {
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    name: String,
    groups:String,
    role: String,
    id: String,
    emailVerified: Boolean,
    profilePicId: String,
}

export interface TokenProps {
    exp: number;
    iat: number;
    auth_time: number;
    jti: string;
    iss: string;
    aud: string;
    sub: string;
    typ: string;
    azp: string;
    nonce: string;
    session_state: string;
    acr: string;
    'allowed-origins': string[];
    realm_access: Realmaccess;
    resource_access: Resourceaccess;
    scope: string;
    sid: string;
    email_verified: boolean;
    name: string;
    given_name: string;
    family_name: string;
    email: string;
  }
  interface Resourceaccess {
    account: Realmaccess;
  }
  interface Realmaccess {
    roles: string[];
  }