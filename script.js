const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const preview = document.getElementById('resumePreview');
const downloadBtn = document.getElementById('downloadHtml');
const copyBtn = document.getElementById('copyHtml');

function getFormData(){
  return {
    fullname: document.getElementById('fullname').value || 'Your Name',
    title: document.getElementById('title').value || 'Job Title',
    location: document.getElementById('location').value || '',
    contact: document.getElementById('contact').value || '',
    work: document.getElementById('work').value || '',
    education: document.getElementById('education').value || '',
    skills: document.getElementById('skills').value || ''
  };
}

async function generateResume(){
  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';
  preview.innerHTML = 'Generating — please wait...';

  const data = getFormData();
  try{
    // CHANGE this endpoint to your deployed backend URL if not using serverless in same host
    const res = await fetch('/api/generate-resume', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });

    if(!res.ok){
      const errText = await res.text();
      throw new Error(errText || res.statusText);
    }

    const json = await res.json();
    // server returns HTML string in json.resume
    preview.innerHTML = json.resume;
  }catch(err){
    console.error(err);
    preview.innerHTML = <div style="color:#b91c1c">Error generating resume: ${err.message}</div>;
  }finally{
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Resume with AI';
  }
}

clearBtn.addEventListener('click',()=>{
  document.getElementById('fullname').value='';
  document.getElementById('title').value='';
  document.getElementById('location').value='';
  document.getElementById('contact').value='';
  document.getElementById('work').value='';
  document.getElementById('education').value='';
  document.getElementById('skills').value='';
  preview.innerHTML='Your AI-generated resume will appear here.';
});

downloadBtn.addEventListener('click',()=>{
  const blob = new Blob([preview.innerHTML], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download='resume.html';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

copyBtn.addEventListener('click',async()=>{
  try{
    await navigator.clipboard.writeText(preview.innerHTML);
    alert('Resume HTML copied to clipboard');
  }catch(e){
    alert('Clipboard not available');
  }
});

generateBtn.addEventListener('click',generateResume);
