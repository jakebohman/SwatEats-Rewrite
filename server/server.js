/*
*  SwatEats - A web app to help reduce food waste on Swarthmore's campus
*  Original Flask app developed by Jake Bohman, Lona Hoang, and Yana Sharifullina.
*  Converted to Node.js/Express and React by Jake Bohman.
*/

// Node.js libraries
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const crypto = require("crypto");
const cron = require("node-cron");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Paths
const reactDist = path.join(__dirname, "../client/dist");
const apiPrefixes = ['/searchIngredient', '/findRecipes', '/getComments', '/addComment', '/deleteComment'];

if (fs.existsSync(reactDist)) {
  app.use(express.static(reactDist));
  // Return index.html for any non-API GET request
  app.use((req, res, next) => {
    if (req.method !== 'GET') 
      return next();
    if (apiPrefixes.some(p => req.path.startsWith(p))) 
      return next();

    const potential = path.join(reactDist, req.path);
    if (fs.existsSync(potential) && fs.statSync(potential).isFile()) 
      return next();
    
    res.sendFile(path.join(reactDist, 'index.html'));
  });
} else {
  console.warn('\n[Warning] React build not found at client/dist. The API will still run, but static frontend files will not be served.');
  console.warn('Run `cd client; npm install` and `npm run build` to create the production build at client/dist.');
}

// ----------------------------------
// Global variables
let max_comment_id = 0;
let ingredients = {};
let recipes = [];
const mySalt = "CeZ8Bcm5YF";

// ----------------------------------
// Helper functions

// Hashing function for passwords (food sharing forum)
function hash(salt, str) {
  return crypto.createHash("sha256").update(salt + str).digest("hex");
}

function checkDietary(dietary, recipe_ingredients) {
  for (const i of recipe_ingredients) {
    const ing = ingredients[i];
    if (!ing) continue;
    for (const r of dietary) {
      if (ing[r] === "no") return false;
    }
  }
  return true;
}

// Ranks recipes based on user ingredients and method (recipe finder)
function rankRecipes(userIngredients, method, dietary) {
  let ranked = [];
  const userSet = new Set(userIngredients);

  for (const recipe of recipes) {
    const recipeSet = new Set(recipe.ingredients);
    let matches = 0;

    if (dietary.length > 0 && !checkDietary(dietary, recipe.ingredients)) {
      continue;
    }

    if (method === 0) {
      matches = [...recipeSet].filter(i => userSet.has(i)).length;
      if (matches > 0) 
        ranked.push([recipe, matches]);
    } else {
      matches = [...recipeSet].filter(i => !userSet.has(i)).length;
      if (matches < recipeSet.size) 
        ranked.push([recipe, matches]);
    }
  }

  if (method === 0)
    ranked.sort((a, b) => b[1] - a[1]);
  else
    ranked.sort((a, b) => a[1] - b[1]);

  return ranked.map(r => r[0]);
}

// ----------------------------------
// DB functions

// Connect to SQLite DB (food sharing forum)
function getDb() {
  return new sqlite3.Database("data/comments.db");
}

// Deletes a comment (food sharing forum)
function removeComment(id, password, callback) {
  const db = getDb();
  db.run(
    "CREATE TABLE IF NOT EXISTS comments (id int, author text, contact text, date text, password text, comment text)",
    (err) => {
      if (err) {
        db.close();
        return callback(err);
      }

      db.run(
        "DELETE FROM comments WHERE id=? AND password=?", [id, hash(mySalt, password)],
        function (err) {
          db.close();
          callback(err);
        }
      );
    }
  );
}

// Adds a comment (food sharing forum)
function createComment(postID, author, contact, date, password, comment, callback) {
  const today = new Date().toISOString().slice(0, 10);
  if (date < today)
    return callback(new Error("Expiration date has already passed"));

  const db = getDb();
  db.run(
    "CREATE TABLE IF NOT EXISTS comments (id int, author text, contact text, date text, password text, comment text)",
    (err) => {
      if (err) {
        db.close();
        return callback(err);
      }

      db.run(
        "INSERT INTO comments (id, author, contact, date, password, comment) VALUES (?, ?, ?, ?, ?, ?)",
        [postID, author, contact, date, hash(mySalt, password), comment],
        function (err) {
          db.close();
          callback(err);
        }
      );
    }
  );
}

// Retrieves all comments (food sharing forum)
function getComments(callback) {
  const db = getDb();
  db.all("SELECT * FROM comments", (err, rows) => {
    db.close();
    if (err) 
      return callback(err, []);
    const result = rows.map(r => {
      const { password, ...rest } = r;
      return rest;
    });
    callback(null, result);
  });
}

// Deletes expired comments every 24 hours
function every24Hours() {
  const today = new Date().toISOString().slice(0, 10);
  const db = getDb();
  db.run(
    "CREATE TABLE IF NOT EXISTS comments (id int, author text, contact text, date text, password text, comment text)"
  );
  db.run("DELETE FROM comments WHERE date < ?", [today], () => {
    db.get("SELECT MAX(id) as max FROM comments", (err, row) => {
      max_comment_id = row?.max || 0;
      db.close();
    });
  });
}

// ----------------------------------
// Load CSV data (ingredients + recipes)

// Loads ingredients from data/ingredients.csv
function loadIngredients() {
  return new Promise(resolve => {
    fs.createReadStream("data/ingredients.csv")
      .pipe(csv())
      .on("data", row => {
        const name = row["meals/strIngredient"];
        if (name)
          ingredients[name.toLowerCase()] = row;
      })
      .on("end", resolve);
  });
}

// Loads recipes from data/recipes.csv
function loadRecipes() {
  return new Promise(resolve => {
    fs.createReadStream("data/recipes.csv")
      .pipe(csv())
      .on("data", row => {
        recipes.push({
          ...row,
          ingredients: Object.values(row).slice(8, 28).filter(Boolean).map(i => i.toLowerCase()),
          measures: Object.values(row).slice(28, 48).filter(Boolean),
        });
      })
      .on("end", resolve);
  });
}

// ----------------------------------
// API Routes

// Recipe Finder API
app.post("/searchIngredient", (req, res) => {
  const query = (req.body.query || "").trim().toLowerCase();
  if (!query) 
    return res.json([]);
  const filtered = Object.keys(ingredients)
    .filter(i => i.includes(query))
    .map(i => ({ strIngredient: i }));
  res.json(filtered);
});

app.post("/findRecipes", (req, res) => {
  const userIngredients = req.body.ingredients || [];
  const method = parseInt(req.body.method);
  const dietary = req.body.dietary || [];
  res.json(rankRecipes(userIngredients, method, dietary));
});

// Food Sharing API
app.get("/getComments", (req, res) => {
  getComments((err, comments) => {
    if (err) {
      console.error(err);
      return res.status(500).json([]);
    }
    res.json(comments);
  });
});

app.post("/deleteComment", (req, res) => {

  removeComment(req.body.postID, req.body.Password, (err) => {
    if (err) {
      return res.json({ error: "Failed to delete comment" });
    }
    res.json({ message: "Comment deleted successfully!" });
  });
});

app.post("/addComment", (req, res) => {
  max_comment_id += 1;
  createComment(
    max_comment_id,
    req.body.comment_author,
    req.body.contact,
    req.body.date,
    req.body.pwrd,
    req.body.comment,
    (err) => {
      if (err) {
        return res.json({ error: "Failed to add comment" });
      }
      res.json({ message: "Comment added successfully!" });
    }
  );
});

// ----------------------------------
// Init
(async () => {
  await loadIngredients();
  await loadRecipes();
  every24Hours();

  // run every 24h
  cron.schedule("0 0 * * *", every24Hours);

  const PORT = 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})();