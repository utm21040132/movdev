import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable, // Para personalizar los botones
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import styles from "./styles"; // Importamos los estilos separados

const Index: React.FC = () => {
  const [inputText, setInputText] = useState(""); // Estado para el prompt
  const [generatedText, setGeneratedText] = useState(""); // Estado para la historia generada
  const [loading, setLoading] = useState(false); // Indicador de carga
  const [charCount, setCharCount] = useState(0); // Contador de caracteres
  const [audioUrl, setAudioUrl] = useState(""); // URL del archivo de audio

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Solicitud POST al backend
      const response = await axios.post("http://localhost:4000/historias", {
        prompt: inputText, // Enviamos el texto ingresado
      });

      // Actualizamos el estado con los datos recibidos
      setGeneratedText(response.data.story);
      setAudioUrl(response.data.audio);
    } catch (error) {
      console.error("Error al generar la historia:", error);
      alert(
        "Hubo un problema al conectar con el servidor. Verifica que el backend esté ejecutándose."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Pestañas de navegación */}
      <View style={styles.tabs}>
        {["Texto", "Audio"].map((tab, index) => (
          <TouchableOpacity key={index} style={styles.tab}>
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>¡Bienvenido!</Text>
        <Text style={styles.questionText}>¿Qué historia tendremos hoy?</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe aquí tu historia..."
          placeholderTextColor="#aaa"
          value={inputText}
          onChangeText={(text) => {
            setInputText(text); // Actualiza el texto ingresado
            setCharCount(text.length); // Actualiza el contador de caracteres
          }}
          maxLength={120}
        />
        <Text style={styles.charCount}>{charCount}/120</Text>

        {/* Botón "Generar" */}
        <Pressable
          style={styles.button}
          onPress={handleGenerate}
          disabled={loading || charCount === 0}
        >
          <Text style={styles.buttonText}>
            {loading ? "Generando..." : "Generar"}
          </Text>
        </Pressable>

        {/* Indicador de carga */}
        {loading && (
          <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
        )}

        <ScrollView style={styles.resultContainer}>
          <Text style={styles.generatedText}>
            {generatedText || "Tu historia aparecerá aquí..."}
          </Text>
        </ScrollView>

        {audioUrl ? (
          <Text style={styles.audioText}>
            Archivo de audio generado: {audioUrl}
          </Text>
        ) : null}

        <Text style={styles.questionText}>¿Te parece bien?</Text>

        {/* Botón "Pasar a audio" */}
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Pasar a audio</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Index;
