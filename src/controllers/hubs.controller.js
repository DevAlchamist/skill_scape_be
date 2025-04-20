const { HubService } = require("../services/hubs.service");

class HubController {
  // Create a new Learning Hub (Repo) from AI response
  async createHub(req, res) {
    const { prompt } = req.body;

    try {
      const hub = await HubService.createHub({ prompt });
      console.log(hub);
      res.status(201).json(hub);
    } catch (err) {
      console.error("Hub Creation Failed:", err);
      res.status(500).json({ error: err.message || "AI generation failed." });
    }
  }
  async InsertRepo(req, res) {
    try {
      const { userId, prompt, aiResponse } = req.body;
      const newRepo = await HubService.InsertHub(userId, prompt, aiResponse);
      res.status(201).json(newRepo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get all Learning Hubs
  async getAllRepos(req, res) {
    try {
      const repos = await HubService.getAllRepos();
      res.status(200).json(repos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get a specific Learning Hub by ID
  async getRepoBySlug(req, res) {
    try {
      const { slugId } = req.params;
      console.log(slugId)
      const repo = await HubService.getRepoBySlug(slugId);
      if (!repo) return res.status(404).json({ message: "Repo not found." });
      res.status(200).json(repo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Update a Learning Hub by ID
  async updateRepo(req, res) {
    try {
      const { repoId } = req.params;
      const updateData = req.body;
      const updatedRepo = await HubService.updateRepoById(repoId, updateData);
      if (!updatedRepo)
        return res.status(404).json({ message: "Repo not found." });
      res.status(200).json(updatedRepo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Delete a Learning Hub by ID
  async deleteRepo(req, res) {
    try {
      const { repoId } = req.params;
      const deletedRepo = await HubService.deleteRepoById(repoId);
      if (!deletedRepo)
        return res.status(404).json({ message: "Repo not found." });
      res.status(200).json({ message: "Repo deleted successfully." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Fork an existing Learning Hub
  async forkRepo(req, res) {
    try {
      const { userId, repoId } = req.body;
      const forkedRepo = await HubService.forkRepo(userId, repoId);
      res.status(201).json(forkedRepo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new HubController();
