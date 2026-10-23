import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set");
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db();
  const jobs = db.collection("Job");

  const cursor = jobs.find({
    type: { $type: "string" },
  });

  let updated = 0;
  while (await cursor.hasNext()) {
    const job = await cursor.next();
    const nextType =
      typeof job.type === "string" && job.type.trim()
        ? [job.type.trim()]
        : ["Employment"];

    await jobs.updateOne({ _id: job._id }, { $set: { type: nextType } });
    updated += 1;
    console.log(`Updated ${job.slug || job._id}: ${JSON.stringify(nextType)}`);
  }

  console.log(`Done. Updated ${updated} job(s).`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.close();
}
