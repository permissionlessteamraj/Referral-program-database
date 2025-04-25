const { MongoClient } = require("mongodb");

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
  const { code } = JSON.parse(event.body || "{}");
  try {
    const client = await getClient();
    const db = client.db();
    // खोजो कोड
    const result = await db.collection("referrals")
      .findOneAndUpdate(
        { code },
        { $inc: { uses: 1 } },
        { returnDocument: "after" }
      );
    if (!result.value) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid referral code." }) };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        creator: result.value.creator,
        totalUses: result.value.uses
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

