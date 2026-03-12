using Entities.Database;
using Entities.Enums;

namespace API.Models
{
    public class UserBasicDTO
    {
        public string Email { get; set; }
        public int RoleId { get; set; }
        public string Role { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Photo { get; set; }

        public UserBasicDTO()
        {
            
        }

        public UserBasicDTO(User user)
        {
            Email = user.Email;
            RoleId = (int)user.Role;
            Role = EnumHelper.GetDescription(user.Role);
            Name = user.Name;
            Surname = user.Surname;
            Photo = user.Photo ?? "";
        }
    }
}
