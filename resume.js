// For Vercel: place this file at /api/generate-resume.js
import fetch from 'node-fetch';

export default async function handler(req, res){
  try{
    if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
    const { fullname, title, location, contact, work, education, skills } = req.body;

    // Build prompt for OpenAI (concise & safe)
    const prompt = Write a professional resume in clean HTML format (use semantic tags).\nName: ${fullname}\nTitle: ${title}\nLocation: ${location}\nContact: ${contact}\nWork: ${work}\nEducation: ${education}\nSkills: ${skills}\nInclude sections: Summary, Experience (with bullets), Education, Skills.;

    const openaiKey = process.env.OPENAI_API_KEY;
    if(!openaiKey) return res.status(500).json({error:'API key not configured'});

    const apiRes = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization': Bearer ${openaiKey}
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages:[{role:'user',content:prompt}],
        max_tokens:1000,
        temperature:0.6
      })
    });

    if(!apiRes.ok){
      const txt = await apiRes.text();
      return res.status(apiRes.status).send(txt);
    }

    const data = await apiRes.json();
    const output = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || 'No output';

    // Return as HTML string
    res.json({ resume: output });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
