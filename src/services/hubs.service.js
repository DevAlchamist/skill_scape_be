const { default: hubModal } = require("../models/hub.modal");
const AIService = require("./ai.service");
const BasicServices = require("./basic.service");
const slugify = require("slugify");

class HubService extends BasicServices {
  constructor() {
    super(hubModal); // Passing the Repo model to the base class
  }

  // Method to check if a repo with a similar prompt already exists
  async checkIfRepoExists(prompt) {
    try {
      const existingRepo = await this.modal.findOne({ prompt });
      return existingRepo; // If found, return the existing repo
    } catch (err) {
      throw new Error("Error checking if repo exists: " + err.message);
    }
  }

  async InsertHub(userId, prompt, aiResponse) {
    try {
      const existingRepo = await this.checkIfRepoExists(prompt);

      if (existingRepo) {
        // Prevent editing the base/original hub
        throw new Error(
          "A base hub with this prompt already exists and cannot be updated."
        );
      }

      // Create new base hub
      const newRepo = await this.create({
        title: aiResponse.title || prompt,
        prompt,
        description: aiResponse.description || "No description provided",
        aiContent: aiResponse, // Save full AI content
        createdBy: userId,
        contributors: [userId],
        visibility: aiResponse.visibility || "public",
        resources: aiResponse.resources || [],
      });

      return newRepo;
    } catch (err) {
      throw new Error(
        "Error creating base hub from AI response: " + err.message
      );
    }
  }

  // In HubService
  async createHub({ prompt, userId }) {
    try {
      // ✅ Generate AI content based on the prompt
      const aiService = new AIService(prompt);
      const aiContent = await aiService.generateLearningPath();

      // ✅ Generate a unique slug for the hub
      const generatedSlug = slugify(aiContent.title || prompt, {
        lower: true,
        strict: true,
      });

      // ✅ Check if a hub with the same slug already exists
      const existingHub = await this.findOne({ slug: generatedSlug });
      if (existingHub) {
        throw new Error(`Hub with slug "${generatedSlug}" already exists.`);
      }

      // ✅ Create the hub
      const hub = await this.create({
        title: aiContent.title || prompt,
        prompt,
        description: `Learning roadmap for ${aiContent.title}`,
        aiContent,
        slug: generatedSlug, // Include the generated unique slug
        contributors: userId ? [userId] : [],
        visibility: "public", // Default visibility
      });

      return hub;
    } catch (err) {
      // Enhanced error handling
      console.error("Error during hub creation:", err);
      throw new Error("Hub Creation Failed: " + err.message);
    }
  }

  // Method to fork an existing repo
  async forkRepo(userId, repoId) {
    try {
      const repoToFork = await this.findById(repoId);

      if (!repoToFork) {
        throw new Error("Repo not found");
      }

      // Create a fork of the repo
      const forkedRepo = await this.create({
        title: `${repoToFork.title} (Forked)`,
        prompt: repoToFork.prompt,
        description: repoToFork.description,
        createdBy: userId,
        isForked: true,
        forkedFrom: repoId,
        resources: repoToFork.resources,
        contributors: [...repoToFork.contributors, userId],
      });

      return forkedRepo;
    } catch (err) {
      throw new Error("Error forking repo: " + err.message);
    }
  }
  // Method to get all repos (pagination)
  async getAllRepos() {
    try {
      // If no filter/options, return the required fields
      const repo = await hubModal.find({}, "title slug _id prompt description");
      return repo;
    } catch (err) {
      throw new Error("Error fetching repos: " + err.message);
    }
  }

  // Method to get a single repo by ID
  async getRepoBySlug(slugId) {
    try {
      const repo = await this.find({ slug: slugId });
      if (!repo) throw new Error("Repo not found");
      return repo;
    } catch (err) {
      throw new Error("Error fetching repo: " + err.message);
    }
  }

  // Method to update a repo's details
  async updateRepoById(repoId, updates) {
    try {
      const updatedRepo = await this.findByIdAndUpdate(repoId, updates);
      if (!updatedRepo)
        throw new Error("Repo not found or couldn't be updated");
      return updatedRepo;
    } catch (err) {
      throw new Error("Error updating repo: " + err.message);
    }
  }

  // Method to delete a repo
  async deleteRepoById(repoId) {
    try {
      const deletedRepo = await this.findByIdAndDelete(repoId);
      if (!deletedRepo) throw new Error("Repo not found");
      return deletedRepo;
    } catch (err) {
      throw new Error("Error deleting repo: " + err.message);
    }
  }

  // Method to fork an existing repo
  async forkRepo(userId, repoId) {
    try {
      const repoToFork = await this.findById(repoId);

      if (!repoToFork) {
        throw new Error("Repo not found");
      }

      // Create a fork of the repo
      const forkedRepo = await this.create({
        title: `${repoToFork.title} (Forked)`,
        prompt: repoToFork.prompt,
        description: repoToFork.description,
        createdBy: userId,
        isForked: true,
        forkedFrom: repoId,
        resources: repoToFork.resources,
        contributors: [...repoToFork.contributors, userId],
      });

      return forkedRepo;
    } catch (err) {
      throw new Error("Error forking repo: " + err.message);
    }
  }

  // Method to add a new resource to a repo
  async addResourceToRepo(repoId, resource) {
    try {
      const repo = await this.findById(repoId);
      if (!repo) throw new Error("Repo not found");

      // Adding resource to repo
      repo.resources.push(resource);
      await repo.save();
      return repo;
    } catch (err) {
      throw new Error("Error adding resource: " + err.message);
    }
  }

  // Method to track user progress in a repo
  async trackProgress(userId, repoId, resourceId, progressContent) {
    try {
      const repo = await this.findById(repoId);
      if (!repo) throw new Error("Repo not found");

      // Check if user has already tracked progress for this repo
      const existingProgress = repo.progressTrackers.find(
        (progress) => progress.user.toString() === userId.toString()
      );

      if (!existingProgress) {
        // If no progress exists, create a new progress entry
        repo.progressTrackers.push({
          user: userId,
          completedResources: [resourceId],
          notes: [{ resourceId, content: progressContent }],
        });
      } else {
        // Update existing progress (add resource, update notes)
        existingProgress.completedResources.push(resourceId);
        existingProgress.notes.push({
          resourceId,
          content: progressContent,
        });
      }

      await repo.save();
      return repo;
    } catch (err) {
      throw new Error("Error tracking progress: " + err.message);
    }
  }
}

module.exports.HubService = new HubService();
