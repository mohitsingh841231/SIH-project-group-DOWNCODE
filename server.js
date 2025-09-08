const http = require('http')
const fs = require('fs')
const filecontent = fs.readFileSync('index.html')
 const server = http.createServer((req,res) =>{
    res.writeHead(200,{'content-type':text/html});
    res.end(filecontent)
 })
 server.listen(80,'127.0.0.1',()=>{
    console.log('listen on port 80')
 })
 import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"; // put your key here

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
