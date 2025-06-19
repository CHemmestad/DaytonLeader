// Author: Caleb Hemmestad & Griffin Urban
// ISU Netid : cihem@iastate.edu | griffinu@iastate.edu
// Date :  12 11, 2024

var express = require("express");
var cors = require("cors");
var fs = require("fs");
var bodyParser = require("body-parser");

// var app = express();
// app.use(cors());
// app.use(bodyParser.json());

// Server
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // Serve images statically

const port = "8081";
const host = "localhost";

// const { MongoClient } = require("mongodb");
const multer = require("multer");
const path = require("path");

// const url = "mongodb://127.0.0.1:27017";
// const dbName = "secoms3190";
// const client = new MongoClient(url);
// const db = client.db(dbName);

// MySQL
//jdbc:mysql://coms-3090-027.class.las.iastate.edu:3306/new_schema
const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "localhost",       // or 127.0.0.1
    user: "root",            // or your MySQL username (e.g., "Caleb")
    password: "",            // your MySQL password (empty string if none set yet)
    database: "dayton_leader", // the name of your database
    port: 3306               // default MySQL port
});

// Set up multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage });
// Create "uploads" folder if it doesn't exist
// const fs = require("fs");
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

app.post("/contact/login", (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send({ error: "Username and password are required." });
        }
        const query = "SELECT role FROM user WHERE user = ? AND password = ?";
        db.query(query, [username, password], (err, results) => {
            if (err) {
                console.error("Database error during login:", err);
                return res.status(500).send({ error: "An error occurred in Query. Please try again." });
            }
            if (results.length === 0) {
                return res.status(401).send({ error: "Invalid username or password." });
            }
            // If there is not any error, respond with code and role
            const { role } = results[0];
            res.status(200).send({ role });
        });
    } catch (err) {
        // Handle synchronous errors
        console.error("Error in GET /contact/login", err);
        res.status(500).send({ error: "An unexpected error occurred in Login: " + err.message });
    }
});

app.post('/contact/messages', (req, res) => {
    const { contactId, message } = req.body;
    const query = "INSERT INTO message (contact_id, message, message_timestamp) VALUES (?, ?, NOW())";
    try {
        db.query(query, [contactId, message], (err, results) => {
            if (err) {
                // In case of an error occurs
                console.log("Error in /contact/messages " + err);
                res.status(409).send({ error: "Error adding Review " + err });
            } else {
                // If it was successful
                res.status(201).send("Review added successfully");
            }
        });
    } catch (err) {
        console.err("Error in /contact/messages " + err);
        res.status(500).send({ error: 'Error sending review' + err });
    }
});

app.get('/contact/messages/:contactId', (req, res) => {
    const { contactId } = req.params;
    const query = "SELECT * FROM message WHERE contact_id = ? ORDER BY message_timestamp DESC";

    try {
        db.query(query, [contactId], (err, results) => {
            if (err) {
                console.error("Error fetching Messages:", err);
                return res.status(500).send({ error: "Error fetching Messages" + err });
            }
            console.log(results);
            res.status(200).json(results);
        });
    } catch (err) {
        res.status(500).send({ error: 'Error fetching messages', err });
    }
});

app.get('/contact/profile_picture/:contact_name', (req, res) => {
    const contact_name = req.params.contact_name;
    const query = "SELECT image_url FROM contact WHERE contact_name = ?";

    try {
        db.query(query, [contact_name], (err, result) => {
            if (err) {
                console.log({ error: "Error in Profile Picture" });
                return res.status(500).send({ error: "Error fetching Profile Picture :" + err });
            } else if (result.length) {
                console.log(result);
                res.json({ picture: result[0].image_url }); // return local url
            } else {
                res.status(404).send({ error: 'Profile picture not found' });
            }
        });
    } catch (err) {
        console.error("Error fetching profile picture:", err);
        res.status(500).send({ error: 'Error fetching profile picture :' + err });
    }
});


/*
-- Schema secoms3190
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `secoms3190` DEFAULT CHARACTER SET utf8 ;
USE `secoms3190` ;
-- -----------------------------------------------------
-- Table `secoms3190`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `secoms3190`.`user` (
`id` INT AUTO_INCREMENT,
`user` VARCHAR(255) NOT NULL,
`password` VARCHAR(20) NOT NULL,
`role` VARCHAR(20) NOT NULL,
`image_url` VARCHAR(255),
PRIMARY KEY (`id`)
);
INSERT INTO `secoms3190`.`user` (`user`, `password`, `role`, `image_url`)
VALUES
('Abraham Aldaco', '123', 'admin', '/uploads/robot1.png'),
('Jane Smith', '2345', 'user', '/uploads/robot2.png'),
('Alice Brown', '7788', 'user', '/uploads/robot3.png'),
('Caleb', '111', 'admin', '/uploads/robot4.png');
*/
app.get('/user/profile_picture/:contact_name', (req, res) => {
    const user = req.params.contact_name;
    const query = "SELECT image_url FROM user WHERE user = ?";

    try {
        db.query(query, [user], (err, result) => {
            if (err) {
                console.log({ error: "Error in Profile Picture" });
                return res.status(500).send({ error: "Error fetching Profile Picture :" + err });
            } else if (result.length) {
                console.log(result);
                res.json({ picture: result[0].image_url }); // return local url
            } else {
                res.status(404).send({ error: 'Profile picture not found' });
            }
        });
    } catch (err) {
        console.error("Error fetching profile picture:", err);
        res.status(500).send({ error: 'Error fetching profile picture :' + err });
    }
});

app.get("/contact", (req, res) => {
    try {
        db.query("SELECT * FROM movies", (err, result) => {
            if (err) {
                console.error({ error: "Error reading all posts:" + err });
                return res.status(500).send({ error: "Error reading all contacts" + err });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred" + err });
        res.status(500).send({ error: "An unexpected error occurred" + err });
    }
});

app.get("/contact/action", (req, res) => {
    try {
        db.query("SELECT * FROM movies WHERE category = 'action'", (err, result) => {
            if (err) {
                console.error({ error: "Error reading all posts:" + err });
                return res.status(500).send({ error: "Error reading all contacts" + err });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred" + err });
        res.status(500).send({ error: "An unexpected error occurred" + err });
    }
});

app.get("/contact/comedy", (req, res) => {
    try {
        db.query("SELECT * FROM movies WHERE category = 'comedy'", (err, result) => {
            if (err) {
                console.error({ error: "Error reading all posts:" + err });
                return res.status(500).send({ error: "Error reading all contacts" + err });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred" + err });
        res.status(500).send({ error: "An unexpected error occurred" + err });
    }
});

app.get("/contact/thriller", (req, res) => {
    try {
        db.query("SELECT * FROM movies WHERE category = 'thriller'", (err, result) => {
            if (err) {
                console.error({ error: "Error reading all posts:" + err });
                return res.status(500).send({ error: "Error reading all contacts" + err });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred" + err });
        res.status(500).send({ error: "An unexpected error occurred" + err });
    }
});

app.get("/contact/animated", (req, res) => {
    try {
        db.query("SELECT * FROM movies WHERE category = 'animated'", (err, result) => {
            if (err) {
                console.error({ error: "Error reading all posts:" + err });
                return res.status(500).send({ error: "Error reading all contacts" + err });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred" + err });
        res.status(500).send({ error: "An unexpected error occurred" + err });
    }
});

// app.get("/listRobots", async (req, res) => {
//     await client.connect();
//     console.log("Node connected successfully to GET MongoDB");

//     const query = {};
//     const results = await db
//         .collection("movie")
//         .find(query)
//         .limit(100)
//         .toArray();
//     console.log(results);

//     res.status(200);
//     res.send(results);
// });

// app.get("/:id", async (req, res) => {
//     const movieId = req.params.id;
//     console.log("Movie to find :", movieId);
//     await client.connect();
//     console.log("Node connected successfully to GET-id MongoDB");
//     const query = { movieId: movieId };
//     const results = await db.collection("movie")
//         .findOne(query);
//     console.log("Results :", results);
//     if (!results)
//         res.send("Not Found").status(404);
//     else
//         res.send(results).status(200);
// });

app.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const query = { id: id };
});

app.get("/contact/title", (req, res) => {
    const { title } = req.query;
    if (!title) {
        return res.status(400).send({ error: "title is required" });
    }
    const query = "SELECT * FROM movies WHERE LOWER(title) LIKE LOWER(?)";
    const searchValue = `%${title}%`; // Add wildcards for partial match
    try {
        db.query(query, [searchValue], (err, result) => {
            if (err) {
                console.error("Error fetching contacts:", err);
                return res.status(500).send({ error: "Error fetching contacts" });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred in GET by name" + err });
        res.status(500).send({ error: "An unexpected error occurred in GET by name" + err });
    }
});

app.post("/contact", upload.single("image"), (req, res) => {
    const { contact_name, phone_number, message } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const checkQuery = "SELECT * FROM contact WHERE contact_name = ?";
    db.query(checkQuery, [contact_name], (checkErr, checkResult) => {
        if (checkErr) {
            console.error("Database error during validation:", checkErr);
            return res.status(500).send({ error: "Error checking contact name: " + checkErr.message });
        }
        if (checkResult.length > 0) {
            // If contact_name exists, send a conflict response
            return res.status(409).send({ error: "Contact name already exists." });
        }
    });
    try {
        const query = "INSERT INTO contact (contact_name, phone_number, message, image_url) VALUES (?, ?, ?, ?)";
        db.query(query, [contact_name, phone_number, message, imageUrl], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ error: "Error adding contact" + err });
            } else {
                res.status(201).send("Contact added successfully");
            }
        });
    } catch (err) {
        // Handle synchronous errors
        console.error("Error in POST /contact:", err);
        res.status(500).send({ error: "An unexpected error occurred: " + err.message });
    }
});

// app.post("/robot", async () => {
//     if (!req.body || Object.keys(req.body).length === 0) {
//         return res.status(400).send({ error: 'Bad request: No data provided.' });
//     }
//     try {
//         await client.connect();
//         const newDocument = {
//             "id": req.body.id,
//             "name": req.body.name,
//             "price": req.body.price,
//             "description": req.body.description,
//             "imageUrl": req.body.imageUrl
//         };
//         const existingDoc = await db
//             .collection("robot")
//             .findOne({ id: newDocument.id });
//         if (existingDoc) {
//             return res
//                 .status(409)
//                 .send({ error: "Conflict: A robot with this ID already exists." });
//         }

//         console.log(newDocument);
//         const results = await db
//             .collection("robot")
//             .insertOne(newDocument);
//         res.status(200);
//         res.send(results);
//     } catch (error) {
//         console.error("An error occurred:", error);
//         res.status(500).send({ error: 'An internal server error occurred' });
//     }
// });

app.delete("/contact/:id", (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM movies WHERE id = ?";
    try {
        db.query(query, [id], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ err: "Error deleting contact" });
            } else if (result.affectedRows === 0) {
                res.status(404).send({ err: "Contact not found" });
            } else {
                res.status(200).send("Movie deleted successfully");
            }
        });
    } catch (err) {
        // Handle synchronous errors
        console.error("Error in DELETE /contact:", err);
        res.status(500).send({ error: "An unexpected error occurred in DELETE: " + err.message });
    }
});

// app.delete("/robot/:id", async (req, res) => {
//     const robotDeleted = await db.collection("robot").findOne(query);
//     try {
//         // Read parameter id
//         const id = Number(req.params.id);
//         console.log("Robot to delete :", id);
//         // Connect Mongodb
//         await client.connect();
//         // Delete by its id
//         const query = { id: id };
//         // Delete
//         const results = await db.collection("robot").deleteOne(query);
//         // Response to Client
//         res.status(200);
//         res.send(robotDeleted);
//     }
//     catch (error) {
//         console.error("Error deleting robot:", error);
//         res.status(500).send({ message: 'Internal Server Error' });
//     }
// });

// app.put("/robot/:id", async (req, res) => {
//     const robotUpdated = await db.collection("robot").findOne(query);
//     const id = Number(req.params.id); // Read parameter id
//     console.log("Robot to Update :", id);
//     await client.connect(); // Connect Mongodb
//     const query = { id: id }; // Update by its id
//     // Data for updating the document, typically comes from the request body
//     console.log(req.body);
//     const updateData = {
//         $set: {
//             "name": req.body.name,
//             "price": req.body.price,
//             "description": req.body.description,
//             "imageUrl": req.body.imageUrl
//         }
//     };
//     // Add options if needed, for example { upsert: true } to create a document if it doesn't exist
//     const options = {};
//     const results = await db.collection("robot").updateOne(query, updateData, options);
//     // Response to Client
//     res.status(200);
//     res.send(robotUpdated);
// });

app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});
