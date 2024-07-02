const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./controllers/connexiondb");
const Tache = require("./models/Tache");
const BlaguesAPI = require("blagues-api");
const blagues = new BlaguesAPI(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTA4NzA5NDExODczMzMzNjY2NyIsImxpbWl0IjoxMDAsImtleSI6IndHbk1ycWtDWFBRQ2h5NUtERWozeGcxRGtOODJtQXhMOHg3VVZnNFlna1dFQ2JNc3NVIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDctMDFUMDQ6MjY6MTArMDA6MDAiLCJpYXQiOjE3MTk4MDc5NzB9.iGchijQPXS7T_R4-ANhz81U5u8DSdBAUcqwrjNDuNxs"
);

const app = express();
const adresseIp = "localhost";
const PORT = 3000;

const { swaggerUi, specs } = require("./swagger");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.static("./views"));

app.get("/", (req, res) => {
  res.render("accueil");
});

app.get("/bienvenue", async (req, res) => {
  const name = req.query.nom || "l'anonyme";
  try {
    const tasks = await Tache.findAll();
    const joke = await blagues.random();
    res.render("bienvenue", { name, tasks, joke });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.status(500).send("Erreur lors de la récupération des tâches");
  }
});

app.post("/bienvenue", async (req, res) => {
  const name = req.body.nom || "l'anonyme";
  try {
    const tasks = await Tache.findAll();
    const joke = await blagues.random();
    res.render("bienvenue", { name, tasks, joke });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.status(500).send("Erreur lors de la récupération des tâches");
  }
});

app.get("/get-joke", async (req, res) => {
  try {
    const joke = await blagues.random();
    res.json(joke);
  } catch (error) {
    console.error("Erreur lors de la récupération de la blague:", error);
    res.status(500).send("Erreur lors de la récupération de la blague");
  }
});

// Affichage du formulaire d'ajout de tâche
app.get("/ajouttache", (req, res) => {
  const name = req.body.nom || "l'anonyme";
  res.render("ajouttache", { name });
});

app.post("/ajouttache", async (req, res) => {
  try {
    const { titre, description, delai, statut } = req.body;
    await Tache.create({ titre, description, delai, statut });
    res.redirect("/bienvenue");
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche:", error);
    res.status(500).send("Erreur lors de l'ajout de la tâche");
  }
});

app.post("/supprimer-tache/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    await Tache.destroy({ where: { id: taskId } });
    res.redirect("/bienvenue");
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
    res.status(500).send("Erreur lors de la suppression de la tâche");
  }
});

// Routes API

/**
 * @swagger
 * /api/taches:
 *   get:
 *     summary: Récupérer toutes les tâches
 *     tags: [Tâches]
 *     description: Cette route permet de récupérer toutes les tâches enregistrées dans la base de données.
 *     responses:
 *       200:
 *         description: La liste de toutes les tâches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID unique de la tâche
 *                   titre:
 *                     type: string
 *                     description: Titre de la tâche
 *                   description:
 *                     type: string
 *                     description: Description de la tâche
 *                   delai:
 *                     type: string
 *                     format: date
 *                     description: Date limite de la tâche
 *                   statut:
 *                     type: string
 *                     description: Statut de la tâche
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date de création de la tâche
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date de la dernière mise à jour de la tâche
 */
app.get("/api/taches", async (req, res) => {
  try {
    const tasks = await Tache.findAll();
    res.json(tasks);
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.status(500).send("Erreur lors de la récupération des tâches");
  }
});

/**
 * @swagger
 * /api/taches:
 *   post:
 *     summary: Ajouter une nouvelle tâche
 *     tags: [Tâches]
 *     description: Cette route permet d'ajouter une nouvelle tâche à la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - delai
 *               - statut
 *             properties:
 *               titre:
 *                 type: string
 *                 description: Titre de la tâche
 *                 example: "Nouvelle tâche"
 *               description:
 *                 type: string
 *                 description: Description de la tâche
 *                 example: "Description détaillée de la tâche"
 *               delai:
 *                 type: string
 *                 format: date
 *                 description: Date limite de la tâche
 *                 example: "2024-12-31"
 *               statut:
 *                 type: string
 *                 description: Statut de la tâche
 *                 example: "initial"
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID unique de la tâche créée
 *                 titre:
 *                   type: string
 *                   description: Titre de la tâche
 *                 description:
 *                   type: string
 *                   description: Description de la tâche
 *                 delai:
 *                   type: string
 *                   format: date
 *                   description: Date limite de la tâche
 *                 statut:
 *                   type: string
 *                   description: Statut de la tâche
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date de création de la tâche
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date de la dernière mise à jour de la tâche
 *       500:
 *         description: Erreur lors de l'ajout de la tâche
 */
app.post("/api/taches", async (req, res) => {
  try {
    const { titre, description, delai, statut } = req.body;
    const newTask = await Tache.create({ titre, description, delai, statut });
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche:", error);
    res.status(500).send("Erreur lors de l'ajout de la tâche");
  }
});

/**
 * @swagger
 * /api/taches/{id}:
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tâches]
 *     description: Cette route permet de supprimer une tâche existante en utilisant son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tâche à supprimer
 *     responses:
 *       204:
 *         description: Tâche supprimée avec succès
 *       404:
 *         description: Tâche non trouvée
 *       500:
 *         description: Erreur lors de la suppression de la tâche
 */
app.delete("/api/taches/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    await Tache.destroy({ where: { id: taskId } });
    res.status(204).send();
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
    res.status(500).send("Erreur lors de la suppression de la tâche");
  }
});

sequelize.sync().then(() => {
  app.listen(PORT, adresseIp, () => {
    console.log(
      `Le serveur tourne sur l'adresse: http://${adresseIp}:${PORT}/`
    );
  });
});
