import { useValidatedForm } from "@/hooks/use-validated-form";
import { alertInvalidForm } from "@/utils/alerts";
import {
    filters,
    validateConfirmPassword,
    validateEmail,
    validateName,
    validateNewPassword,
    validatePhone,
} from "@/utils/validators";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { AuthService } from "../services/auth.service";

export function useRegister() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useValidatedForm(
        {
            fullName: "",
            lastName: "",
            phone: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        {
            fullName: { filter: filters.letters, validate: (value) => validateName(value, "El nombre") },
            lastName: { filter: filters.letters, validate: (value) => validateName(value, "El apellido") },
            phone: { filter: filters.phone, validate: (value) => validatePhone(value) },
            email: { filter: filters.email, validate: (value) => validateEmail(value) },
            password: {
                filter: filters.password,
                validate: (value) => validateNewPassword(value),
                // Si ya escribió la confirmación, se vuelve a comparar al cambiar la contraseña
                revalidate: ["confirmPassword"],
            },
            confirmPassword: {
                filter: filters.password,
                validate: (value, values) => validateConfirmPassword(value, values.password),
            },
        }
    )

    const handleRegister = async () => {
        setErrorMessage(null)
        if (!form.validateAll()) {
            alertInvalidForm()
            return
        }

        const { fullName, lastName, phone, email, password } = form.values
        setIsLoading(true)

        try {
            await AuthService.register(
                fullName.trim(),
                lastName.trim(),
                phone.trim(),
                email.trim(),
                password
            )
            Alert.alert(
                "¡Registro exitoso!",
                "Tu cuenta fue creada correctamente. Ahora puedes iniciar sesión.",
                [{ text: "Aceptar", onPress: () => router.replace("/(public)") }]
            )
        } catch (error: any) {
            setErrorMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        form,
        handleRegister,
        errorMessage,
        isLoading
    }
}
