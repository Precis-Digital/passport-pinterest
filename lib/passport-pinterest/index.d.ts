import OAuth2Strategy = require('passport-oauth2');

export interface Profile {
    provider: 'pinterest';
    id: string;
    displayName: string;
    _raw: string;
    _json: Record<string, unknown>;
}

export type VerifyCallback = (err: Error | null, user?: object | false, info?: object) => void;

export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
) => void;

export interface PinterestStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string | string[];
    state?: string;
    authorizationURL?: string;
    tokenURL?: string;
    scopeSeparator?: string;
    sessionKey?: string;
    profileURL?: string;
}

export class Strategy extends OAuth2Strategy {
    constructor(options: PinterestStrategyOptions, verify: VerifyFunction);
    name: 'pinterest';
    userProfile(accessToken: string, done: (err: Error | null, profile?: Profile) => void): void;
}

export const version: string;
