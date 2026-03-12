using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class ResendEmailDTO
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
    }
}
