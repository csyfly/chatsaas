import prisma from "@/lib/prisma";
import { createAzure } from "@ai-sdk/azure";
import { createOpenAI } from "@ai-sdk/openai";
import { defaultCache } from "@/lib/cache";

export async function getAIModelConfig(name: string) {
  const cacheKey = `modelConfig:${name}`;
  const cachedConfig = defaultCache.get<any>(cacheKey);
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const modelConfig = await prisma.aIModelConfig.findUnique({
      where: {
        name,
      },
    });
    
    defaultCache.set(cacheKey, modelConfig);
    return modelConfig;
  } catch (error) {
    console.error("Error fetching AIModelConfig:", error);
    return null;
  }
}

export async function getAIModel(name: string) {
  const modelConfig = await getAIModelConfig(name);
  if (!modelConfig) {
    return null;
  }

  let model;
  if (modelConfig.type === 'azure') {
    const azure = createAzure({
      apiKey: modelConfig.apiKey || '',
      resourceName: modelConfig.resourceName || '',
    });
    model = azure(modelConfig.deploymentId || '');
  } else if (modelConfig.type === 'openai') {
    const openai = createOpenAI({
      apiKey: modelConfig.apiKey || '',
    });
    model = openai(modelConfig.model || '');
  } else {
    model = null;
  }

  return model;
}

// 如果需要清除缓存，可以使用这个函数
export function clearModelCache() {
  defaultCache.clear();
}
