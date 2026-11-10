import { Feather } from "@expo/vector-icons";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface FieldErrorProps {
  message?: string | null;
  style?: StyleProp<ViewStyle>;
}

/** Mensaje de error en rojo para mostrar debajo de un campo. No renderiza nada si no hay error. */
export function FieldError({ message, style }: FieldErrorProps) {
  if (!message) return null;

  return (
    <View style={[styles.container, style]} accessibilityRole="alert">
      <Feather name="alert-circle" size={14} color="#DC2626" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 6,
    marginBottom: 6,
    gap: 6,
  },
  text: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
    color: "#DC2626",
  },
});
