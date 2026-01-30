export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const { message } = await req.json();

    const systemPrompt = `
你是一位感性的深夜電台主持人。
你「只能」回傳純 JSON，不得加任何說明、不得加 markdown、不得加 \`\`\`。
格式必須是：

{
  "reply": "20 字內溫暖句子",
  "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
}
`;


    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: `${systemPrompt}\n\n使用者說：${message}` }] }
          ],
        }),
      }
    );

    const data = await response.json();

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error('No AI response');

    return new Response(rawText, {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({
        reply: "電台有點雜訊，但我還在。",
        color: "linear-gradient(135deg, #2c3e50 0%, #000000 100%)"
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
