import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { FieldError } from "@/components/field-error";
import { PasswordInput } from "@/components/password-input";
import { useLogin } from "../src/auth/viewmodels/use-login";

export default function LoginScreen() {

  const router = useRouter()
  const {
    form,
    isLoading,
    errorMessage,
    handleLogin
  } = useLogin()

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Feather name="shopping-bag" size={25} color="#fff" />
          </View>
          <Text style={styles.appNameLabel}>ShopEase</Text>
          <Text style={styles.welcomeLabel}>
            Welcome back! Please enter your details
          </Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>

          {errorMessage &&(
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}


          <Text style={styles.label}>Email Address</Text>
          <View style={[styles.inputContainer, form.errors.email && styles.inputError]}>
            <Feather name="mail" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder="name@gmail.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={form.values.email}
              onChangeText={form.onChange("email")}
              onBlur={form.onBlur("email")}
            />
          </View>
          <FieldError message={form.errors.email} style={styles.fieldError} />

          <View style={styles.passwordRow}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordLabel}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
          <PasswordInput
            value={form.values.password}
            onChangeText={form.onChange("password")}
            onBlur={form.onBlur("password")}
            placeholder="**************"
            hasError={!!form.errors.password}
          />
          <FieldError message={form.errors.password} style={styles.fieldError} />
          {isLoading ? (
            <ActivityIndicator size="large" color="#006C47" />
          ) : (
            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={handleLogin}
            >
              <Text style={styles.buttonLoginText}>log in</Text>
            </TouchableOpacity>
          )}

        </View>
        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>Does not have account?</Text>
          <TouchableOpacity
            onPress={()=> router.push("/(public)/register")}
          >
            <Text style={styles.signUpTextLink}>sing up for free</Text>
          </TouchableOpacity>
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
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 15,
    backgroundColor: "#006C47",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  appNameLabel: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#006C47",
  },

  welcomeLabel: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    padding: 24,
    elevation: 2,
  },

  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
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

  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  forgotPasswordLabel: {
    color: "#006C47",
    fontWeight: "600",
  },

  buttonLogin:{
    backgroundColor:"#006C47",
    justifyContent:"center",
    alignItems:"center",
    height:50,
    borderRadius:8
  },

  buttonLoginText:{
    color:"#fff",
    fontSize:16,
    fontWeight:"bold"
  },

  signUpRow:{
    flexDirection:"row",
    justifyContent:"center",
    marginTop:35
  },

  signUpText:{
    fontSize:14,
    color:"#6B7280"
  },

  signUpTextLink:{
    fontSize:14,
    fontWeight:"bold",
    color:"#006C47"
  },

  errorContainer:{
    borderWidth:1,
    borderRadius:8,
    backgroundColor:"#FEF2F2",
    borderColor:"#FCA5A5",
    marginBottom:20,
    padding:12
  },

  errorText:{
    fontSize:15,
    textAlign:"center",
    color:"#DC2626",
    fontWeight:"500"
  }

});