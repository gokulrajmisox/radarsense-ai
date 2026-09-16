import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" }); // As requested

    const prompt = `You are RadarSense AI, a security dashboard assistant. 
    Here is the recent radar data context: ${JSON.stringify(context)}. 
    Please answer the user's question concisely based on this data.
    
    User Question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
}
