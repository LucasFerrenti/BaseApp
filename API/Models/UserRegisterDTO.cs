using System.ComponentModel.DataAnnotations;
using Entities.Enums;

namespace API.Models
{
    public class UserRegisterDTO
    {
        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Surname { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required Province State { get; set; }

        [Required]
        public required string City { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres")]
        public required string Password { get; set; }
    }
}
