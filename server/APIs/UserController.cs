using Microsoft.AspNetCore.Mvc;
using server.Db;
using server.Models;
using MongoDB.Driver;

namespace server.APIs;

[Route("api/[controller]/{userID}")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly AppDB _db;
    public UserController(AppDB db) => _db = db;
    // [GET]::/api/user/{userid}
    [HttpGet]
    public async Task<UserAPIRepresent> Get(string userId)
    {
        var users = await _db.Users.FindAsync(user => user.userId == userId);
        var targetUser = users.FirstOrDefault();
        return new UserAPIRepresent(targetUser.username, targetUser.avatarUrl);
    }
    // [PATCH]::/api/user/{userid}
    [HttpPatch]
    public async Task Patch(string userId, UserAPIRepresent newInfo)
    {
        var filter = Builders<UserModel>.Filter.Eq("userId", userId);
        if (!string.IsNullOrEmpty(newInfo.avatarUrl))
        {
            var update = Builders<UserModel>.Update.Set("avatarUrl", newInfo.avatarUrl);
            await _db.Users.UpdateOneAsync(filter, update);
        }
        if (!string.IsNullOrEmpty(newInfo.username))
        {
            var update = Builders<UserModel>.Update.Set("username", newInfo.username);
            await _db.Users.UpdateOneAsync(filter, update);
        }

        Response.StatusCode = 200;
    }
}
public record UserAPIRepresent(string? username, string? avatarUrl);
