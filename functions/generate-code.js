const { MongoClient } = require("mongodb");
const { nanoid } = require("nanoid");

let clientPromise;
function getClient() {
  if (!clientPromise) {
    clientPromise = MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, useUnifiedTopology: true
    });
  }
  return clientPromise;
}

exports.handler = async (event) => {
  try {
    const { creator } = JSON.parse(event.body || "{}");
    const code = nanoid(10);
    const client = await getClient();
    const db = client.db();  
    await db.collection("referrals").insertOne({
      code,
      creator: creator || "Anonymous",
      uses: 0,
      createdAt: new Date()
    });
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ code })
    };
  } catch (err) {
    console.error("GENERATE ERROR:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    };
  }
};
