using System.ComponentModel.DataAnnotations;

namespace DataPresenter.Server.DTO.Login
{
    /// <summary>
    /// Data Transfer Object for login requests.
    /// Contains the users credentials used for authentication.
    /// </summary>
    public class LoginDto
    {
        /// <summary>
        /// The username of the user.
        /// </summary>
        [Required]
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// The user's plaintext password.
        /// </summary>
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
