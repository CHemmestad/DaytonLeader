require("dotenv").config();
var express = require("express");
var cors = require("cors");
var fs = require("fs");
var bodyParser = require("body-parser");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const couchbase = require("couchbase");
const { DocumentNotFoundError } = require("couchbase");
const bcrypt = require('bcrypt');


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // format: "Bearer <token>"

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// var app = express();
// app.use(cors());
// app.use(bodyParser.json());

// Server
var app = express();
// app.use(cors());
const allowedOrigins = ["http://localhost:3000", "https://chemmestad.github.io"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // Serve images statically

// const port = "8081";
// const host = "localhost";

// const { MongoClient } = require("mongodb");


// const url = "mongodb://127.0.0.1:27017";
// const dbName = "secoms3190";
// const client = new MongoClient(url);
// const db = client.db(dbName);

// MySQL
//jdbc:mysql://coms-3090-027.class.las.iastate.edu:3306/new_schema

// const db = mysql.createConnection({
//     host: "localhost",       // or 127.0.0.1
//     user: "root",            // or your MySQL username (e.g., "Caleb")
//     password: "",            // your MySQL password (empty string if none set yet)
//     database: "dayton_leader", // the name of your database
//     port: 3306               // default MySQL port
// });

// User inputs
const clusterConnStr = process.env.COUCHBASE_CONN_STR;
const username = process.env.COUCHBASE_USER;
const password = process.env.COUCHBASE_PASS;

const db = couchbase.connect(clusterConnStr, {
    username,
    password,
    configProfile: "wanDevelopment",
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

// This is your test secret API key.
const stripeKey = process.env.STRIPE_KEY;
const stripe = require('stripe')(stripeKey);
const YOUR_DOMAIN = 'https://chemmestad.github.io';

app.post('/create-checkout-session', async (req, res) => {
    const { priceId } = req.body;

    if (!priceId) {
        return res.status(400).json({ error: 'Missing priceId' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment', // or 'payment' if you're not using recurring plans
            return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
        });

        res.send({ clientSecret: session.client_secret });
    } catch (err) {
        console.error('Error creating checkout session:', err);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});


app.get('/session-status', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    res.send({
        status: session.status,
        customer_email: session.customer_details.email
    });
});

app.post("/contact/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send({ error: "Username and password are required." });
        }

        const cluster = await db;
        const query = `
      SELECT META().id, users.*
      FROM \`dayton_leader\`.\`tables\`.\`users\` AS users
      WHERE users.user = $1
      LIMIT 1
    `;

        const result = await cluster.query(query, { parameters: [username] });

        if (result.rows.length === 0) {
            return res.status(401).send({ error: "Invalid username or password." });
        }

        const user = result.rows[0];

        // console.log("Password submitted:", password);
        // console.log("Password hash in DB:", user.password);
        const match = await bcrypt.compare(password, user.password);
        // console.log("Password match result:", match);

        // if (user.password !== password) {
        //     return res.status(401).send({ error: "Invalid username or password." });
        // }

        if (!match) {
            return res.status(401).send({ error: "Invalid username or password2." });
        }

        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('users');

        const today = new Date().toISOString().split("T")[0];
        let role = user.role;

        if (user.expirationDate < today && (user.role !== "admin" && user.role !== "expired")) {
            await collection.mutateIn(user.id, [
                couchbase.MutateInSpec.replace("role", "expired")
            ]);
            role = "expired";
        }

        await collection.mutateIn(user.id, [
            couchbase.MutateInSpec.replace("lastLogin", today)
        ]);

        const token = jwt.sign(
            { name: user.user },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).send({ role, name: user.user, token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send({ error: "Internal server error" });
    }
});

app.get("/protected", authenticateToken, async (req, res) => {
    try {
        const name = req.user.name; // from decoded token

        const cluster = await db;
        const query = `
            SELECT users.*
            FROM \`dayton_leader\`.\`tables\`.\`users\` AS users
            WHERE users.user = $1
            LIMIT 1
        `;

        const result = await cluster.query(query, { parameters: [name] });

        if (result.rows.length === 0) {
            return res.status(403).json({ error: "User not found" });
        }

        const user = result.rows[0];

        res.json({
            message: `Welcome, ${user.user}`,
            name: name,
            role: user.role,
        });
    } catch (err) {
        console.error("Protected route error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post('/columns', async (req, res) => {
    const { column, title, content, date } = req.body;
    const key = `${column}`;

    try {
        const cluster = await db;

        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('columns');
        // Try upserting (will create or overwrite if exists)
        console.log('Saving to:', key);
        console.log('Data:', { title, content, date });
        console.log('Using bucket/scope/collection: dayton_leader/tables/columns');
        await collection.upsert(key, {
            title,
            content,
            date,
        });
        res.status(200).json({ message: 'Column saved' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save column' });
    }
});

app.get('/columns/:column', async (req, res) => {
    const { column } = req.params;
    const key = column;

    try {
        const cluster = await db;
        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('columns');

        const result = await collection.get(key);

        res.status(200).json(result.value); // title, content, date
    } catch (err) {
        console.error('Error fetching column:', err);
        res.status(404).json({ error: 'Column not found' });
    }
});

app.post('/about', async (req, res) => {
    const { text } = req.body;
    const key = 'about';

    try {
        const cluster = await db;
        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('about'); // You can use a separate collection for clarity

        console.log('Saving About content to:', key);
        await collection.upsert(key, {
            text,
        });

        res.status(200).json({ message: 'About section saved' });
    } catch (err) {
        console.error('Failed to save About section:', err);
        res.status(500).json({ error: 'Failed to save About section' });
    }
});

app.get('/about', async (req, res) => {
    const key = 'about';

    try {
        const cluster = await db;
        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('about');

        const result = await collection.get(key);
        res.status(200).json(result.value);
    } catch (err) {
        console.error('Failed to fetch About section:', err);
        res.status(404).json({ error: 'About section not found' });
    }
});

app.post('/article', upload.single('image'), async (req, res) => {
    const { title, author, content, date } = req.body;
    const imageFile = req.file;

    try {
        const cluster = await db;
        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('articles');

        // Prepare the article document
        const newArticle = {
            title,
            author,
            date,
            image: `/uploads/${imageFile.filename}`,
            content,
        };

        console.log('📄 Article to save:', newArticle);

        // Fetch all current article keys
        const query = `
            SELECT META().id, articles.date
            FROM \`dayton_leader\`.\`tables\`.\`articles\` AS articles
            ORDER BY articles.date ASC
        `;
        const result = await cluster.query(query);

        // If there are already 3 articles, delete the oldest (FIFO)
        if (result.rows.length >= 3) {
            const oldestId = result.rows[0].id;
            console.log('🗑️ Deleting oldest article:', oldestId);
            await collection.remove(oldestId);
        }

        // Insert the new article with autogenerated key
        const insertResult = await collection.insert(crypto.randomUUID(), newArticle);

        console.log('✅ Article saved with key:', insertResult.cas.toString());
        res.status(200).json({ message: 'Article saved' });

    } catch (err) {
        console.error('❌ Failed to save article:', err);
        res.status(500).json({ error: 'Failed to save article' });
    }
});

app.get('/article', async (req, res) => {
    try {
        const cluster = await db;

        // Get articles sorted by date DESC
        const query = `
            SELECT articles.*
            FROM \`dayton_leader\`.\`tables\`.\`articles\` AS articles
            ORDER BY articles.date DESC
            LIMIT 3
        `;

        const result = await cluster.query(query);

        const articles = Array.isArray(result)
            ? (Array.isArray(result[0]) ? result[0] : result)
            : (Array.isArray(result.rows) ? result.rows : []);

        res.status(200).json(articles);
    } catch (err) {
        console.error('Error fetching articles:', err);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.get("/users", async (req, res) => {
    try {
        const cluster = await db;

        const query = `
        SELECT META().id,
                users.user AS username,
                users.email,
                users.\`role\`,
                users.expirationDate,
                users.lastLogin
        FROM \`dayton_leader\`.\`tables\`.\`users\` AS users
        `;
        const result = await cluster.query(query);

        const users = Array.isArray(result?.rows) ? result.rows : [];

        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const cluster = await db;
        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('users');

        await collection.remove(id);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        if (err.code === 13) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

app.post("/users", async (req, res) => {
    try {
        const { username, email, password, role, expirationDate, lastLogin } = req.body;

        if (!username || !email || !password || !role) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const cluster = await db;
        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('users');

        try {
            await collection.get(username);
            return res.status(409).json({ error: "Username already exists." });
        } catch (err) {
            if (err instanceof DocumentNotFoundError) {
                // This is expected — do nothing
            } else {
                console.error("Unexpected error checking user:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            user: username,
            email,
            password: hashedPassword,
            role,
            expirationDate,
            lastLogin,
            settings: {
                newIssue: true,
                newArticle: true,
                columnUpdate: true,
                events: true,
                breakingNews: true,
                announcements: true,
            }
        };

        await collection.insert(username, userData);

        res.status(201).json({ message: "User created", userId: username });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


// app.post("/contact/login", async (req, res) => {
//     let num = 0;
//   try {
//     const { username, password } = req.body;
//     num = 2;
//     if (!username || !password) {
//       return res.status(400).send({ error: "Username and password are required." });
//     }

//     num = 3;
//     const cluster = await db; // `db` is your connected cluster promise
//     num = 4;
//     const bucket = cluster.bucket("dayton_leader");
//     num = 5;
//     const collection = bucket.scope("tables").collection("users");
//     num = 6;

//     const userId = username;
//     num = 7;
//     const result = await collection.get("user");
//     num = 8;

//     if (result.content.password !== password) {
//       return res.status(401).send({ error: `Invalid username or password.${username} ${userId} ${password}` });
//     }

//     res.status(200).send({ role: result.content.role });

//   } catch (err) {
//     if (err instanceof couchbase.DocumentNotFoundError) {
//       return res.status(401).send({ error: `DocumentNotFoundError ${num}` });
//     }
//     console.error("Login error:", err);
//     res.status(500).send({ error: "DocumentNotFoundError2" });
//   }
// });

// app.post("/contact/login", (req, res) => {
//     try {
//         const { username, password } = req.body;
//         if (!username || !password) {
//             return res.status(400).send({ error: "Username and password are required." });
//         }
//         const query = "SELECT role FROM user WHERE user = ? AND password = ?";
//         db.query(query, [username, password], (err, results) => {
//             if (err) {
//                 console.error("Database error during login:", err);
//                 return res.status(500).send({ error: "An error occurred in Query. Please try again." });
//             }
//             if (results.length === 0) {
//                 return res.status(401).send({ error: "Invalid username or password." });
//             }
//             // If there is not any error, respond with code and role
//             const { role } = results[0];
//             res.status(200).send({ role });
//         });
//     } catch (err) {
//         // Handle synchronous errors
//         console.error("Error in GET /contact/login", err);
//         res.status(500).send({ error: "An unexpected error occurred in Login: " + err.message });
//     }
// });

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

const port = process.env.PORT || 8081;
const host = "0.0.0.0";

app.listen(port, host, () => {
    console.log(`App listening at http://${host}:${port}`);
});


// app.listen(process.env.PORT, () => {
//     console.log("App listening at http://%s:%s", host, port);
// });
