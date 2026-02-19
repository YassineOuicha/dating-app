using API.Dtos;
using API.Entities;
using API.Interfaces;

namespace API.Extensions;

public static class AppUserExtensions
{
    // We need to pass the token service as a parameter because this a static class => No dependency injection
    public static UserDto ToDto(this AppUser user, ITokenService tokenService)
    { 
        return new UserDto
        {
            Id = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email,
            Token = tokenService.CreateToken(user),
            ImageUrl = user.ImageUrl
        };
    }
}