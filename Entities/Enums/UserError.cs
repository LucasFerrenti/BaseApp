using System.ComponentModel;

namespace Entities.Enums
{
    public enum UserError
    {
        [Description("Credenciales inválidas")]
        INVALID_CREDENTIALS,

        [Description("La cuenta no está activada. Revisá tu correo electrónico y spam.")]
        ACCOUNT_NOT_ACTIVATED,

        [Description("El email ya está registrado")]
        EMAIL_ALREADY_IN_USE,

        [Description("El usuario fue creado pero no se pudo enviar el email de confirmación")]
        CONFIRMATION_EMAIL_FAILED,

        [Description("Token de activación inválido")]
        INVALID_ACTIVATION_TOKEN,

        [Description("La cuenta ya fue activada previamente")]
        ACCOUNT_ALREADY_ACTIVATED,

        [Description("Datos de registro inválidos")]
        INVALID_REGISTRATION_DATA,

        [Description("Token requerido")]
        TOKEN_REQUIRED,

        [Description("El token de activación ha expirado")]
        ACTIVATION_TOKEN_EXPIRED,

        [Description("Debés esperar antes de reenviar el próximo correo de confirmación")]
        RESEND_COOLDOWN,

        [Description("El email no está registrado")]
        EMAIL_NOT_FOUND,

        [Description("No se pudo enviar el correo de recuperación")]
        RESET_EMAIL_FAILED,

        [Description("Token de recuperación inválido")]
        INVALID_RESET_TOKEN,

        [Description("El token de recuperación ha expirado")]
        RESET_TOKEN_EXPIRED,

        [Description("Debés esperar antes de solicitar otro correo de recuperación")]
        RESET_COOLDOWN
    }
}