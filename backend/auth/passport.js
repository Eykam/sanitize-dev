const passport = require("passport");
const { loginUser, registerUser } = require("./models/user");
const GoogleStrategy = require("passport-google-oauth20");
const crypto = require("crypto");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: process.env["GOOGLE_CALLBACK_URL"],
    },

    async function (accessToken, refreshToken, profile, cb) {
      try {
        const google_id = profile._json.sub;
        const [found, data] = await loginUser(google_id);

        if (found) {
          console.log("User Found!");
          return cb(false, data);
        } else {
          console.log("User Not Found, Registering...");
          const [success, user] = await registerUser(profile);

          if (success) {
            console.log("Successfully created user!");
            return cb(false, user);
          }
        }

        return cb(null, false, { message: "failed to register or login" });
      } catch (e) {
        console.log("Error in google strategy:", e);
        return cb(null, false, { message: "failed to register or login" });
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(async function () {
    try {
      const res = await fetch(process.env.INFERENCE_SERVER + "/ttl", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          origin: process.env.FRONTEND_URL,
        },
        body: JSON.stringify({ key: user.google_id + ":" + user.role }),
      });

      const data = await res.json();
      console.log("Found TTL:", data);
      user["nextRefresh"] = data["ttl"];

      user["uuid"] = crypto.randomUUID();

      return cb(null, user);
    } catch (e) {
      console.log("Failed to Serialize User");
      return cb(null, false, { message: "failed to get ttl" });
    }
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(async function () {
    return cb(null, user);
  });
});
