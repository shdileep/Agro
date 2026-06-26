
import { GoogleGenAI, Modality } from "@google/genai";


let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    const key = process.env.API_KEY || 'PLACEHOLDER_KEY';
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
};

export const getAgroAIResponse = async (prompt: string, language: string = 'en') => {
  const systemInstruction = `
    You are AGRO AI, a specialized agricultural assistant for farmers in Tamil Nadu, India.
    You help with sugarcane farming, irrigation scheduling, and explaining sensor data (moisture, temperature, humidity).
    Language: Please respond primarily in ${language === 'ta' ? 'Tamil' : language === 'te' ? 'Telugu' : 'English'}.
    Keep answers concise, helpful, and professional.
  `;

  try {
    const googleAI = getAI();
    const response = await googleAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the field sensors right now. Please try again.";
  }
};

export const generateAgroSpeech = async (text: string, language: string = 'en') => {
  try {
    const voiceName = language === 'ta' || language === 'te' ? 'Kore' : 'Zephyr';

    const googleAI = getAI();
    const response = await googleAI.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

// Audio Decoding Helper
export async function playPCM(base64: string) {
  const decode = (b64: string) => {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioData = decode(base64);
  const buffer = await decodeAudioData(audioData, ctx);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start();
}
