const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.nr9ns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const run = async () => {
	try {
		await client.connect();
		const database = client.db("world_tour");
		const packageCollection = database.collection("packages");
		const dataCollection = database.collection("dataCollection");

		// GET APi
		app.get("/packages", async (req, res) => {
			const cursor = packageCollection.find({});
			const result = await cursor.toArray();
			res.send(result);
		});

		// POST API
		app.post("/packages", async (req, res) => {
			const package = req.body;
			const result = await packageCollection.insertOne(package);
			res.json(result);
		});

		app.get("/confirm", async (req, res) => {
			const cursor = dataCollection.find({});
			const result = await cursor.toArray();
			res.send(result);
		});

		// POST API
		app.post("/confirm", async (req, res) => {
			const data = req.body;
			const result = await dataCollection.insertOne(data);
			res.json(result);
		});

		// DELETE API
		app.delete("/confirm/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await dataCollection.deleteOne(query);
			res.json(result);
		});

		// UPDATE API
		app.put("/confirm/:id", async (req, res) => {
			const id = req.params.id;
			const package = req.body;

			const filter = { _id: ObjectId(id) };
			const options = { upsert: true };
			const updateDoc = {
				$set: {
					status: package.status,
				},
			};
			const result = await dataCollection.updateOne(filter, updateDoc, options);
			res.json(result);
		});

		// FIND ONE
		app.get("/packages/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await packageCollection.findOne(query);
			res.send(result);
		});
	} finally {
	}
};
run().catch(console.dir);
app.get("/", (req, res) => {
	res.send("Travel server is running");
});
app.listen(port, () => {
	console.log("Travel server is running ", port);
});
