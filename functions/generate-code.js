// dependencies: npm install mongodb nanoid
const { MongoClient } = require("mongodb");
const { nanoid } = require("nanoid");

let clientPromise = null;
function getClient() {
  if (!clientPromise) {
    clientPromise = MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, useUnifiedTopology: true
    });
  }
  return clientPromise;
}

exports.handler = async (event) => {
  const { creator } = JSON.parse(event.body || "{}");
  const code = nanoid(10);           // 10-character code
  try {
    const client = await getClient();
    const db = client.db();          // database from URI: "referrals"
    await db.collection("referrals").insertOne({
      code,
      creator: creator || "Anonymous",
      uses: 0,
      createdAt: new Date()
    });
    return { statusCode: 200, body: JSON.stringify({ code }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
