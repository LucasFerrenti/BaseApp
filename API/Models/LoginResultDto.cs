namespace API.Models
{
    public class LoginResultDto
    {
        public string Token { get; set; }
        public UserBasicDTO User { get; set; }
    }
}
