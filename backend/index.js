const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const passport = require("passport");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const {
  logout,
  login,
  checkAuthenticated,
  checkExceedsLimit,
  deductTokens,
  logRequest,
} = require("./auth/utils");
require("./auth/passport.js");

const FRONT_END_URL = process.env.FRONTEND_URL;
const FRONT_END_DOMAIN = process.env.FRONTEND_DOMAIN;

app.use(helmet());
app.use(cookieParser());

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [FRONT_END_DOMAIN],
    credentials: true,
  })
);

app.use(
  session({
    genid: () => {
      return crypto.randomUUID(); // use UUIDs for session IDs
    },
    secret: process.env.SESSION_SECRET_KEY,
    rolling: true,
    resave: true,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      sameSite: "strict",
      secure: true,
      maxAge: process.env.SESSION_DURATION,
      domain: FRONT_END_DOMAIN,
      httpOnly: true,
      path: "/",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ============================================ LOGIN / LOGOUT =======================================
app.get(
  "/login/google",
  passport.authenticate("google", {
    failureRedirect: "/failed",
    failureFlash: true,
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    accessType: "offline",
    approvalPrompt: "force",
    session: true,
  })
);

app.get("/test", (req, res) => {
  res.send("test");
});

app.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    failureRedirect: "/failed",
    failureFlash: true,
  }),
  function (req, res) {
    console.log("cookie:", res.get("set-cookie"));
    res.redirect(FRONT_END_URL);
  }
);

app.get("/failed", (req, res) => {
  res.send("Failed to login!");
});

app.post("/logout", checkAuthenticated, async (req, res) => {
  console.log("Logout=========================");
  await logout(req, res);
  res.status(400).send();
});

app.post("/exists", checkAuthenticated, async (req, res) => {
  console.log("Exists=========================");
  await login(req, res);
  res.status(400).send();
});

// ============================================ ROUTES =======================================

const onFileCallback = async (data, req, res, originalname) => {
  console.log("Original Name:", originalname);
  if (data) {
    data = JSON.parse(data);
    if (data["message"].includes("success")) {
      const cost = data["body"]["size"] / 1000000;
      console.log("Successfully uploaded file, costs:", cost);
      await deductTokens(cost, req, res);
      await logRequest(originalname, data["body"], req);
      return true;
    }
  }

  console.log("Failed to upload file or deduct tokens");
  return false;
};

// const onFileFailure = () => {};
// const onTranscriptionSuccess = () => {};
// const onTranscriptionFailure = () => {};
// const onCensorSuccess = () => {};
// const onCensorFailure = () => {};

app.use(
  "/auth",
  checkAuthenticated,
  createProxyMiddleware({
    target: process.env.INFERENCE_SERVER,
    changeOrigin: true,
    pathRewrite: {
      "^/auth": "", // rewrite path
    },
    onProxyRes: (proxyRes, req, res) => {
      let data = "";
      proxyRes.on("data", (dataBuffer) => {
        data += dataBuffer.toString("utf8");
        // console.log("This is the data from target server : " + data);
      });

      proxyRes.on("end", async () => {
        if (req.path === "/file")
          await onFileCallback(
            data,
            req,
            res,
            proxyRes.headers["original-name"]
          );
      });
    },
    onProxyReq: async (proxyReq, req, res) => {
      const contentType = proxyReq.getHeader("Content-Type");

      let bodyData;

      if (contentType === "application/json") {
        bodyData = JSON.stringify(req.body);
      }

      if (contentType === "application/x-www-form-urlencoded") {
        bodyData = queryString.stringify(req.body);
      }

      if (bodyData) {
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }

      if (req.path === "/file") {
        const exceedsLimit = await checkExceedsLimit(req, res);
        console.log(
          `User ${req.user.google_id}'s transaction exceedsLimit: ${exceedsLimit}`
        );
      }

      proxyReq.setHeader("x-uuid", req.user.uuid);
      proxyReq.setHeader("x-user", req.user.google_id);
    },
  })
);

app.listen(
  process.env.PORT,
  process.env.MODE === "dev" ? "0.0.0.0" : "::",
  () => {
    console.log(`server started on port ${process.env.PORT}`);
  }
);
