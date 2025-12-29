export const authErrorMessages: Record<string, { pl: string; en: string }> = {
  invalid_credentials: {
    pl: "Nieprawidłowe dane logowania",
    en: "Invalid credentials",
  },
  email_not_confirmed: {
    pl: "Adres e-mail nie został potwierdzony",
    en: "Email not confirmed",
  },
  signup_disabled: {
    pl: "Rejestracja jest wyłączona",
    en: "Signup is disabled",
  },
  user_already_exists: {
    pl: "Konto z tym adresem e-mail już istnieje",
    en: "A user with this email already exists",
  },
  email_exists: {
    pl: "Konto z tym adresem e-mail już istnieje",
    en: "Email already exists",
  },
  email_taken: {
    pl: "Konto z tym adresem e-mail już istnieje",
    en: "Email already taken",
  },
  user_not_found: {
    pl: "Użytkownik nie znaleziony",
    en: "User not found",
  },
  weak_password: {
    pl: "Hasło jest zbyt słabe",
    en: "Password is too weak",
  },
  email_address_invalid: {
    pl: "Nieprawidłowy adres e-mail",
    en: "Invalid email address",
  },
  email_address_not_authorized: {
    pl: "Adres e-mail nie jest autoryzowany",
    en: "Email address not authorized",
  },
  too_many_requests: {
    pl: "Zbyt wiele prób, spróbuj ponownie później",
    en: "Too many requests, try again later",
  },
  default: {
    pl: "Wystąpił błąd podczas autentyfikacji",
    en: "An authentication error occurred",
  },
};

export function getAuthErrorMessage(errorCode: string, language: "pl" | "en" = "pl"): string {
  return authErrorMessages[errorCode]?.[language] || authErrorMessages.default[language];
}
