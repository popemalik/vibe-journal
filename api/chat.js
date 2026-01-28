export const config = {
  runtime: 'edge', // 指定使用邊緣運算，速度最快
};

export default async function handler(req) {
  const { message } = await req.json(); // 接收前端傳來的心情文字

  // 這裡就是我們定義的「深夜電台主持人」設定
  const systemPrompt = "你是一位溫柔、有同理心的深夜電台主持人。請根據使用者的心情，給出一句 20 字以內、溫暖且獨一無二的鼓勵。";

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\n使用者說：${message}` }] }]
    }),
  });
  
async function getAIResponse(userText) {
  // 1. 使用 fetch 發送請求到我們的 API 路由
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: userText })
  });

  // 2. 解析 AI 回傳的 JSON 資料
  const data = await response.json();

  // 3. 把 AI 的鼓勵話語顯示在畫面上
  document.getElementById('ai-corner').innerText = data.reply;
}

const textarea = document.querySelector('textarea');

textarea.addEventListener('keydown', (event) => {
  // 檢查是否按下 Enter，且沒有按住 Shift (Shift+Enter 通常用於換行)
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // 防止游標換行
    const content = textarea.value.trim();
    
    if (content) {
      // 呼叫我們之前討論的 fetch 函數
      getAIResponse(content);
    }
  }
});

  const data = await response.json();
  const reply = data.candidates[0].content.parts[0].text;

  return new Response(JSON.stringify({ reply }), {
    headers: { 'Content-Type': 'application/json' },
  });
}