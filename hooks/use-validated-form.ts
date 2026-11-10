import { applyFilter, InputFilter } from "@/utils/validators";
import { useCallback, useRef, useState } from "react";

export interface FieldConfig<K extends string> {
  /** Filtro aplicado mientras se escribe (bloquea caracteres no permitidos). */
  filter?: InputFilter;
  /** Validación completa: se ejecuta al salir del campo y al enviar el formulario. */
  validate: (value: string, values: Record<K, string>) => string | null;
  /** Otros campos que se deben revalidar cuando este cambie (ej. confirmar contraseña). */
  revalidate?: K[];
}

export type FormErrors<K extends string> = Partial<Record<K, string>>;

/**
 * Estado de un formulario con filtrado de entrada y validación por campo.
 *
 * Uso:
 *   const form = useValidatedForm({ name: "" }, { name: { filter: filters.letters, validate: ... } })
 *   <TextInput value={form.values.name} onChangeText={form.onChange("name")} onBlur={form.onBlur("name")} />
 *   <FieldError message={form.errors.name} />
 *   if (!form.validateAll()) return
 */
export function useValidatedForm<K extends string>(
  initialValues: Record<K, string>,
  // NoInfer: los nombres de campo salen de `initialValues`, no de `revalidate`
  config: Record<NoInfer<K>, FieldConfig<NoInfer<K>>>
) {
  const [values, setValuesState] = useState<Record<K, string>>(initialValues);
  const [errors, setErrors] = useState<FormErrors<K>>({});

  // Refs para que los handlers sean estables y nunca lean valores desactualizados.
  const valuesRef = useRef(values);
  const initialRef = useRef(initialValues);
  const configRef = useRef(config);
  configRef.current = config;

  const commitValues = useCallback((next: Record<K, string>) => {
    valuesRef.current = next;
    setValuesState(next);
  }, []);

  const onChange = useCallback(
    (field: K) => (raw: string) => {
      const fieldConfig = configRef.current[field];
      const { value, error } = fieldConfig.filter
        ? applyFilter(raw, fieldConfig.filter)
        : { value: raw, error: null };

      const next = { ...valuesRef.current, [field]: value } as Record<K, string>;
      commitValues(next);

      setErrors((prev) => {
        const updated: FormErrors<K> = { ...prev };
        if (error) updated[field] = error;
        else delete updated[field];

        fieldConfig.revalidate?.forEach((dependent) => {
          if (!next[dependent]) return;
          const message = configRef.current[dependent].validate(next[dependent], next);
          if (message) updated[dependent] = message;
          else delete updated[dependent];
        });

        return updated;
      });
    },
    [commitValues]
  );

  const onBlur = useCallback(
    (field: K) => () => {
      const current = valuesRef.current;
      const message = configRef.current[field].validate(current[field], current);
      setErrors((prev) => {
        const updated: FormErrors<K> = { ...prev };
        if (message) updated[field] = message;
        else delete updated[field];
        return updated;
      });
    },
    []
  );

  /** Valida todos los campos. Devuelve true si el formulario es válido. */
  const validateAll = useCallback((): boolean => {
    const current = valuesRef.current;
    const next: FormErrors<K> = {};
    (Object.keys(configRef.current) as K[]).forEach((field) => {
      const message = configRef.current[field].validate(current[field], current);
      if (message) next[field] = message;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }, []);

  const reset = useCallback(
    (nextValues?: Record<K, string>) => {
      commitValues(nextValues ?? initialRef.current);
      setErrors({});
    },
    [commitValues]
  );

  return { values, errors, onChange, onBlur, validateAll, reset };
}
