using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class ResetPasswordDTO
    {
        [Required]
        public required string Token { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres")]
        public required string NewPassword { get; set; }
    }
}
