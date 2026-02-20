import {
    Strategy,
    PinterestStrategyOptions,
    Profile,
    VerifyCallback,
    VerifyFunction,
    version,
} from '../../lib/passport-pinterest';

// Minimal required options
const minimalOptions: PinterestStrategyOptions = {
    clientID: 'client-id',
    clientSecret: 'client-secret',
    callbackURL: 'https://example.com/auth/pinterest/callback',
};

// All options
const fullOptions: PinterestStrategyOptions = {
    clientID: 'client-id',
    clientSecret: 'client-secret',
    callbackURL: 'https://example.com/auth/pinterest/callback',
    scope: ['user_accounts:read'],
    state: 'some-state',
    authorizationURL: 'https://www.pinterest.com/oauth/',
    tokenURL: 'https://api.pinterest.com/v5/oauth/token',
    scopeSeparator: ',',
    sessionKey: 'oauth2:pinterest',
    profileURL: 'https://api.pinterest.com/v5/user_account',
};

// Verify function type
const verify: VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
) => {
    const id: string = profile.id;
    const provider: 'pinterest' = profile.provider;
    const name: string = profile.displayName;

    done(null, { id, provider, name });
};

// Strategy construction
const strategy = new Strategy(minimalOptions, verify);
const strategyName: 'pinterest' = strategy.name;

// Strategy with inline verify
const _strategy2 = new Strategy(fullOptions, (_accessToken, _refreshToken, profile, done) => {
    done(null, { id: profile.id });
});

// version export
const _v: string = version;
