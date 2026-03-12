using DataAcces.PostgresDB;
using DataAcces.PostgresDB.Repositories;
using DataAcces.PostgresDB.Repositories.Interfaces;
using Entities.Database;
using Entities.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Operations.Models;
using Operations.Operative.Interface;
using Operations.Services;
using Operations.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Operations.Operative
{
    public class UserOperative : IUserOperative
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public UserOperative(IConfiguration config)
        {
            _configuration = config;

            var Services = new ServiceCollection();
            Services.AddSingleton<IConfiguration>(config);

            Services.AddDbContext<PetWorkshopDbContext>();
            Services.AddScoped<IUserRepository, UserRepository>();
            Services.AddScoped<IJwtService, JwtService>();
            Services.AddScoped<IEmailService, EmailService>();

            var serviceProvider = Services.BuildServiceProvider();

            _userRepository = serviceProvider.GetRequiredService<IUserRepository>();
            _jwtService = serviceProvider.GetRequiredService<IJwtService>();
            _emailService = serviceProvider.GetRequiredService<IEmailService>();
        }

        public OperativeResult<LoginResult> LoginByEmail(string email, string password)
        {
            var user = _userRepository.FindAsync(u => u.Email == email).Result;

            if (user is null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
                return new OperativeResult<LoginResult>(UserError.INVALID_CREDENTIALS);

            if (!user.Active)
                return new OperativeResult<LoginResult>(UserError.ACCOUNT_NOT_ACTIVATED);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = _jwtService.GenerateToken(claims);

            return new OperativeResult<LoginResult>
            {
                Success = true,
                Message = "Inicio exitoso",
                Data = new LoginResult
                {
                    User = user,
                    Token = token
                },
                Errors = new List<string>()
            };
        }

        public async Task<OperativeResult<object>> RegisterUserAsync(User user)
        {
            var existingUser = await _userRepository.GetByEmailAsync(user.Email);
            if (existingUser is not null)
                return new OperativeResult<object>(UserError.EMAIL_ALREADY_IN_USE);

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            var confirmClaims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var token = _jwtService.GenerateToken(confirmClaims);
            user.ActiveToken = token;
            user.Active = false;

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            try
            {
                await SendConfirmationEmailAsync(user.Name, user.Email, token);
            }
            catch
            {
                return new OperativeResult<object>(UserError.CONFIRMATION_EMAIL_FAILED);
            }

            return new OperativeResult<object>
            {
                Success = true,
                Message = "Usuario registrado. Revisá tu correo para confirmar la cuenta.",
                Data = null,
                Errors = new List<string>()
            };
        }

        public async Task<OperativeResult<object>> ResendConfirmationEmailAsync(string email)
        {
            var user = await _userRepository.FindAsync(u => u.Email == email);

            if (user is null)
                return new OperativeResult<object>(UserError.EMAIL_NOT_FOUND);

            if (user.Active)
                return new OperativeResult<object>(UserError.ACCOUNT_ALREADY_ACTIVATED);

            if (!string.IsNullOrEmpty(user.ActiveToken))
            {
                var remainingSeconds = GetCooldownRemainingSeconds(user.ActiveToken);
                if (remainingSeconds > 0)
                {
                    var error = new OperativeResult<object>(UserError.RESEND_COOLDOWN);
                    error.Message += $" ({remainingSeconds}s)";
                    return error;
                }
            }

            var confirmClaims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var token = _jwtService.GenerateToken(confirmClaims);
            user.ActiveToken = token;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            try
            {
                await SendConfirmationEmailAsync(user.Name, user.Email, token);
            }
            catch
            {
                return new OperativeResult<object>(UserError.CONFIRMATION_EMAIL_FAILED);
            }

            return new OperativeResult<object>
            {
                Success = true,
                Message = "Correo de confirmación reenviado exitosamente.",
                Data = null,
                Errors = new List<string>()
            };
        }

        public async Task<OperativeResult<object>> ConfirmAccountAsync(string token)
        {
            if (!_jwtService.ValidateToken(token))
            {
                bool isExpired = IsTokenExpired(token);
                return isExpired
                    ? new OperativeResult<object>(UserError.ACTIVATION_TOKEN_EXPIRED)
                    : new OperativeResult<object>(UserError.INVALID_ACTIVATION_TOKEN);
            }

            var claims = _jwtService.GetClaims(token);
            var email = claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email
                                                || c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
                return new OperativeResult<object>(UserError.INVALID_ACTIVATION_TOKEN);

            var user = await _userRepository.FindAsync(u => u.Email == email);

            if (user is null)
                return new OperativeResult<object>(UserError.INVALID_ACTIVATION_TOKEN);

            if (user.Active)
                return new OperativeResult<object>(UserError.ACCOUNT_ALREADY_ACTIVATED);

            user.Active = true;
            user.ActiveToken = null;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            return new OperativeResult<object>
            {
                Success = true,
                Message = "Cuenta activada exitosamente",
                Data = null,
                Errors = new List<string>()
            };
        }

        public async Task<OperativeResult<object>> RequestPasswordResetAsync(string email)
        {
            var user = await _userRepository.FindAsync(u => u.Email == email);

            if (user is null)
                return new OperativeResult<object>(UserError.EMAIL_NOT_FOUND);

            if (!user.Active)
                return new OperativeResult<object>(UserError.ACCOUNT_NOT_ACTIVATED);

            if (!string.IsNullOrEmpty(user.ResetToken))
            {
                var remainingSeconds = GetCooldownRemainingSeconds(user.ResetToken);
                if (remainingSeconds > 0)
                {
                    var error = new OperativeResult<object>(UserError.RESET_COOLDOWN);
                    error.Message += $" ({remainingSeconds}s)";
                    return error;
                }
            }

            var resetClaims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var token = _jwtService.GenerateToken(resetClaims);
            user.ResetToken = token;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            try
            {
                await SendResetPasswordEmailAsync(user.Name, user.Email, token);
            }
            catch
            {
                return new OperativeResult<object>(UserError.RESET_EMAIL_FAILED);
            }

            return new OperativeResult<object>
            {
                Success = true,
                Message = "Correo de recuperación enviado. Revisá tu email/spam.",
                Data = null,
                Errors = new List<string>()
            };
        }

        public async Task<OperativeResult<object>> ResetPasswordAsync(string token, string newPassword)
        {
            if (!_jwtService.ValidateToken(token))
            {
                bool isExpired = IsTokenExpired(token);
                return isExpired
                    ? new OperativeResult<object>(UserError.RESET_TOKEN_EXPIRED)
                    : new OperativeResult<object>(UserError.INVALID_RESET_TOKEN);
            }

            var claims = _jwtService.GetClaims(token);
            var email = claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email
                                                || c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
                return new OperativeResult<object>(UserError.INVALID_RESET_TOKEN);

            var user = await _userRepository.FindAsync(u => u.Email == email);

            if (user is null || user.ResetToken != token)
                return new OperativeResult<object>(UserError.INVALID_RESET_TOKEN);

            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.ResetToken = null;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            return new OperativeResult<object>
            {
                Success = true,
                Message = "Contraseña actualizada exitosamente.",
                Data = null,
                Errors = new List<string>()
            };
        }

        private async Task SendConfirmationEmailAsync(string name, string email, string token)
        {
            var baseUrl = _configuration["Email:BaseUrl"]!;
            var confirmUrl = $"{baseUrl}/confirm?token={token}";

            var subject = "Portal Mascotas - Confirmá tu cuenta";
            var body = $@"
                <html>
                <body style='font-family: Arial, sans-serif; padding: 20px;'>
                    <h2>¡Hola {name}!</h2>
                    <p>Gracias por registrarte en <strong>Portal Mascotas</strong>.</p>
                    <p>Para activar tu cuenta, hacé clic en el siguiente enlace:</p>
                    <a href='{confirmUrl}' 
                       style='display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                              color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;'>
                        Confirmar mi cuenta
                    </a>
                    <p>Si no creaste esta cuenta, podés ignorar este correo.</p>
                </body>
                </html>";

            await _emailService.SendEmailAsync(email, subject, body);
        }

        private async Task SendResetPasswordEmailAsync(string name, string email, string token)
        {
            var baseUrl = _configuration["Email:BaseUrl"]!;
            var resetUrl = $"{baseUrl}/reset-password?token={token}";

            var subject = "Portal Mascotas - Recuperá tu contraseña";
            var body = $@"
                <html>
                <body style='font-family: Arial, sans-serif; padding: 20px;'>
                    <h2>¡Hola {name}!</h2>
                    <p>Recibimos una solicitud para restablecer tu contraseña en <strong>Portal Mascotas</strong>.</p>
                    <p>Para crear una nueva contraseña, hacé clic en el siguiente enlace:</p>
                    <a href='{resetUrl}' 
                       style='display: inline-block; padding: 12px 24px; background-color: #2196F3; 
                              color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;'>
                        Restablecer contraseña
                    </a>
                    <p>Si no solicitaste este cambio, podés ignorar este correo. Tu contraseña no será modificada.</p>
                </body>
                </html>";

            await _emailService.SendEmailAsync(email, subject, body);
        }

        private int GetCooldownRemainingSeconds(string token)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwt = handler.ReadJwtToken(token);

                var iatClaim = jwt.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Iat);
                if (iatClaim is null || !long.TryParse(iatClaim.Value, out var iatUnix))
                    return 0;

                var issuedAt = DateTimeOffset.FromUnixTimeSeconds(iatUnix).UtcDateTime;
                var elapsed = DateTime.UtcNow - issuedAt;
                var cooldown = TimeSpan.FromMinutes(1);

                if (elapsed < cooldown)
                    return (int)Math.Ceiling((cooldown - elapsed).TotalSeconds);

                return 0;
            }
            catch
            {
                return 0;
            }
        }

        private bool IsTokenExpired(string token)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwt = handler.ReadJwtToken(token);
                return jwt.ValidTo < DateTime.UtcNow;
            }
            catch
            {
                return false;
            }
        }
    }
}
