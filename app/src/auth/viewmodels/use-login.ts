import { useValidatedForm } from "@/hooks/use-validated-form";
import { alertInvalidForm } from "@/utils/alerts";
import { filters, validateEmail, validateRequiredPassword } from "@/utils/validators";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AuthService } from "../services/auth.service";

export function useLogin() {
    const { saveSession } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const form = useValidatedForm(
        { email: "", password: "" },
        {
            email: { filter: filters.email, validate: (value) => validateEmail(value) },
            password: { filter: filters.password, validate: (value) => validateRequiredPassword(value) },
        }
    )

    const handleLogin = async () => {
        setErrorMessage(null)
        if (!form.validateAll()) {
            alertInvalidForm()
            return
        }

        setIsLoading(true)

        try {
            const data = await AuthService.login(form.values.email.trim(), form.values.password)
            await saveSession(data.token, data.userResponse)

        } catch (error: any) {
            setErrorMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        form,
        isLoading,
        errorMessage,
        handleLogin
    }
}
