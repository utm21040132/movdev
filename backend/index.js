const express = require("express");
const axios = require("axios"); //Dejamos de usar OpenAI directamente
require("dotenv").config(); //Por fin usamos dotenv
const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech'); //Importamos el cliente de Google Text-to-Speech
const app = express();
const port = process.env.PORT || 4000; //Usamos el puerto definido en el archivo .env o el 4000 por defecto
const cors = require('cors');
app.use(cors());


app.use(express.json());

// Configuración de la API de generar historias
const openrouter = {
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY, //Obtenemos la API Key desde el archivo .env
};

// Configuración del cliente de Google Text-to-Speech
const client = new textToSpeech.TextToSpeechClient({
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

app.get("/", (req, res) => {
  res.send("¡Servidor Express funcionando!"); // Cambia este mensaje, solo es de prueba
});

// Ruta POST para la generación de historias y conversión a audio
app.post("/historias", async (req, res) => {
    const prompt = req.body.prompt; // Obtenemos el prompt del cuerpo de la petición
  
    try {
      const response = await axios.post(
        `${openrouter.baseURL}/chat/completions`,
        {
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "system",
              content: "Your role is to create a story based on the user's prompt. Do not analyze or explain the prompt. Do not act as an assistant. Generate an extensive and coherent story in spanish based on the user's prompt. The story should be maximum 5000 bytes long for conversion to audio. Maintain an engaging and immersive narrative tone."
              },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            "Authorization": `Bearer ${openrouter.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const story = response.data.choices[0].message.content;

      // Configuración de la solicitud de Google Text-to-Speech
      const cleanStory = story.replace(/\*/g, ''); // Remueve los asteriscos del texto
      const request = {
        input: { text: cleanStory },
        voice: { languageCode: 'es-ES', ssmlGender: 'FEMALE', name: 'es-US-News-F' },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0, // Ajusta la velocidad (default es 1.0)
          pitch: 0.0, // Ajusta el tono (default es 0.0)
        },
      };
   
      // Realizar la conversión de texto a voz
      const [responseTTS] = await client.synthesizeSpeech(request);
      const writeFile = util.promisify(fs.writeFile);
      await writeFile('output.mp3', responseTTS.audioContent, 'binary');

      res.json({ story: story, audio: 'output.mp3' });
    } catch (error) {
      console.error("Error details:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: error.message });
    }
  });

app.listen(port, () => {
  console.log(`Servidor escuchando`); //Log de que el servidor está corriendo
});
