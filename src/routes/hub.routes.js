// routes/learningHub.routes.js
const express = require("express");
const router = express.Router();
const hubsController = require("../controllers/hubs.controller");

// Route for creating a new Learning Hub (Repo)
router.post("/create", hubsController.createHub);
router.post("/insert", hubsController.InsertRepo);

// Route for fetching all Learning Hubs
router.get("/", hubsController.getAllRepos);

// Route for fetching a specific Learning Hub by ID
router.get("/:slugId", hubsController.getRepoBySlug);

// Route for updating a Learning Hub by ID
router.put("/:repoId", hubsController.updateRepo);

// Route for deleting a Learning Hub by ID
router.delete("/:repoId", hubsController.deleteRepo);

// Route for forking a Learning Hub (Repo)
router.post("/fork", hubsController.forkRepo);

module.exports.HubRouter = router;
