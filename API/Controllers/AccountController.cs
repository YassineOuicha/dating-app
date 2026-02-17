using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(AppDbContext context, ITokenService tokenService): BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Email))
        {
          return BadRequest("Email is already taken");  
        }
        
        using var hmac = new HMACSHA512(); // using, so that it will be disposed after use
        
        var user = new AppUser
        {
            Email = registerDto.Email,
            DisplayName = registerDto.DisplayName,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key
        };
        
        context.Users.Add(user); // tracked by the context, but not yet saved to the database
        await context.SaveChangesAsync(); // save in database
        
        return Ok(user.ToDto(tokenService));
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await context.Users.SingleOrDefaultAsync(x => x.Email.ToLower() == loginDto.Email.ToLower());
        if (user == null)
        {
            return Unauthorized("Invalid email");
        }
        
        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
        
        if(!computedHash.SequenceEqual(user.PasswordHash))
        {
            return Unauthorized("Invalid password");
        }

        return Ok(user.ToDto(tokenService));
    }

    private async Task<bool> UserExists(string email)
    {
        return await context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
    }
}