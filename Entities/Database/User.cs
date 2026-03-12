using System.ComponentModel.DataAnnotations;
using Entities.Enums;

namespace Entities.Database
{
    public class User
    {
        [Key]
        public long Id { get; set; }

        public required string Username { get; set; }

        public required string Password { get; set; }

        public required string Email { get; set; }

        public required Role Role { get; set; }

        public required string Name { get; set; }

        public required string Surname { get; set; }

        public required Province State { get; set; }

        public required string City { get; set; }

        public string? Photo { get; set; }

        public bool Active { get; set; } = false;

        public string? ActiveToken { get; set; }

        public string? ResetToken { get; set; }
    }
}
