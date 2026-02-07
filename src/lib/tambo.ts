/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import {
  BlessingCard,
  blessingCardSchema,
} from "@/components/tambo/blessing-card";
import { 
  InteractiveBlessingCard 
} from "@/components/tambo/interactive-blessing-card";
import { MemeCard, memeCardSchema } from "@/components/tambo/meme-card";
import { 
  InteractiveMemeCard 
} from "@/components/tambo/interactive-meme-card";
import {
  GeneratedMemeImage,
  generatedMemeImageSchema,
} from "@/components/tambo/generated-meme-image";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import { generateMemeImage } from "@/services/image-generation";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "generateMemeImage",
    description:
      "Generate an actual Spring Festival meme image using AI. Use this tool ONLY when the user explicitly requests to generate a real image (not just ideas). This will create a downloadable image file.",
    tool: generateMemeImage,
    inputSchema: z.object({
      description: z
        .string()
        .describe("Detailed description of the meme image to generate"),
      style: z
        .enum(["festive", "funny", "cute", "creative"])
        .describe("Visual style of the meme"),
      caption: z.string().describe("Text caption to include in the meme image"),
    }),
    outputSchema: z.object({
      url: z.string().describe("URL of the generated image"),
      revisedPrompt: z
        .string()
        .optional()
        .describe("AI-optimized prompt used for generation"),
    }),
  },
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  // Add more tools here
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "GeneratedMemeImage",
    description:
      "A component that displays a generated Spring Festival meme image with download and share functionality. Use this AFTER successfully generating an image with the generateMemeImage tool. Shows the image, caption, style, and provides download/copy URL buttons.",
    component: GeneratedMemeImage,
    propsSchema: generatedMemeImageSchema,
  },
  {
    name: "BlessingCard",
    description:
      "Interactive Spring Festival blessing card component. Users can rate blessings (like/dislike), request more similar blessings, or ask for different styles. User interactions are sent back to the AI to help personalize future responses. Each blessing includes title, content, style, and target audience.",
    component: InteractiveBlessingCard,
    propsSchema: blessingCardSchema,
  },
  {
    name: "MemeCard",
    description:
      "Interactive Spring Festival meme idea card component. Users can give 5-star ratings, select ideas to generate images, and request quick optimizations (more humorous, simpler, more detailed, different scenario). User feedback helps AI understand preferences and generate better content. Use this for meme IDEAS with interaction support.",
    component: InteractiveMemeCard,
    propsSchema: memeCardSchema,
  },
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  // Add more components here
];
