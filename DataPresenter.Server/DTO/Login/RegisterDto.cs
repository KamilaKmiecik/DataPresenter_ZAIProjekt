using System.ComponentModel.DataAnnotations;

namespace DataPresenter.Server.DTO.Login
{
    /// <summary>
    /// Data transfer object used when registering a new user.
    /// Contains the required fields for creating an account.
    /// </summary>
    public class RegisterDto
    {
        /// <summary>
        /// Username for the new account.
        /// </summary>
        [Required]
        [StringLength(100, MinimumLength = 10)]
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Email address for the new account.
        /// </summary>
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Password for the new account.
        /// </summary>
        [Required]
        [StringLength(100, MinimumLength = 12)]
        public string Password { get; set; } = string.Empty;
    }

}
