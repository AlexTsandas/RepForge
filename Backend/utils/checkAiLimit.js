import AIUsage from "../models/aiUsage.js";

export async function checkAiLimit(userId) {
  try {
    await AIUsage.updateOne(
      { _id: userId },
      { $setOnInsert: { requests: [] } },
      { upsert: true }
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  await AIUsage.updateOne(
    { _id: userId },
    {
      $pull: {
        requests: { $lte: oneHourAgo },
      },
    }
  );

  const result = await AIUsage.updateOne(
    {
      _id: userId,
      "requests.6": { $exists: false },
    },
    {
      $push: {
        requests: new Date(),
      },
    }
  );

  if (result.modifiedCount === 0) {
    const error = new Error(
      "You have reached your limit of 7 AI requests per hour. Please try again later."
    );

    error.code = "AI_RATE_LIMIT";
    throw error;
  }
}