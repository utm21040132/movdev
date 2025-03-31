import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av"; // Importamos la librería para manejar audio
import axios, { AxiosError } from "axios";
import styles from "./styles"; // Importamos los estilos separados

const Index: React.FC = () => {
  const [inputText, setInputText] = useState(""); // Estado para el prompt
  const [generatedText, setGeneratedText] = useState(""); // Estado para la historia generada
  const [loading, setLoading] = useState(false); // Indicador de carga
  const [charCount, setCharCount] = useState(0); // Contador de caracteres
  const [audioUrl, setAudioUrl] = useState(""); // URL del archivo de audio generado
  const [selectedTab, setSelectedTab] = useState("Texto"); // Controla la pestaña activa

  // Estados específicos para manejo de audio
  const [sound, setSound] = useState<Audio.Sound | null>(null); // Objeto de sonido
  const [playing, setPlaying] = useState(false); // Controla si se está reproduciendo

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
      console.error("Error al generar la historia:", (error as AxiosError).message);
      alert(
        "Hubo un problema al conectar con el servidor. Verifica que el backend esté ejecutándose."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (tab: string) => {
    setSelectedTab(tab);
  };

  const playAudio = async () => {
    if (!audioUrl) {
      alert("No hay un audio disponible para reproducir.");
      return;
    }

    try {
      // Si ya hay un audio reproduciéndose, primero lo detenemos
      if (sound) {
        await sound.unloadAsync(); // Descargamos el audio anterior
        setSound(null);
        setPlaying(false);
      }

      // Cargamos y reproducimos el nuevo audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true } // Comienza a reproducir automáticamente
      );
      setSound(newSound);
      setPlaying(true);

      // Detectamos cuando el audio termina
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlaying(false);
        }
      });
    } catch (error) {
      console.error("Error al reproducir audio:", error);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      try {
        await sound.stopAsync(); // Detenemos el audio
        await sound.unloadAsync(); // Descargamos el audio
        setSound(null);
        setPlaying(false);
      } catch (error) {
        console.error("Error al detener el audio:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Pestañas de navegación */}
      <View style={styles.tabs}>
        {["Texto", "Audio"].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, selectedTab === tab && styles.selectedTab]}
            onPress={() => handleTabPress(tab)}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido principal para "Texto" */}
      {selectedTab === "Texto" && (
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
            <ActivityIndicator
              size="large"
              color="#007BFF"
              style={styles.loader}
            />
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
        </View>
      )}

      {/* Contenido principal para "Audio" */}
      {selectedTab === "Audio" && (
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Reproductor de Audio</Text>
          {audioUrl ? (
            <Text style={styles.audioText}>
              Nombre del archivo generado: {audioUrl}
            </Text>
          ) : null}
          {audioUrl ? (
            <Pressable
              style={styles.button}
              onPress={playing ? stopAudio : playAudio}
            >
              <Text style={styles.buttonText}>
                {playing ? "Detener" : "Reproducir"}
              </Text>
            </Pressable>
          ) : (
            <Text style={styles.audioText}>
              No hay un audio generado para reproducir.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default Index;