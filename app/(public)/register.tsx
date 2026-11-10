import { FieldError } from "@/components/field-error";
import { PasswordInput } from "@/components/password-input";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useRegister } from "../src/auth/viewmodels/use-register";

export default function RegisterScreen() {
  const router = useRouter();
  const {
    form,
    handleRegister,
    errorMessage,
    isLoading
  } = useRegister()

  const { values, errors, onChange, onBlur } = form

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Account</Text>

          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <Text style={styles.label}>Full name</Text>
          <View style={[styles.inputContainer, errors.fullName && styles.inputError]}>
            <Feather name="user" size={20} color="#9CA3AF" />
            <TextInput
              value={values.fullName}
              onChangeText={onChange("fullName")}
              onBlur={onBlur("fullName")}
              style={styles.input}
              placeholder="Levi"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          <FieldError message={errors.fullName} style={styles.fieldError} />

          <Text style={styles.label}>Last Name</Text>
          <View style={[styles.inputContainer, errors.lastName && styles.inputError]}>
            <Feather name="user" size={20} color="#9CA3AF" />
            <TextInput
              value={values.lastName}
              onChangeText={onChange("lastName")}
              onBlur={onBlur("lastName")}
              style={styles.input}
              placeholder="Hernandez"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          <FieldError message={errors.lastName} style={styles.fieldError} />

          <Text style={styles.label}>Phone</Text>
          <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
            <Feather name="phone" size={20} color="#9CA3AF" />
            <TextInput
              value={values.phone}
              onChangeText={onChange("phone")}
              onBlur={onBlur("phone")}
              style={styles.input}
              placeholder="6040-8574"
              keyboardType="phone-pad"
            />
          </View>
          <FieldError message={errors.phone} style={styles.fieldError} />

          <Text style={styles.label}>Email Address</Text>
          <View style={[styles.inputContainer, errors.email && styles.inputError]}>
            <Feather name="mail" size={20} color="#9CA3AF" />
            <TextInput
              value={values.email}
              onChangeText={onChange("email")}
              onBlur={onBlur("email")}
              style={styles.input}
              placeholder="Levi@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <FieldError message={errors.email} style={styles.fieldError} />

          <Text style={styles.label}>Password</Text>
          <PasswordInput
            value={values.password}
            onChangeText={onChange("password")}
            onBlur={onBlur("password")}
            placeholder="**************"
            hasError={!!errors.password}
          />
          <FieldError message={errors.password} style={styles.fieldError} />

          <Text style={styles.label}>Confirm Password</Text>
          <PasswordInput
            leftIcon="shield"
            value={values.confirmPassword}
            onChangeText={onChange("confirmPassword")}
            onBlur={onBlur("confirmPassword")}
            placeholder="**************"
            hasError={!!errors.confirmPassword}
          />
          <FieldError message={errors.confirmPassword} style={styles.fieldError} />

          {isLoading ? (
            <ActivityIndicator size="large" color="#006C47" />
          ) : (
            <TouchableOpacity style={styles.buttonRegister} onPress={handleRegister}>
              <Text style={styles.buttonRegisterText}>Register</Text>
            </TouchableOpacity>
          )}

          <View style={styles.signRow}>
            <Text style={styles.signInText}>Already have an account ?</Text>
            <TouchableOpacity
              onPress={() => router.push("/(public)")}
            >
              <Text style={styles.signTextLink}> Log in here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    paddingTop: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 15,
    height: 50,
  },
  input: {
    flex: 1,
    height: "100%",
    marginLeft: 8,
  },
  inputError: {
    borderColor: "#DC2626",
  },
  // Los inputs tienen marginBottom 15: se sube el error para que quede pegado al campo
  fieldError: {
    marginTop: -10,
    marginBottom: 12,
  },
  errorContainer: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    marginBottom: 20,
    padding: 12,
  },
  errorText: {
    fontSize: 15,
    textAlign: "center",
    color: "#DC2626",
    fontWeight: "500",
  },
  buttonRegister: {
    backgroundColor: "#006C47",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 8,
  },
  buttonRegisterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signInText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signTextLink: {
    fontSize: 14,
    color: "#006C47",
    fontWeight: "bold",
  },
});
