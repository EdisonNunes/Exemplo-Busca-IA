import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

export async function generateManual(equipment: string, manufacturer: string) {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gere informações técnicas detalhadas para o seguinte equipamento:
    Equipamento: ${equipment}
    Fabricante: ${manufacturer}

    Retorne APENAS as seguintes seções:
    1. Especificações Técnicas (organizadas em uma TABELA Markdown com colunas "Parâmetro" e "Valor")
    2. Instruções de Operação (passo a passo em lista numerada)

    Responda em Markdown formatado de forma clara e profissional.`,
    config: {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
    }
  });

  const response = await model;
  return response.text;
}
