using API.Models;
using Entities.Database;
using Entities.Enums;
using Microsoft.AspNetCore.Mvc;
using Operations.Operative.Interface;

namespace API.Controllers.v1
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserOperative _userOperative;

        public AuthController(IUserOperative userOperative)
        {
            _userOperative = userOperative;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO credentials)
        {
            var result = _userOperative.LoginByEmail(credentials.Email, credentials.Password);

            if (result.Success)
                return Ok(new ApiResult<LoginResultDto>
                {
                    Success = result.Success,
                    Message = result.Message,
                    Data = new()
                    {
                        Token = result.Data.Token,
                        User = new UserBasicDTO(result.Data.User)
                    }
                });
            else
                return Unauthorized(new ApiResult<object>
                {
                    Success = result.Success,
                    Message = result.Message,
                    Errors = result.Errors
                });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO request)
        {
            var user = new User
            {
                Username = request.Email,
                Email = request.Email,
                Password = request.Password,
                Name = request.Name,
                Surname = request.Surname,
                State = request.State,
                City = request.City,
                Role = Role.Customer,
                Active = false
            };

            var result = await _userOperative.RegisterUserAsync(user);

            if (result.Success)
                return Ok(new ApiResult<object>
                {
                    Success = true,
                    Message = result.Message
                });
            else
                return BadRequest(new ApiResult<object>
                {
                    Success = false,
                    Message = result.Message,
                    Errors = result.Errors
                });
        }

        [HttpPost("resend")]
        public async Task<IActionResult> ResendConfirmation([FromBody] ResendEmailDTO request)
        {
            var result = await _userOperative.ResendConfirmationEmailAsync(request.Email);

            if (result.Success)
                return Ok(new ApiResult<object>
                {
                    Success = true,
                    Message = result.Message
                });
            else
                return BadRequest(new ApiResult<object>
                {
                    Success = false,
                    Message = result.Message,
                    Errors = result.Errors
                });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ResendEmailDTO request)
        {
            var result = await _userOperative.RequestPasswordResetAsync(request.Email);

            if (result.Success)
                return Ok(new ApiResult<object>
                {
                    Success = true,
                    Message = result.Message
                });
            else
                return BadRequest(new ApiResult<object>
                {
                    Success = false,
                    Message = result.Message,
                    Errors = result.Errors
                });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO request)
        {
            var result = await _userOperative.ResetPasswordAsync(request.Token, request.NewPassword);

            if (result.Success)
                return Ok(new ApiResult<object>
                {
                    Success = true,
                    Message = result.Message
                });
            else
                return BadRequest(new ApiResult<object>
                {
                    Success = false,
                    Message = result.Message,
                    Errors = result.Errors
                });
        }

        [HttpGet("confirm")]
        public async Task<IActionResult> Confirm([FromQuery] string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return BadRequest(new ApiResult<object>(UserError.TOKEN_REQUIRED));

            var result = await _userOperative.ConfirmAccountAsync(token);

            if (result.Success)
                return Ok(new ApiResult<object>
                {
                    Success = true,
                    Message = result.Message
                });
            else
                return BadRequest(new ApiResult<object>
                {
                    Success = false,
                    Message = result.Message,
                    Errors = result.Errors
                });
        }
    }
}
