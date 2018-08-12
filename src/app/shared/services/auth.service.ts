import { Injectable } from "@angular/core";

export interface IUserInfo {
    altSecId?: string;
    audience: string;
    email?: string;
    expiration: Date;
    familyName: string;
    givenName: string;
    issuedAt: Date;
    issuer: string;
    name: string;
    nonce: string;
    notBefore: Date;
    objectId: string;
    passportId: string;
    roles: string[];
    subject: string;
    tenantId: string;
    uniqueName: string;
    userPrincipalName: string;
    wids: string[];
}

export interface IAuthServiceSnapshot {
    isSessionActive: boolean;
    token: string;
    userDetails: IUserInfo;
    isIw: boolean;
    isAdmin: boolean;
    isBillingAdmin: boolean;
    isCompanyAdmin: boolean;
    isAltSecUser: boolean;
}

@Injectable()
export class AuthService {
    snapshot: Partial<IAuthServiceSnapshot> = {
        userDetails: {
            tenantId: "fake-tenant",
            subject: "fake-subject"
        }
    } as IAuthServiceSnapshot;
}
