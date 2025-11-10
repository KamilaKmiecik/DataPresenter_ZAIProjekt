using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Metrics;

namespace DataPresenter.Server.Models
{
    /// <summary>
    /// Represents an application user with credentials and related measurements.
    /// </summary>
    public class User
    {
        /// <summary>
        /// Primary key identifier
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Unique username for the user (maximum length 100).
        /// </summary>
        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Hashed password used for authentication.
        /// </summary>
        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        /// <summary>
        /// Email address of the user (maximum length 100).
        /// </summary>
        [Required]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// UTC timestamp when the user account was created.
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// UTC timestamp of the user's last login; null if the user has never logged in.
        /// </summary>
        public DateTime? LastLogin { get; set; }

        /// <summary>
        /// Measurements created or associated with this user.
        /// </summary>
        public virtual ICollection<Measurement> Measurements { get; set; } = new List<Measurement>();
    }

}
