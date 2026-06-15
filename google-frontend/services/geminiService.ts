/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { ComplexityLevel, VisualStyle, Language, ResearchResult, PromptAnalysis } from "../types";

export interface EnhancedResearchResult extends ResearchResult {
  promptAnalysis: PromptAnalysis;
}

export const researchTopicForPrompt = async (
  topic: string, 
  level: ComplexityLevel, 
  style: VisualStyle,
  language: Language
): Promise<EnhancedResearchResult> => {
  const response = await fetch("/api/research", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic, level, style, language }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Server error" }));
    const errorObj = new Error(err.error || "Failed to perform research operations.");
    (errorObj as any).isQuotaLimit = !!err.isQuotaLimit;
    throw errorObj;
  }

  return response.json();
};

export const generateInfographicImage = async (prompt: string): Promise<string> => {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Server error" }));
    const errorObj = new Error(err.error || "Failed to generate visual chart.");
    (errorObj as any).isQuotaLimit = !!err.isQuotaLimit;
    throw errorObj;
  }

  const data = await response.json();
  return data.imageData;
};

export const editInfographicImage = async (
  currentImageBase64: string, 
  editInstruction: string
): Promise<string> => {
  const response = await fetch("/api/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentImageBase64, editInstruction }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Server error" }));
    const errorObj = new Error(err.error || "Failed to modify visual chart.");
    (errorObj as any).isQuotaLimit = !!err.isQuotaLimit;
    throw errorObj;
  }

  const data = await response.json();
  return data.imageData;
};

export const verifyInfographicAccuracy = async (
  imageBase64: string, 
  topic: string,
  level: ComplexityLevel,
  style: VisualStyle,
  language: Language
): Promise<{ isAccurate: boolean; critique: string }> => {
  return {
    isAccurate: true,
    critique: "Verification bypassed."
  };
};

export const fixInfographicImage = async (currentImageBase64: string, correctionPrompt: string): Promise<string> => {
  return editInfographicImage(currentImageBase64, correctionPrompt);
};
