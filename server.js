// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/generate-resume', async (req,res)=>{
  try{
    const { fullname, title, location, contact, work, education, skills } = req.body;
    const prompt = Write a professional resume in clean HTML format. Name: ${fullname} ...;
    const apiRes = await fetch('https://api.openai.com/v1/chat/completions',{ method:'POST', headers: { 'Content-Type':'application/json', 'Authorization': Bearer ${process.env.OPENAI_API_KEY} }, body: JSON.stringify({ model:'gpt-4o-mini', messages:[{role:'user',content:prompt}], max_tokens:1000 }) });
    const data = await apiRes.json();
    const output = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || 'No output';
    res.json({ resume: output });
  }catch(err){
    console.error(err); res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('Server running on',PORT));
