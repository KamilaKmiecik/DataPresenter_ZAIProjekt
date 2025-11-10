using DataPresenter.Server.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DataPresenter.Server.Services
{
    /// <summary>
    /// Defines methods for generating JWT tokens for users.
    /// </summary>
    public interface ITokenService
    {
        /// <summary>
        /// Generates a JWT for the specified user.
        /// </summary>
        /// <param name="user">The user to generate the token for.</param>
        /// <returns>A signed JWT as a string.</returns>
        string GenerateToken(User user);
    }

    /// <summary>
    /// Service that creates JSON Web Tokens (JWT) using application configuration.
    /// </summary>
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="TokenService"/> class.
        /// </summary>
        /// <param name="configuration">Application configuration used to read JWT settings.</param>
        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Generates a signed JWT containing basic claims for the provided user.
        /// </summary>
        /// <param name="user">The user for whom the token is generated.</param>
        /// <returns>The serialized JWT as a string.</returns>
        public string GenerateToken(User user)
        {
            if (user is null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            var claims = new[]
            {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username ?? string.Empty),
                    new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

            var keyString = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

