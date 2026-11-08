import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryService } from "../src/categories/services/category.service";
import { useAuth } from "../src/context/AuthContext";

export default function InventoryScreen() {
  const router = useRouter();
  const { token } = useAuth()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveCategory = async () => {
    if (!name.trim()) {
      Alert.alert("Campo requerido", "Por favor ingrese el nombre de la categoria")
      return
    }
    if (!description.trim()) {
      Alert.alert("Campo requerido", "Por favor ingrese la descripcion")
      return
    }
    if (!token) {
      Alert.alert("Error de sesion", "No se encontro el token")
      return
    }

    try {
      const newCategory = await CategoryService.createCategory(name, description, token)

      Alert.alert(
        "¡Categoría creada!",
        `La categoría "${newCategory.name}" se guardó exitosamente`,
        [
          {
            text: "Aceptar",
            onPress: () => {
              setName("")
              setDescription("")
              router.replace("/(protected)/dashboard")
            }
          }
        ]
      )
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo guardar la categoría")
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Drawer.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(protected)/dashboard")}
          >
            <Ionicons name="arrow-back-outline" size={26} />
          </TouchableOpacity>

          <View style={styles.titleWrapper}>
            <Text style={styles.headerTitle}>ADMIN PORTAL</Text>
            <Text style={styles.headerSubtitle}>Nueva Categoría</Text>
          </View>

          <View style={styles.boxIconContainer}>
            <Ionicons name="archive-outline" size={22} />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.logoText}>
            Ingresa los datos esenciales para catalogar los productos en el inventario
          </Text>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre de la categoría</Text>
              <TextInput
                placeholder="Ej. Dulcería"
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripción</Text>
              <TextInput
                placeholder="Describe los productos que engloban esta categoría..."
                multiline
                value={description}
                onChangeText={setDescription}
                editable={!isLoading}
                numberOfLines={5}
                textAlignVertical="top"
                style={styles.textAreaInput}
              />
            </View>

            {/* Botón Guardar */}
            <TouchableOpacity
              onPress={handleSaveCategory}
              disabled={isLoading}
              style={styles.btnSave}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Ionicons
                    style={styles.checkIcon}
                    name="checkmark-outline"
                    size={22}
                    color="#FFF"
                  />
                  <Text style={styles.btnSaveText}>Guardar Categoría</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Botón Cancelar (actualizado: solo texto, sin ícono ni fondo) */}
            <TouchableOpacity style={styles.btnCancel}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  titleWrapper: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#006C47",
    marginTop: 2,
  },
  boxIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  logoText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    fontSize: 14,
    borderRadius: 10,
  },
  textAreaInput: {
    height: 120,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  btnSave: {
    backgroundColor: "#006C47",
    height: 48,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  checkIcon: {
    marginRight: 8,
  },
  btnSaveText: {
    color: "#FFF",
    fontSize: 15,
  },
  // --- Estilos finales del botón Cancelar ---
  btnCancel: {
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  btnCancelText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
});