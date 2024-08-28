import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;
const url = process.env.URL
app.use(cors());
app.use(express.json());

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// Função para gerar um ID único de 6 dígitos
async function generateUniqueID(coll: any) {
    let id;
    let isUnique = false;

    while (!isUnique) {
        id = Math.floor(100000 + Math.random() * 900000);
        const existingEvent = await coll.findOne({ id: id });
        if (!existingEvent) {
            isUnique = true; // Garante que o ID é único
        }
    }

    return id;
}

app.get("/", (req, res) => {
    res.send("Welcome!");
});

app.get("/events", async (req, res) => {
    await client.connect();
    const db = client.db("test");
    const coll = db.collection("events");

    const events = await coll.find().toArray();
    res.json(events); // Retorna os eventos como JSON
});

app.post("/createEvent", async (req, res) => {
    const { host, description } = req.body;

    if (!host || !description) {
        return res.status(400).send("Host and description are required.");
    }

    try {
        await client.connect();
        const db = client.db("test");
        const coll = db.collection("events");

        const id = await generateUniqueID(coll);

        const newEvent = {
            host: host,
            description: description,
            id: id,
            accounts: [],
        };

        // Insere o evento no banco de dados
        await coll.insertOne(newEvent);

        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/populateEvent", async (req, res) => {
    const { id, accounts } = req.body;

    if (!id || !Array.isArray(accounts) || accounts.length === 0) {
        return res.status(400).send("Event ID and a non-empty accounts array are required.");
    }

    try {
        await client.connect();
        const db = client.db("test");
        const coll = db.collection("events");

        const updateResult = await coll.updateOne(
            { id: id },
            { $addToSet: { accounts: { $each: accounts } } } // $addToSet garante que não haverá duplicatas
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).send("Event not found.");
        }

        res.status(200).json({ message: "Accounts added successfully", eventId: id });
    } catch (error) {
        console.error("Error populating event:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Método GET /event para buscar um evento pelo ID
app.get("/event", async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).send("ID is required.");
    }

    try {
        await client.connect();
        const db = client.db("test");
        const coll = db.collection("events");
        // Busca o evento com o ID fornecido
        const event = await coll.findOne({ id: parseInt(id.toString()) });

        if (!event) {
            return res.status(404).send("Event not found.");
        }

        res.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
