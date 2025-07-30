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
const { ListObjectsV2Command, DeleteObjectCommand, S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

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

const loginUser = async ({ username, password }) => {
    const cluster = await db;

    const query = `
      SELECT META().id, users.*
      FROM \`dayton_leader\`.\`tables\`.\`users\` AS users
      WHERE users.user = $1
      LIMIT 1
    `;

    const result = await cluster.query(query, { parameters: [username] });

    if (result.rows.length === 0) {
        throw new Error("Invalid username or password.");
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error("Invalid username or password.");
    }

    const bucket = cluster.bucket('dayton_leader');
    const scope = bucket.scope('tables');
    const collection = scope.collection('users');

    const today = new Date().toLocaleDateString('en-CA');
    let role = user.role;

    if (
        user.expirationDate < today &&
        role !== "admin" &&
        role !== "expired" &&
        role !== "editor"
    ) {
        await collection.mutateIn(user.id, [
            couchbase.MutateInSpec.replace("role", "expired"),
        ]);
        role = "expired";
    }

    await collection.mutateIn(user.id, [
        couchbase.MutateInSpec.replace("lastLogin", today),
    ]);

    const token = jwt.sign(
        {
            name: user.user,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { role, name: user.user, token };
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

const s3 = new S3Client({
    region: 'auto',
    endpoint: 'https://9d9532bd43ea305593db2c6bd529f211.r2.cloudflarestorage.com',
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_KEY,
    },
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

// const upload = multer({ storage: storage });
// Create "uploads" folder if it doesn't exist
// const fs = require("fs");
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const upload = multer();

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

        const loginData = await loginUser({ username, password });
        res.status(200).send(loginData);

    } catch (err) {
        console.error("Login error:", err);
        res.status(401).send({ error: err.message || "Internal server error" });
    }
});

app.get("/protected", authenticateToken, async (req, res) => {
    try {
        const name = req.user.name; // from decoded token
        const role = req.user.role;

        // const cluster = await db;
        // const query = `
        //     SELECT users.*
        //     FROM \`dayton_leader\`.\`tables\`.\`users\` AS users
        //     WHERE users.user = $1
        //     LIMIT 1
        // `;

        // const result = await cluster.query(query, { parameters: [name] });

        // if (result.rows.length === 0) {
        //     return res.status(403).json({ error: "User not found" });
        // }

        // const user = result.rows[0];

        res.json({
            message: `Welcome, ${name}`,
            name: name,
            role: role,
        });
    } catch (err) {
        console.error("Protected route error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/columns', authenticateToken, async (req, res) => {
    const { column, title, content, date } = req.body;
    const key = `${column}`;

    try {
        const tokenRole = req.user.role;

        if (tokenRole != "admin" && tokenRole != "editor") {
            return res.status(403).json({ error: "Not authorized" });
        }

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

app.post('/about', authenticateToken, async (req, res) => {
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

app.post('/article', authenticateToken, upload.single('image'), async (req, res) => {
    const { title, author, content, date } = req.body;
    const imageFile = req.file;

    try {
        const tokenRole = req.user.role;

        if (tokenRole != "admin" && tokenRole != "editor") {
            return res.status(403).json({ error: "Not authorized" });
        }

        const cluster = await db;
        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('articles');

        let imageUrl = '';
        if (imageFile) {
            const filename = crypto.randomUUID();
            const key = `${filename}`;
            await s3.send(new PutObjectCommand({
                Bucket: 'articles',
                Key: key,
                Body: imageFile.buffer,
                ContentType: imageFile.mimetype,
            }));
            imageUrl = `https://pub-4dfb799c07964a939ef48307ae691801.r2.dev/${key}`; // Use your actual public R2 URL
        }

        // Prepare the article document
        const newArticle = {
            title,
            author,
            date,
            image: imageUrl,
            content,
        };

        console.log('📄 Article to save:', newArticle);

        // Fetch all current article keys
        const query = `
            SELECT META().id, articles.date, articles.image
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

        await cluster.query('DELETE FROM `dayton_leader`.`tables`.`comments`');

        // Insert the new article with autogenerated key
        const insertResult = await collection.insert(crypto.randomUUID(), newArticle);

        // Collect used image keys
        const usedKeys = result.rows
            .map(row => {
                const url = row.image || '';
                return url.split('/').pop();
            })
            .filter(Boolean);

        // Manually add the newly added image key if it exists
        if (imageUrl) {
            const newKey = imageUrl.split('/').pop();
            if (newKey && !usedKeys.includes(newKey)) {
                usedKeys.push(newKey);
            }
        }

        // Now fetch and clean up R2 objects
        const listResponse = await s3.send(new ListObjectsV2Command({
            Bucket: 'articles',
        }));

        const allObjects = listResponse.Contents || [];

        for (const obj of allObjects) {
            const key = obj.Key;
            if (!usedKeys.includes(key)) {
                await s3.send(new DeleteObjectCommand({
                    Bucket: 'articles',
                    Key: key,
                }));
                console.log(`🗑️ Deleted unused image: ${key}`);
            }
        }

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

app.get("/comments", async (req, res) => {
    try {
        const cluster = await db;
        const bucket = cluster.bucket("dayton_leader");
        const scope = bucket.scope("tables");
        const collection = scope.collection("comments");

        const query = `
            SELECT comments.*
            FROM \`dayton_leader\`.\`tables\`.\`comments\` AS comments
        `;

        const result = await cluster.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Fetch comments error:", err);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
});

app.post("/comments", async (req, res) => {
    const { user, text, timestamp } = req.body;

    if (!user || !text || !timestamp) {
        return res.status(400).json({ message: "Missing required comment fields." });
    }

    try {
        const cluster = await db;
        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('comments');

        await collection.upsert(crypto.randomUUID(), { user, text, timestamp });

        res.status(201).json({ message: "Comment saved." });
    } catch (err) {
        console.error("Upsert comment error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/user/:id", authenticateToken, async (req, res) => {
    try {
        const tokenUser = req.user.name;
        const { id } = req.params;

        if (tokenUser !== id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        const cluster = await db;
        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('users');

        const result = await collection.get(id);
        const user = result.content;

        res.status(200).json({
            username: user.username,
            expirationDate: user.expirationDate,
            email: user.email,
            settings: user.settings
        });
    } catch (err) {
        console.error("Error fetching user:", err);
        if (err.code === 13) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

app.put("/user/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const tokenUser = req.user.name;
        const { email, password, newPassword, notifications } = req.body;

        if (tokenUser !== id) {
            return res.status(403).json({ error: "Not authorized." });
        }

        if (!password) {
            return res.status(400).json({ error: "Password is required." });
        }

        const cluster = await db;
        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('users');

        // Get current user doc
        const result = await collection.get(id);
        const user = result.content;

        // Verify password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(403).json({ error: "Invalid password." });
        }

        const updatedUser = { ...user };

        if (email && email.trim() !== "") updatedUser.email = email;
        if (notifications && typeof notifications === "object") updatedUser.settings = notifications;

        if (newPassword && newPassword.trim() !== "") {
            const saltRounds = 10;
            updatedUser.password = await bcrypt.hash(newPassword, saltRounds);
        }

        await collection.replace(id, updatedUser);
        res.status(200).json({ message: "User updated successfully." });
    } catch (err) {
        console.error("Error updating user:", err);
        if (err.code === 13) {
            res.status(404).json({ error: "User not found." });
        } else {
            res.status(500).json({ error: "Internal server error." });
        }
    }
});

app.delete("/user/:id", authenticateToken, async (req, res) => {
    try {
        const { password } = req.body;
        const tokenUser = req.user.name;
        const { id } = req.params;

        if (!password) {
            return res.status(400).send({ error: "password is required." });
        }

        if (tokenUser !== id) {
            return res.status(403).json({ error: "Not authorized." });
        }

        const cluster = await db;
        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('users');

        const result = await collection.get(id);
        const user = result.content;

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(403).json({ error: "Invalid password." });
        }

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

app.get("/users", authenticateToken, async (req, res) => {
    try {
        const tokenRole = req.user.role;

        if (tokenRole != "admin") {
            return res.status(403).json({ error: "Not authorized" });
        }

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

app.delete("/users/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const tokenRole = req.user.role;

        if (tokenRole != "admin") {
            return res.status(403).json({ error: "Not authorized" });
        }

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

app.post("/users", authenticateToken, async (req, res) => {
    try {
        const { username, email, password, role, expirationDate, lastLogin } = req.body;
        const tokenRole = req.user.role;

        if (tokenRole != "admin") {
            return res.status(403).json({ error: "Not authorized" });
        }

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

app.post("/generate-token", authenticateToken, async (req, res) => {
    try {
        const { email, role, expirationDate } = req.body;
        const tokenRole = req.user.role;

        if (tokenRole != "admin") {
            return res.status(403).json({ error: "Not authorized" });
        }

        if (!email || !role || !expirationDate) {
            return res.status(400).send({ error: "Email, role, and expirationDate are required." });
        }

        const cluster = await db;
        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const collection = scope.collection('create-account');

        const token = require('crypto').randomBytes(24).toString('hex');
        const createdAt = new Date();

        await collection.insert(token, {
            email,
            role,
            expirationDate,
            createdAt
        });

        res.status(200).send({ token });
    } catch (err) {
        console.error("Generate token error:", err);
        res.status(500).send({ error: "Internal server error" });
    }
});

app.post('/create-account', authenticateToken, async (req, res) => {
    const { token, username, password } = req.body;
    const tokenRole = req.user.role;

    if (tokenRole != "admin") {
        return res.status(403).json({ error: "Not authorized" });
    }

    if (!token || !username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const cluster = await db;
        const bucket = cluster.bucket('dayton_leader');
        const scope = bucket.scope('tables');
        const usersCollection = scope.collection('users');
        const tokenCollection = scope.collection('create-account');

        // 1. Check if token exists
        let tokenData;
        try {
            const result = await tokenCollection.get(token);
            tokenData = result.content;
        } catch (err) {
            return res.status(404).json({ message: "One-time link doesn't exist" });
        }

        // 2. Check if token is over 1 day old
        const tokenCreatedAt = new Date(tokenData.createdAt);
        const now = new Date();
        const diffInMs = now - tokenCreatedAt;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInDays > 2) {
            await tokenCollection.remove(token); // Remove expired token
            return res.status(403).json({ message: "One-time link is expired" });
        }

        // 3. Check if username is already taken
        const checkQuery = `
            SELECT META().id
            FROM \`dayton_leader\`.\`tables\`.\`users\`
            WHERE user = $1
            LIMIT 1
        `;
        const result = await cluster.query(checkQuery, { parameters: [username] });

        if (result.rows.length > 0) {
            return res.status(409).json({ message: "Username is already taken" });
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create user account
        const today = new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD"
        const userId = `${username}`;
        await usersCollection.insert(userId, {
            user: username,
            password: hashedPassword,
            email: tokenData.email,
            role: tokenData.role || 'user',
            expirationDate: tokenData.expirationDate,
            lastLogin: today,
            settings: {
                newIssue: true,
                newArticle: true,
                columnUpdate: true,
                events: true,
                breakingNews: true,
                announcements: true,
            }
        });

        // 6. Invalidate the token
        await tokenCollection.remove(token);
        const loginData = await loginUser({ username, password });
        return res.status(200).send(loginData);
    } catch (err) {
        console.error("Create account error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

const port = process.env.PORT || 8081;
const host = "0.0.0.0";

app.listen(port, host, () => {
    console.log(`App listening at http://${host}:${port}`);
});
