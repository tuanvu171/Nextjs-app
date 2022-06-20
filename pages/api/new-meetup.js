import { MongoClient } from "mongodb";

// api/new-meetup

async function handler(req, res) {
  // req.header, req.body
  if (req.method === "POST") {
    const data = req.body;

    // const { title, image, address, description } = data;

    const client = await MongoClient.connect(
      "mongodb+srv://tuanvu171:tuanvu123@cluster0.qz2xe.mongodb.net/?retryWrites=true&w=majority"
    );
    const db = client.db();

    // a collection includes multiple documents
    const meetupsCollection = db.collection("meetups"); // argument is the name of db

    const result = await meetupsCollection.insertOne(data);

    res.status(201).json({ message: "Meetup inserted" });
  }
}

export default handler;
