'use strict';

const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const InternalOAuthError = require('passport-oauth').InternalOAuthError;

function validateStringOption(options, optionName) {
    if (
        options[optionName] !== undefined &&
        (typeof options[optionName] !== 'string' || options[optionName].length === 0)
    ) {
        throw new TypeError(`Please pass a string to options.${optionName}`);
    }
}

/**
 * Pinterest authentication strategy for Passport.
 *
 * Authenticates requests by delegating to Pinterest using the OAuth 2.0
 * protocol: https://developers.pinterest.com/docs/getting-started/authentication/
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, then calls `done` supplying
 * a `user` (or `false` if the credentials are invalid).
 *
 * Options:
 *   - `clientID`      your Pinterest application's app id
 *   - `clientSecret`  your Pinterest application's app secret
 *   - `scope`         https://developers.pinterest.com/docs/getting-started/scopes/
 *   - `callbackURL`   URL to which Pinterest will redirect after authorization
 *
 * Example:
 *
 *     const pinterest = require('passport-pinterest');
 *
 *     passport.use(new pinterest.Strategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret',
 *         scope: ['user_accounts:read'],
 *         callbackURL: 'https://www.example.net/auth/pinterest/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate({ pinterestId: profile.id }, function(err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
class Strategy extends OAuth2Strategy {
    constructor(options, verify) {
        if (options === null || typeof options !== 'object') {
            throw new TypeError('Please pass the options.');
        }

        if (typeof verify !== 'function') {
            throw new TypeError('Please pass the verify callback.');
        }

        validateStringOption(options, 'authorizationURL');
        validateStringOption(options, 'tokenURL');
        validateStringOption(options, 'scopeSeparator');
        validateStringOption(options, 'sessionKey');
        validateStringOption(options, 'profileURL');

        options.authorizationURL = options.authorizationURL || 'https://www.pinterest.com/oauth/';
        options.tokenURL = options.tokenURL || 'https://api.pinterest.com/v5/oauth/token';
        options.scopeSeparator = options.scopeSeparator || ',';
        options.sessionKey = options.sessionKey || 'oauth2:pinterest';

        super(options, verify);

        this.name = 'pinterest';
        this._oauth2.useAuthorizationHeaderforGET(true);

        const credentials = Buffer.from(`${options.clientID}:${options.clientSecret}`).toString(
            'base64',
        );
        this._oauth2._customHeaders = {
            Authorization: `Basic ${credentials}`,
        };

        this._profileURL = options.profileURL || 'https://api.pinterest.com/v5/user_account';
    }

    /**
     * Retrieve user profile from Pinterest.
     *
     * Constructs a normalized profile:
     *
     *   - `provider`      always `pinterest`
     *   - `id`            the user's Pinterest ID
     *   - `displayName`   username, or "<business_name> <username> (Business)" for business accounts
     *
     * @param {String} accessToken
     * @param {Function} done
     * @api protected
     */
    userProfile(accessToken, done) {
        this._oauth2.get(this._profileURL, accessToken, (err, body) => {
            if (err) {
                return done(new InternalOAuthError('Failed to fetch user profile', err));
            }

            try {
                const json = JSON.parse(body);

                if (!json) {
                    return done(new Error('Pinterest API returned empty response'));
                }

                if (!/^\d+$/.test(json.id)) {
                    return done(new Error('Invalid Pinterest user ID format'));
                }

                let displayName;
                if (json.account_type === 'BUSINESS') {
                    const businessName = json.business_name || '';
                    displayName = `${businessName} ${json.username} (Business)`.trim();
                } else {
                    displayName = json.username;
                }

                done(null, {
                    provider: 'pinterest',
                    id: json.id,
                    displayName,
                    _raw: body,
                    _json: json,
                });
            } catch (e) {
                done(e);
            }
        });
    }
}

module.exports = Strategy;
