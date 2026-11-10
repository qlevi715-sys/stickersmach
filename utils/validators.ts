/**
 * Validaciones y filtros de entrada reutilizables para todos los formularios.
 *
 * Hay dos capas:
 *  1. InputFilter  -> se aplica MIENTRAS el usuario escribe. Elimina los caracteres
 *                     no permitidos (ej. números en un nombre) y devuelve un mensaje.
 *  2. validateXxx  -> se aplica al salir del campo (blur) y al enviar el formulario.
 *                     Devuelve un mensaje de error o null si el valor es válido.
 */

// Letras (incluye tildes, ñ y ü). Se escribe explícito para no depender de \p{L} en Hermes.
const LETTERS = "A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u017F";

const HAS_LETTER_RE = new RegExp(`[${LETTERS}]`);
const NAME_RE = new RegExp(`^[${LETTERS}]+(?: [${LETTERS}]+)*$`);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SKU_RE = /^[A-Za-z0-9][A-Za-z0-9\-_]*$/;

/* -------------------------------------------------------------------------- */
/*  Filtros de entrada (mientras se escribe)                                  */
/* -------------------------------------------------------------------------- */

export interface InputFilter {
  /** Caracteres NO permitidos (regex global). */
  blocked: RegExp;
  /** Mensaje que se muestra cuando el usuario intenta escribir un carácter bloqueado. */
  message: string;
  /** Formato opcional posterior a la limpieza (espacios, longitud máxima, etc.). */
  format?: (text: string) => string;
}

const collapseSpaces = (text: string) =>
  text.replace(/^\s+/, "").replace(/\s{2,}/g, " ");

export const filters = {
  /** Nombres, apellidos, categorías: solo letras y espacios. */
  letters: {
    blocked: new RegExp(`[^${LETTERS}\\s]`, "g"),
    message: "Este campo solo acepta letras. No se permiten números ni símbolos.",
    format: (t) => collapseSpaces(t).slice(0, 50),
  },
  /** Teléfono: solo dígitos, espacios, guiones y un + inicial. */
  phone: {
    blocked: /[^0-9+\-\s]/g,
    message: "El teléfono solo acepta números (puedes usar guion). No se permiten letras.",
    format: (t) =>
      collapseSpaces(t)
        .replace(/\+/g, (match, offset: number) => (offset === 0 ? match : ""))
        .slice(0, 20),
  },
  /** Correo: sin espacios. */
  email: {
    blocked: /\s/g,
    message: "El correo no puede contener espacios.",
    format: (t) => t.slice(0, 100),
  },
  /** Contraseña: sin espacios. */
  password: {
    blocked: /\s/g,
    message: "La contraseña no puede contener espacios.",
    format: (t) => t.slice(0, 64),
  },
  /** Precios: solo números con hasta 2 decimales. */
  decimal: {
    blocked: /[^0-9.,]/g,
    message: "Este campo solo acepta números (ej. 25.50). No se permiten letras ni símbolos.",
    format: (t) => {
      const [integerPart, ...rest] = t.replace(/,/g, ".").split(".");
      const integer = integerPart.slice(0, 9);
      return rest.length ? `${integer || "0"}.${rest.join("").slice(0, 2)}` : integer;
    },
  },
  /** Cantidades (stock): solo números enteros. */
  integer: {
    blocked: /[^0-9]/g,
    message: "Este campo solo acepta números enteros. No se permiten letras ni símbolos.",
    format: (t) => t.slice(0, 9),
  },
  /** SKU / código: letras, números, guion y guion bajo. */
  sku: {
    blocked: /[^A-Za-z0-9\-_]/g,
    message: "El SKU solo acepta letras, números, guion (-) y guion bajo (_).",
    format: (t) => t.slice(0, 50),
  },
  /** Nombre de producto: letras y números (ej. "Nike Air 90") pero sin símbolos raros. */
  productName: {
    blocked: new RegExp(`[^${LETTERS}0-9\\s.,'&()/+%#\\-]`, "g"),
    message: "El nombre contiene símbolos no permitidos (por ejemplo < > { } [ ] @ $ ! ?).",
    format: (t) => collapseSpaces(t).slice(0, 100),
  },
} satisfies Record<string, InputFilter>;

/**
 * Aplica un filtro al texto escrito. Devuelve el valor ya limpio y, si el usuario
 * intentó escribir algo bloqueado, el mensaje de error correspondiente.
 */
export function applyFilter(
  raw: string,
  filter: InputFilter
): { value: string; error: string | null } {
  const hadBlockedChars = raw.search(filter.blocked) !== -1;
  let value = raw.replace(filter.blocked, "");
  if (filter.format) value = filter.format(value);
  return { value, error: hadBlockedChars ? filter.message : null };
}

/* -------------------------------------------------------------------------- */
/*  Validadores (al salir del campo y al enviar)                              */
/* -------------------------------------------------------------------------- */

type Result = string | null;

/** Nombres, apellidos, categorías. `label` incluye el artículo: "El nombre", "El apellido". */
export function validateName(value: string, label: string): Result {
  const text = value.trim();
  if (!text) return `${label} es obligatorio.`;
  if (/\d/.test(text)) return `${label} no puede contener números.`;
  if (!NAME_RE.test(text)) return `${label} solo puede contener letras.`;
  if (text.length < 2) return `${label} debe tener al menos 2 letras.`;
  return null;
}

export function validateEmail(value: string): Result {
  const text = value.trim();
  if (!text) return "El correo es obligatorio.";
  if (!EMAIL_RE.test(text)) return "Ingresa un correo válido, por ejemplo nombre@correo.com.";
  return null;
}

/** Login: solo exige que no esté vacía (no se imponen reglas de formato a cuentas existentes). */
export function validateRequiredPassword(value: string): Result {
  return value ? null : "La contraseña es obligatoria.";
}

/** Registro: mínimo 8 caracteres con al menos una letra y un número. */
export function validateNewPassword(value: string): Result {
  if (!value) return "La contraseña es obligatoria.";
  if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return "La contraseña debe incluir al menos una letra y un número.";
  }
  return null;
}

export function validateConfirmPassword(value: string, password: string): Result {
  if (!value) return "Confirma tu contraseña.";
  if (value !== password) return "Las contraseñas no coinciden.";
  return null;
}

export function validatePhone(value: string): Result {
  const text = value.trim();
  if (!text) return "El teléfono es obligatorio.";
  if (!/^\+?[0-9][0-9\s-]*$/.test(text)) {
    return "El teléfono solo puede contener números, espacios y guiones.";
  }
  const digits = text.replace(/\D/g, "").length;
  if (digits < 8 || digits > 15) return "El teléfono debe tener entre 8 y 15 dígitos.";
  return null;
}

export function validateProductName(value: string): Result {
  const text = value.trim();
  if (!text) return "El nombre del producto es obligatorio.";
  if (text.length < 2) return "El nombre del producto debe tener al menos 2 caracteres.";
  if (!HAS_LETTER_RE.test(text)) {
    return "El nombre del producto debe incluir letras (no puede ser solo números).";
  }
  return null;
}

export function validateSku(value: string): Result {
  const text = value.trim();
  if (!text) return "El SKU es obligatorio.";
  if (text.length < 3) return "El SKU debe tener al menos 3 caracteres.";
  if (!SKU_RE.test(text)) {
    return "El SKU solo puede contener letras, números, guion (-) y guion bajo (_).";
  }
  return null;
}

export function validatePrice(
  value: string,
  label: string,
  options: { required?: boolean } = {}
): Result {
  const { required = true } = options;
  const text = value.trim();
  if (!text) return required ? `${label} es obligatorio.` : null;
  if (!/^\d+(\.\d{1,2})?$/.test(text)) {
    return `${label} debe ser un número válido (ej. 25.50).`;
  }
  if (Number(text) <= 0) return `${label} debe ser mayor que 0.`;
  return null;
}

/** El precio de oferta es opcional, pero si se ingresa debe ser menor al precio regular. */
export function validateOfferPrice(offer: string, regular: string): Result {
  const base = validatePrice(offer, "El precio de oferta", { required: false });
  if (base || !offer.trim()) return base;
  if (validatePrice(regular, "El precio regular") === null && Number(offer) >= Number(regular)) {
    return "El precio de oferta debe ser menor al precio regular.";
  }
  return null;
}

export function validateInteger(
  value: string,
  label: string,
  options: { required?: boolean } = {}
): Result {
  const { required = true } = options;
  const text = value.trim();
  if (!text) return required ? `${label} es obligatorio.` : null;
  if (!/^\d+$/.test(text)) return `${label} debe ser un número entero.`;
  return null;
}

/** Textos largos (descripciones). `label` incluye el artículo: "La descripción". */
export function validateDescription(
  value: string,
  label: string,
  options: { required?: boolean; min?: number } = {}
): Result {
  const { required = true, min = 5 } = options;
  const text = value.trim();
  if (!text) return required ? `${label} es obligatoria.` : null;
  if (text.length < min) return `${label} debe tener al menos ${min} caracteres.`;
  if (!HAS_LETTER_RE.test(text)) {
    return `${label} debe incluir texto, no solo números o símbolos.`;
  }
  return null;
}

export function validateRequiredSelection(value: string, message: string): Result {
  return value ? null : message;
}
