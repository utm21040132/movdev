import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7", // Fondo gris claro
    padding: 20,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#b0b0b0", // Línea gris
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555", // Texto gris
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333", // Gris oscuro
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666", // Gris medio
  },
  input: {
    height: 40,
    borderColor: "#ccc", // Borde gris claro
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#eaeaea", // Fondo gris claro
  },
  charCount: {
    textAlign: "right",
    marginBottom: 10,
    color: "#999", // Gris suave
  },
  resultContainer: {
    flex: 1,
    borderColor: "#ddd", // Borde gris claro
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#f2f2f2", // Fondo gris muy claro
  },
  generatedText: {
    fontSize: 14,
    color: "#444", // Gris intermedio
  },
  button: {
    backgroundColor: "#d4d4d4", // Fondo gris suave para los botones
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#333", // Texto gris oscuro
    fontWeight: "bold",
  },
  audio: {
    marginTop: 10,
    fontSize: 16,
    color: "#777", // Texto gris oscuro
    textDecorationLine: "underline",
  },
  loader: {
    marginTop: 20,
  },
  audioText: {
    fontSize: 16,
    color: '#333333',
    marginTop: 10,
  },audioList: {
  marginVertical: 10,
},
audioItem: {
  padding: 15,
  backgroundColor: "#f4f4f4",
  marginBottom: 10,
  borderRadius: 5,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},selectedTab: {
  borderBottomColor: "#007BFF",
},
});

export default styles;
