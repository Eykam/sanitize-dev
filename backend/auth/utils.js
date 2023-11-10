const {
  getTokens,
  loginUser,
  updateTokens,
  updateRequests,
} = require("./models/user");
const fs = require("fs");
const path = require("path");
const { ROLES_TOKEN_MAP } = require("./roles");

const checkAuthenticated = (req, res, next) => {
  console.log("Checking authenticated");

  if (req.isAuthenticated()) {
    console.log("Authenticated! Continuing...");
    return next();
  }

  console.log("Unauthenticated!");
  return res.status(401).send();
};

const calculateTokensCost = (req) => {
  const cost = Number(req.headers["size"]);
  console.log("Cost:", cost);
  return cost;
};

const checkExceedsLimit = async (req, res, next) => {
  const tokens = calculateTokensCost(req);
  const [success, remainingTokens] = await getTokens(req.user.google_id);

  console.log("request cost:", tokens);
  console.log("credits:", remainingTokens);
  if (success) {
    if (remainingTokens >= tokens) {
      req.user["cost"] = tokens;
      return next();
    }
  }

  console.log("Exceeded Token Limit");
  return res.status(400).send();
};

const logout = async (req, res) => {
  console.log("======================================================");
  console.log("logging out function");
  console.log("user:", req.user);

  req.logOut((err) => {
    if (err) console.log(err);

    req.session.cookie.expires = new Date(1);

    return res.status(200).send();
  });
};

const login = async (req, res) => {
  const role = await getUserRole(req.user.google_id);
  delete req.user.role;

  req.user.tokens = (await getTokens(req.user.google_id))[1];
  req.user.new =
    Math.floor(new Date().getTime() / 1000) - req.user.registerDate <
    60 * 60 * 24;

  console.log("Users tokens: ", req.user.tokens);
  console.log("UserRole:", role);
  console.log("User Token Limit:", ROLES_TOKEN_MAP[role]);

  res.status(200).json({
    ...req.user,
    tokenLimit: ROLES_TOKEN_MAP[role],
  });
};

const getUserRole = async (google_id) => {
  const user = (await loginUser(google_id))[1];
  return user.role;
};

const logRequest = async (originalname, data, req) => {
  const request = {
    filename: originalname,
    uuid: data.filename,
    type: data.mimetype,
    size: data.size / 1000000,
    timestamp: new Date().toISOString(),
    tokensBefore: req.user.tokens,
  };

  console.log("Logging Request:", request);
  return await updateRequests(request, req.user.google_id);
};

const deductTokens = async (tokens, req, res) => {
  console.log(`Deducting ${tokens} tokens from User: ${req.user.gmail}`);

  try {
    const google_id = req.user["google_id"];
    console.log(`Updating Tokens....`);
    console.log("Current User:", google_id);
    await updateTokens(tokens * -1, google_id);

    const [success, remainingTokens] = await getTokens(google_id);

    console.log(`Results: ${success} Remaining Tokens: ${remainingTokens}`);

    if (success) return remainingTokens;
    else {
      console.log(
        "Failed to update, returning unmodified Tokens:",
        remainingTokens
      );

      return res.status(401).send();
    }
  } catch (e) {
    console.log("Error deducting tokens", e);
    return res.status(401).send();
  }
};

module.exports = {
  checkAuthenticated,
  checkExceedsLimit,
  deductTokens,
  logRequest,
  logout,
  login,
};
