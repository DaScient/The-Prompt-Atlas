import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Initialize Gemini Client with standard telemetry User-Agent
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API 1: Research Topic & Prompt Analysis
  app.post("/api/research", async (req, res) => {
    try {
      const { topic, level, style, language } = req.body;

      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      if (!apiKey) {
        return res.status(500).json({
          error: "API Key is missing. Please configure GEMINI_API_KEY in Settings > Secrets.",
        });
      }

      const levelInstruction = (() => {
        switch (level) {
          case "Elementary":
            return "Ages 6-10, styled extremely simply, bright, basic visual labels, clear graphics, friendly.";
          case "High School":
            return "Standard secondary school coverage, clear structured labels, educational text, clean textbook style.";
          case "College":
            return "Academic presentation, rich research data, accurate structures, detailed diagrams.";
          case "Expert":
            return "Industry expert level, deep schematic or highly technical blueprint style, precise metrics and notes.";
          default:
            return "Accessible, highly engaging general explanation.";
        }
      })();

      const styleInstruction = (() => {
        switch (style) {
          case "Minimalist":
            return "Bauhaus Minimalist. Flat vector elements, limited color scheme (2-3 matching colors), relying on strong typography and clean negative space layout.";
          case "Realistic":
            return "Stunning photorealistic, cinematic volumetric lighting, extremely high detail textures, looks like an 8k photo model.";
          case "Cartoon":
            return "Vibrant educational comic graphic, crisp contour outlines, beautiful cel-shaded visual design.";
          case "Vintage":
            return "19th century classic scientific lithograph style, exquisite outline hatches, subtle sepia or antique parchment background paper.";
          case "Futuristic":
            return "Sleek holographic cybernetic HUD. Radiant neon cyan/amber vectors over an ambient dark technical framework.";
          case "3D Render":
            return "Premium 3D isometric model. Soft physical claymorphism, detailed gloss highlights, elegant soft drop shadows.";
          case "Sketch":
            return "Leonardo da Vinci classic notebook style, elegant ink sketches, rough handdrawn measurements on weathered paper.";
          default:
            return "Professional visual design element, clean infographics style, elegant visual composition.";
        }
      })();

      const systemPrompt = `
        You are "The Prompt Atlas Navigational Exploration Agent".
        Your goal is to thoroughly research the educational topic: "${topic}" and detail a beautiful navigational infographic draft.
        
        Use Google Search grounding as needed to find highly accurate facts.
        
        Requirements:
        - Target Complexity: ${level} (${levelInstruction})
        - Desired Visual Feel: ${style} (${styleInstruction})
        - Content Language: ${language}
        
        Then, construct:
        1. A set of 3-5 key scientific or logical facts about "${topic}".
        2. A premium stable image prompt representing the infographic.
        3. A thorough Prompt Engineering Teardown. Explain how the image prompt was engineered using a recognized prompting technique (such as RTPE, CARE, or Socratic) so that learners can understand prompt syntax. Provide an optimized prompt copy. Use ${language} for explanations where appropriate.
      `;

      // Call Gemini 3.5 Flash for text & search grounding tasks
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              facts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of 3 to 5 highly engaging verified facts about the topic.",
              },
              imagePrompt: {
                type: Type.STRING,
                description: "The full visual description for generating the infographic graphic.",
              },
              promptAnalysis: {
                type: Type.OBJECT,
                properties: {
                  framework: {
                    type: Type.STRING,
                    description: "The prompting framework demonstrated (e.g. 'RTPE (Role, Task, Parameters, Example)', 'CARE', 'Persona-Based').",
                  },
                  role: {
                    type: Type.STRING,
                    description: "The role and context assigned to the generator.",
                  },
                  constraints: {
                    type: Type.STRING,
                    description: "The stylistic constraints and negative boundaries applied.",
                  },
                  tips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2-3 tips explaining how to formulate or refine this prompt category.",
                  },
                  optimizedPrompt: {
                    type: Type.STRING,
                    description: "A clean, copyable optimized version of this exact prompt.",
                  },
                },
                required: ["framework", "role", "constraints", "tips", "optimizedPrompt"],
              },
            },
            required: ["facts", "imagePrompt", "promptAnalysis"],
          },
        },
      });

      const parsedData = JSON.parse(response.text || "{}");

      // Extract Grounding (Search Results)
      const searchResults: Array<{ title: string; url: string }> = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk) => {
          if (chunk.web?.uri && chunk.web?.title) {
            searchResults.push({
              title: chunk.web.title,
              url: chunk.web.uri,
            });
          }
        });
      }

      // Remove duplicate URLs
      const uniqueResults = Array.from(
        new Map(searchResults.map((item) => [item.url, item])).values()
      );

      res.json({
        facts: parsedData.facts || [],
        imagePrompt: parsedData.imagePrompt || topic,
        promptAnalysis: parsedData.promptAnalysis || {
          framework: "General Instruction",
          role: "Infographic Generator",
          constraints: "Clear visual structure",
          tips: ["Be descriptions-heavy", "Specify colors and layouts"],
          optimizedPrompt: topic,
        },
        searchResults: uniqueResults,
      });
    } catch (error: any) {
      console.error("Error in /api/research:", error);
      const errMsg = error.message || "";
      const isQuota = errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("limit");
      res.status(500).json({ 
        error: errMsg || "Failed to perform research operations.",
        isQuotaLimit: isQuota
      });
    }
  });

  // API 2: Image Generation
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (!apiKey) {
        return res.status(500).json({
          error: "API Key is missing. Please configure GEMINI_API_KEY in Settings > Secrets.",
        });
      }

      // Generate visual using general image model gemini-2.5-flash-image
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
          responseModalities: [Modality.IMAGE],
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      if (part && part.inlineData && part.inlineData.data) {
        return res.json({ imageData: `data:image/png;base64,${part.inlineData.data}` });
      }

      throw new Error("Missing inline image data in model output");
    } catch (error: any) {
      console.error("Error in /api/generate:", error);
      const errMsg = error.message || "";
      const isQuota = errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("limit");
      res.status(500).json({ 
        error: errMsg || "Failed to generate visual chart.",
        isQuotaLimit: isQuota
      });
    }
  });

  // API 3: Modify / Edit Image
  app.post("/api/edit", async (req, res) => {
    try {
      const { currentImageBase64, editInstruction } = req.body;
      if (!currentImageBase64 || !editInstruction) {
        return res.status(400).json({ error: "Missing image data or modification instructions" });
      }

      if (!apiKey) {
        return res.status(500).json({
          error: "API Key is missing. Please configure GEMINI_API_KEY in Settings > Secrets.",
        });
      }

      const cleanBase64 = currentImageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

      const compositeInstructions = `
        Modify this image.
        Required adjustment details: ${editInstruction}
        Keep the layout extremely clean, readable, and cohesive.
      `;

      // Edit visual using gemini-2.5-flash-image with the previous canvas
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
            { text: compositeInstructions },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      if (part && part.inlineData && part.inlineData.data) {
        return res.json({ imageData: `data:image/png;base64,${part.inlineData.data}` });
      }

      throw new Error("Missing modified inline image data in model output");
    } catch (error: any) {
      console.error("Error in /api/edit:", error);
      const errMsg = error.message || "";
      const isQuota = errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("limit");
      res.status(500).json({ 
        error: errMsg || "Modification operation failed.",
        isQuotaLimit: isQuota
      });
    }
  });

  // Development / Production Asset Routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files server configured.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}`);
  });
}

startServer();
