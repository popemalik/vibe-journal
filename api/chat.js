export const config = {
  runtime: 'edge', // 指定使用邊緣運算，速度最快
};

// ...前面的 config 保持不變

export default async function handler(req) {
  const { message } = await req.json();

  // 更新 System Prompt，要求回傳 JSON
  const systemPrompt = `
    你是一位感性的深夜電台主持人，同時也是一位色彩療癒師。
    請根據使用者的心情，回傳一個 JSON 物件，包含：
    1. "reply": 一句 20 字以內溫暖的鼓勵。
    2. "color": 一個符合該情緒的 CSS 漸層色 (例如: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)")。
    請只回傳 JSON，不要有其他文字。
  `;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\n使用者說：${message}` }] }],
      generationConfig: { responseMimeType: "application/json" } // 強制 Gemini 輸出 JSON
    }),
  });


  const data = await response.json();
  const result = JSON.parse(data.candidates[0].content.parts[0].text);

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
}