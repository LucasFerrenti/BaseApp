using Entities.Database;
using Operations.Models;

namespace Operations.Operative.Interface
{
    public interface IUserOperative
    {
        OperativeResult<LoginResult> LoginByEmail(string email, string password);
        Task<OperativeResult<object>> RegisterUserAsync(User user);
        Task<OperativeResult<object>> ConfirmAccountAsync(string token);
        Task<OperativeResult<object>> ResendConfirmationEmailAsync(string email);
        Task<OperativeResult<object>> RequestPasswordResetAsync(string email);
        Task<OperativeResult<object>> ResetPasswordAsync(string token, string newPassword);
    }
}
