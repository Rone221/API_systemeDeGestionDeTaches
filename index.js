const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./controllers/connexiondb");
const Tache = require("./models/Tache");

const app = express();
const adresseIp = "localhost";
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./views"));

let userName = "";

// Affichage du formulaire de bienvenue
app.get("/", (req, res) => {
  res.render("accueil");
});

// Soumission du formulaire de bienvenue
app.post("/bienvenue", async (req, res) => {
  userName = req.body.nom || "l'anonyme";
  try {
    const tasks = await Tache.findAll();
    res.render("bienvenue", { name: userName, tasks });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.status(500).send("Erreur lors de la récupération des tâches");
  }
});

// Affichage du formulaire d'ajout de tâche
app.get("/ajouttache", (req, res) => {
  res.render("ajouttache", { name: userName });
});

// Route pour ajouter une tâche
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

// Route pour afficher la page bienvenue après ajout ou suppression de tâche
app.get("/bienvenue", async (req, res) => {
  try {
    const tasks = await Tache.findAll();
    res.render("bienvenue", { name: userName, tasks });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.status(500).send("Erreur lors de la récupération des tâches");
  }
});

// Route pour supprimer une tâche
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

sequelize.sync().then(() => {
  app.listen(PORT, adresseIp, () => {
    console.log(
      `Le serveur tourne sur l'adresse: http://${adresseIp}:${PORT}/`
    );
  });
});
