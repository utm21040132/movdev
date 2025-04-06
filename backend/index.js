const express = require("express");
const axios = require("axios");
require("dotenv").config(); // Usamos dotenv para variables de entorno
const fs = require("fs");
const util = require("util");
const textToSpeech = require("@google-cloud/text-to-speech"); // Cliente de Google Text-to-Speech
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000; // Usamos el puerto definido en el archivo .env o el 4000 por defecto

app.use(cors());
app.use(express.json());

// Servimos los archivos de audio generados en la carpeta "audio"
app.use("/audio", express.static(path.join(__dirname, "audio")));

// Configuración de la API de generar historias
const openrouter = {
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, // Obtenemos la API Key desde el archivo .env
};

// Configuración del cliente de Google Text-to-Speech
const client = new textToSpeech.TextToSpeechClient({
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

// Ruta principal de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor Express funcionando!");
});

// Ruta POST para la generación de historias y conversión a audio
app.post("/historias", async (req, res) => {
  const prompt = req.body.prompt; // Obtenemos el prompt del cuerpo de la petición

  try {
    // Generación de la historia usando OpenRouter
    const response = await axios.post(
      `${openrouter.baseURL}/chat/completions`,
      {
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content:
              "Your role is to create a story based on the user's prompt. Do not analyze or explain the prompt. Do not act as an assistant. Generate an extensive and coherent story in spanish based on the user's prompt. The story should be maximum 5000 bytes long for conversion to audio. Maintain an engaging and immersive narrative tone.",
          },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${openrouter.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const story = response.data.choices[0].message.content;

    // Configuración de la solicitud de Google Text-to-Speech
    const cleanStory = story.replace(/\*/g, ""); // Remueve los asteriscos del texto
    const request = {
      input: { text: cleanStory },
      voice: { languageCode: "es-ES", ssmlGender: "FEMALE", name: "es-US-News-F" },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 1.0, // Ajusta la velocidad (default es 1.0)
        pitch: 0.0, // Ajusta el tono (default es 0.0)
      },
    };

    // Realizar la conversión de texto a voz
    const [responseTTS] = await client.synthesizeSpeech(request);

    // Guardar el archivo de audio en la carpeta "audio"
    const audioPath = path.join(__dirname, "audio", "output.mp3");
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(audioPath, responseTTS.audioContent, "binary");

    // Devolver la historia y la URL del audio generado
    res.json({ story: story, audio: `https://51b9xs26-4000.usw3.devtunnels.ms/audio/output.mp3` });
  } catch (error) {
    console.error("Error details:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.message });
  }
});

// Inicializar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});