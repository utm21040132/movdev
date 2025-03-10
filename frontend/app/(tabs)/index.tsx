import React from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable, // Para personalizar los botones
} from "react-native";
import styles from "./styles"; // Importamos los estilos separados

const Index: React.FC = () => {
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
          editable={false} // Campo deshabilitado solo para diseño estático
        />
        <Text style={styles.charCount}>0/120</Text>

        {/* Botón "Generar" */}
        <Pressable style={styles.button} >
          <Text style={styles.buttonText}>Generar</Text>
        </Pressable>

        <ScrollView style={styles.resultContainer}>
          <Text style={styles.generatedText}>
            No, aun no funciona
          </Text>
        </ScrollView>

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
