require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ROLES, ROLES_TOKEN_MAP } = require("../roles");
const MONGO_USER = process.env.MONGO_DB_USERNAME;
const MONGO_PASS = process.env.MONGO_DB_PASSWORD;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_COLLECTION = process.env.MONGO_COLLECTION;

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@auth.kr7x4gt.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db(MONGO_DB_NAME);

const apps = database.collection(MONGO_COLLECTION);

const serializeUser = (profile) => {
  try {
    const role = ROLES["free"];

    const user = {
      google_id: profile._json.sub,
      name: profile._json.name,
      gmail: profile._json.email,
      verified: profile._json.email_verified,
      picture: profile._json.picture,
      locale: profile._json.locale,
      role: role,
      tokens: ROLES_TOKEN_MAP[role],
      registerDate: Math.floor(new Date().getTime() / 1000),
      request: [],
    };

    return user;
  } catch (e) {
    console.log("error serializing user:", e);
    return null;
  }
};

const registerUser = async (profile) => {
  const user = serializeUser(profile);
  await fetch(process.env.INFERENCE_SERVER + "/refreshList", {
    headers: { id: user.google_id, role: user.role },
    method: "post",
  });
  await apps.insertOne(user);

  return [true, user];
};

const loginUser = async (google_id) => {
  if (google_id !== "") {
    const query = { google_id: google_id };
    const entries = await apps.findOne(query);
    let message = "";

    if (entries != null) {
      return [true, entries];
    } else {
      message = "User Not Found!";
    }

    return [false, message];
  }
};

const getTokens = async (google_id) => {
  if (google_id !== "") {
    const query = { google_id: google_id };
    const user = await apps.findOne(query);
    let message = "";

    if (user != null) {
      return [true, user["tokens"]];
    } else {
      message = "User Not Found!";
    }

    return [false, message];
  }
};

const updateTokens = async (tokens, google_id) => {
  if (google_id !== "") {
    const query = { google_id: google_id };
    await apps.updateOne(query, {
      $inc: { tokens: tokens },
    });
  }

  return true;
};

const setTokens = async (tokens, google_id) => {
  if (google_id !== "") {
    const query = { google_id: google_id };
    await apps.updateOne(query, {
      $set: { tokens: tokens },
    });
  }

  return true;
};

const updateRequests = async (request, google_id) => {
  if (google_id !== "") {
    const query = { google_id: google_id };
    const user = await apps.findOne(query);

    if (user) {
      console.log("found requests field");
      await apps.updateOne(query, {
        $addToSet: { request: request },
      });
      // }

      console.log("Logging Request Successful");
      return true;
    }
  }

  console.log("Failed to log request");
  return false;
};

module.exports = {
  registerUser,
  serializeUser,
  loginUser,
  updateTokens,
  getTokens,
  setTokens,
  updateRequests,
};
