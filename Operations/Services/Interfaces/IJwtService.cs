using System.Security.Claims;

namespace Operations.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(Claim[] claims);
        IEnumerable<Claim> GetClaims(string token);
        bool ValidateToken(string token);
    }
}
