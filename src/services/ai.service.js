require("dotenv").config();
const { Mistral } = require('@mistralai/mistralai');

class AIService {
  constructor(prompt) {
    this.prompt = prompt;
    this.client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
    this.model = 'mistral-large-latest';
  }

  async generateLearningPath() {
    const structure = await this.getHighLevelStructure();

    for (const module of structure.modules) {
      module.description = await this.getModuleDescription(module.name);

      for (let i = 0; i < module.topics.length; i++) {
        const topicDetails = await this.getTopicDetails(module.topics[i]);
        module.topics[i] = { ...topicDetails };
      }

      module.resources = await this.getYoutubeResources(module.name);
    }

    return structure;
  }

  async getHighLevelStructure() {
    const prompt = `
      Return ONLY a valid JSON object with this structure:
      {
        "modules": [
          {
            "name": "Module Name",
            "topics": ["Topic 1", "Topic 2"]
          }
        ]
      }
      Create this for: ${this.prompt}
    `;

    const raw = await this.chat(prompt);
    return this.parseJsonResponse(raw);
  }

  async getModuleDescription(moduleName) {
    const prompt = `Write a detailed 500 words description for the module: ${moduleName}`;
    const raw = await this.chat(prompt);
    return raw.trim();
  }

  async getTopicDetails(topicName) {
    const prompt = `Explain "${topicName}" in a clear and detailed paragraph of 300 words.`;
    const raw = await this.chat(prompt);
    return {
      name: topicName,
      content: raw.trim(),
    };
  }

  async getYoutubeResources(topic) {
    const prompt = `
      List top 3 YouTube videos for learning "${topic}" in JSON format like:
      [
        { "type": "video", "title": "Video Title", "url": "https://..." },
        ...
      ]
    `;

    const raw = await this.chat(prompt);
    return this.parseJsonResponse(raw);
  }

  async chat(prompt) {
    try {
      const chatResponse = await this.client.chat.complete({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return chatResponse.choices[0].message.content;
    } catch (error) {
      console.error("Mistral Chat Error:", error);
      throw new Error("Failed to get response from Mistral");
    }
  }

  extractJson(text) {
    const codeBlock = text.match(/```json([\s\S]*?)```/);
    if (codeBlock) return codeBlock[1].trim();

    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    return text.slice(first, last + 1);
  }

  parseJsonResponse(text) {
    try {
      return JSON.parse(this.extractJson(text));
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      console.log("Text was:", text);
      throw new Error("Invalid JSON from model");
    }
  }
}

module.exports = AIService;
