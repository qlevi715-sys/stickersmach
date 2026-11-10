import { Feather } from "@expo/vector-icons";
import { ComponentProps, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface PasswordInputProps
  extends Omit<TextInputProps, "secureTextEntry" | "style" | "autoCapitalize" | "autoCorrect"> {
  /** Icono de la izquierda (por defecto un candado). */
  leftIcon?: ComponentProps<typeof Feather>["name"];
  containerStyle?: StyleProp<ViewStyle>;
  /** Pinta el borde en rojo. */
  hasError?: boolean;
}

/**
 * Campo de contraseña con botón para mostrar/ocultar.
 * Icono "eye" = contraseña oculta (toca para mostrarla); "eye-off" = contraseña visible.
 */
export function PasswordInput({
  leftIcon = "lock",
  containerStyle,
  hasError,
  ...inputProps
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={[styles.container, hasError && styles.containerError, containerStyle]}>
      <Feather name={leftIcon} size={20} color="#9CA3AF" />
      <TextInput
        {...inputProps}
        style={styles.input}
        secureTextEntry={!isVisible}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        onPress={() => setIsVisible((prev) => !prev)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        <Feather name={isVisible ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    height: 50,
  },
  containerError: {
    borderColor: "#DC2626",
  },
  input: {
    flex: 1,
    height: "100%",
    marginLeft: 8,
  },
});
