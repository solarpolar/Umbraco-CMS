using System;
using Microsoft.Extensions.Options;

namespace Umbraco.Cms.Web.Common.Security
{
    /// <summary>
    /// An external login (OAuth) provider for the back office
    /// </summary>
    public class MemberExternalLoginProvider : IEquatable<MemberExternalLoginProvider>
    {
        public MemberExternalLoginProvider(
            string authenticationType,
            IOptionsMonitor<MemberExternalLoginProviderOptions> properties)
        {
            if (properties is null)
            {
                throw new ArgumentNullException(nameof(properties));
            }

            AuthenticationType = authenticationType ?? throw new ArgumentNullException(nameof(authenticationType));
            Options = properties.Get(authenticationType);
        }

        /// <summary>
        /// The authentication "Scheme"
        /// </summary>
        public string AuthenticationType { get; }

        public MemberExternalLoginProviderOptions Options { get; }

        public override bool Equals(object obj) => Equals(obj as MemberExternalLoginProvider);
        public bool Equals(MemberExternalLoginProvider other) => other != null && AuthenticationType == other.AuthenticationType;
        public override int GetHashCode() => HashCode.Combine(AuthenticationType);
    }

}
