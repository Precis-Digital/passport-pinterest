# passport-pinterest

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating with [Pinterest](https://www.pinterest.com) using the OAuth 2.0 API.

[![CI](https://github.com/analog-nico/passport-pinterest/actions/workflows/ci.yml/badge.svg)](https://github.com/analog-nico/passport-pinterest/actions/workflows/ci.yml)

Supports the [Pinterest v5 API](https://developers.pinterest.com/docs/getting-started/). Plugs into Passport for seamless integration with any [Connect](http://www.senchalabs.org/connect/)-style middleware, including [Express](http://expressjs.com/).

## Installation

```bash
npm install passport-pinterest
```

## Usage

### TypeScript

```typescript
import { Strategy as PinterestStrategy, Profile } from "passport-pinterest";

passport.use(
    new PinterestStrategy(
        {
            clientID: process.env.PINTEREST_CLIENT_ID!,
            clientSecret: process.env.PINTEREST_CLIENT_SECRET!,
            callbackURL: "https://example.com/auth/pinterest/callback",
            scope: ["user_accounts:read"],
        },
        (accessToken: string, refreshToken: string, profile: Profile, done) => {
            User.findOrCreate({ pinterestId: profile.id }, (err, user) => {
                done(err, user);
            });
        },
    ),
);
```

### JavaScript

```js
const { Strategy: PinterestStrategy } = require("passport-pinterest");

passport.use(
    new PinterestStrategy(
        {
            clientID: process.env.PINTEREST_CLIENT_ID,
            clientSecret: process.env.PINTEREST_CLIENT_SECRET,
            callbackURL: "https://example.com/auth/pinterest/callback",
            scope: ["user_accounts:read"],
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOrCreate(
                { pinterestId: profile.id },
                function (err, user) {
                    done(err, user);
                },
            );
        },
    ),
);
```

### Routes

```js
app.get("/auth/pinterest", passport.authenticate("pinterest"));

app.get(
    "/auth/pinterest/callback",
    passport.authenticate("pinterest", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/");
    },
);
```

### Profile

The `profile` object passed to the verify callback:

| Field         | Type     | Description                                                                  |
| ------------- | -------- | ---------------------------------------------------------------------------- |
| `id`          | `string` | Pinterest user ID                                                            |
| `displayName` | `string` | Username, or `"<business_name> <username> (Business)"` for business accounts |
| `_json`       | `object` | Full raw response from the Pinterest API                                     |
| `_raw`        | `string` | Raw JSON string from the Pinterest API                                       |

### Scopes

See the [Pinterest scopes reference](https://developers.pinterest.com/docs/getting-started/scopes/) for the full list. Common values:

| Scope                | Description                       |
| -------------------- | --------------------------------- |
| `user_accounts:read` | Read access to the user's account |
| `pins:read`          | Read access to the user's pins    |
| `boards:read`        | Read access to the user's boards  |

> **Note:** Pinterest only allows HTTPS callback URLs in production.

## Contributing

```bash
git clone https://github.com/analog-nico/passport-pinterest.git
cd passport-pinterest
npm install
```

| Script                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm test`              | Run tests                                |
| `npm run lint`          | JSHint linting                           |
| `npm run typecheck`     | TypeScript type validation               |
| `npm run test:coverage` | Run tests with coverage report           |
| `npm run ci`            | Run all checks (lint + typecheck + test) |

## License (ISC)

See the [LICENSE file](LICENSE) for details.
