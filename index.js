require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());

const MONGO_URI = "mongodb://localhost:27017/DisasterDB";

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to Local MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const disasterSchema = new mongoose.Schema(
    {
        type: String,
        location: String,
        severity: String,
        status: String,
        timestamp: { type: Date, default: Date.now }
    },
    { collection: "Disasters" }
);

const Disaster = mongoose.model("Disasters", disasterSchema);

app.get("/disasters", async (req, res) => {
    try {
        const disasters = await Disaster.find();
        res.json(disasters);
    } catch (error) {
        res.status(500).json({ message: "Error fetching disasters" });
    }
});

app.post("/disasters", async (req, res) => {
    try {
        const newDisaster = new Disaster(req.body);
        await newDisaster.save();
        res.status(201).json(newDisaster);
    } catch (error) {
        res.status(500).json({ message: "Error adding disaster" });
    }
});

app.put("/disasters/:id", async (req, res) => {
    try {
        const updatedDisaster = await Disaster.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedDisaster);
    } catch (error) {
        res.status(500).json({ message: "Error updating disaster" });
    }
});

app.delete("/disasters/:id", async (req, res) => {
    try {
        await Disaster.findByIdAndDelete(req.params.id);
        res.json({ message: "Disaster deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting disaster" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
