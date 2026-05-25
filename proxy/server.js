require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const nelsonInfo = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'nelson-info.json'), 'utf-8')
);

function buildSystemPrompt() {
  return `You are an AI assistant embedded in Nelson Filipe Fardilha Karlsson's developer portfolio. You only answer questions about Nelson. Use the following data to answer accurately:

${JSON.stringify(nelsonInfo, null, 2)}

Additional guidelines:
- If asked about projects and the array is empty, say his projects are coming soon and to check the portfolio again soon.
- If the projects array has entries, describe them naturally.
- If asked anything unrelated to Nelson, reply exactly: 'I only know about Nelson — ask me anything about him.'
- Keep answers concise, direct, and honest.
- Never invent or assume information not present in the JSON above.
- Always respond in the same language the user writes in. If the user writes in Spanish, respond in Spanish. If the user writes in English, respond in English. Never mix languages in the same response.`;
}

const systemPrompt = buildSystemPrompt();

const app = express();

app.use(cors());
app.use(express.json({ limit: '4kb' }));

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { reply: '// rate limit reached — try again later' }
});

app.use('/api/', limiter);

app.post('/api/chat', async (req, res) => {
  const userMessage = (req.body.message || '').trim();
  if (!userMessage) {
    return res.json({ reply: '// ask me anything about Nelson' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not set');
    return res.status(500).json({ reply: '// connection error — try again' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userMessage }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400,
            topP: 0.9
          }
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error('Unexpected Gemini response:', JSON.stringify(data).slice(0, 300));
      return res.json({ reply: '// connection error — try again' });
    }

    res.json({ reply: reply.trim() });
  } catch (err) {
    console.error('Gemini API error:', err.message);
    res.json({ reply: '// connection error — try again' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Portfolio AI proxy running on port ${PORT}`);
});
