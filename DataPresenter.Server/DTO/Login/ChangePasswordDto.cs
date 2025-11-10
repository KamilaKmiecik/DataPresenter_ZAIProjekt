using System.ComponentModel.DataAnnotations;

namespace DataPresenter.Server.DTO.Login
{
    /// <summary>
    /// DTO used when a user requests to change their password.
    /// Contains the current password and the requested new password.
    /// </summary>
    public class ChangePasswordDto
    {
        /// <summary>
        /// The user's current password. Required for verification before changing.
        /// </summary>
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        /// <summary>
        /// The new password to set for the user. Required and must be between 6 and 100 characters.
        /// </summary>
        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string NewPassword { get; set; } = string.Empty;
    }

}
