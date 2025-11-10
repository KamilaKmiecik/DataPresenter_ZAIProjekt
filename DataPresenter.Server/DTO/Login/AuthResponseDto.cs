namespace DataPresenter.Server.DTO.Login
{
    /// <summary>
    /// Response returned after a successful authentication containing token and user information.
    /// </summary>
    public class AuthResponseDto
    {
        /// <summary>
        /// JWT access token for authenticated requests.
        /// </summary>
        public string Token { get; set; } = string.Empty;

        /// <summary>
        /// Authenticated user's username.
        /// </summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Authenticated user's email address.
        /// </summary>
        public string Email { get; set; } = string.Empty;
    }
}
