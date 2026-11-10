import { Alert } from "react-native";

/** Alerta que se muestra cuando el usuario intenta enviar un formulario con datos inválidos. */
export function alertInvalidForm() {
  Alert.alert(
    "Datos inválidos",
    "Revisa los campos marcados en rojo y corrige los errores antes de continuar."
  );
}
