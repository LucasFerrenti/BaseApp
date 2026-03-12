using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Operations.Services.Interfaces;

namespace Operations.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
        {
            var smtpHost = _configuration["Email:SmtpHost"]!;
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"]!);
            var smtpUser = _configuration["Email:SmtpUser"]!;
            var smtpPass = _configuration["Email:SmtpPass"]!;
            var fromEmail = _configuration["Email:From"]!;

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            };

            var message = new MailMessage(fromEmail, toEmail, subject, body)
            {
                IsBodyHtml = isHtml
            };

            await client.SendMailAsync(message);
        }
    }
}
