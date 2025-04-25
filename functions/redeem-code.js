const { MongoClient } = require("mongodb");

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
    const { code } = JSON.parse(event.body || "{}");
    const client = await getClient();
    const db = client.db();
    const result = await db.collection("referrals")
      .findOneAndUpdate(
        { code },
        { $inc: { uses: 1 } },
        { returnDocument: "after" }
      );
    if (!result.value) throw new Error("Invalid referral code.");
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        success: true,
        creator: result.value.creator,
        totalUses: result.value.uses
      })
    };
  } catch (err) {
    console.error("REDEEM ERROR:", err);
    return {
      statusCode: err.message === "Invalid referral code." ? 400 : 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    };
  }
};
