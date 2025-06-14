import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export async function generateRefreshSuggestion(): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  #命令
  作業の合間にできる簡単なリフレッシュ方法を１つ提案してください

  #制約事項
  ー　１〜２分程度でできること
  ー　室内でできること
  ー　体を動かすこと
  ー　絵文字を１つ含めること
  ー　簡潔に1分の中に収めること
  ー　〜「しよう」のような提案の形で終わること

  #出力例
  ー　大きく背伸びしよう🙆
  ー　室内で少し歩こう🚶
  
  
  `;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text.trim();
  } catch (error) {
    console.error("Fail to generate suggestion:", error);
    return "ゆっくり深呼吸をしよう☀️";
  }
}
