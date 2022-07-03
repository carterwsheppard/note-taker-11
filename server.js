const express = require("express");
const path = require("path");
const fs = require("fs");

//get database info
const notes = require("./db/db.json");

//Unique ID node module
const uniqid = require("uniqid");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static("public"));

//route for note html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
})

//route for notes from database
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        const parsedData = JSON.parse(data);
        res.json(parsedData);
    })
})

//post route for new note (function to handle left inside)
app.post("/api/notes", (req, res) => {
    const { title, text } = req.body;
    const newNote = {
        title,
        text,
        id: uniqid()
    }

    //Reads the current info in the db file and pushes new object
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        const parsedData = JSON.parse(data);
        parsedData.push(newNote);

        fs.writeFile("./db/db.json", JSON.stringify(parsedData, null, 4), err => {
            const response = {
                status: "success",
                body: newNote
            }
        
            console.log(response);
            res.json(response);
        })
    })
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
})