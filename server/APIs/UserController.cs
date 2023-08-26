using Microsoft.AspNetCore.Mvc;
using server.Db;
using server.Models;
using MongoDB.Driver;

namespace server.APIs;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly AppDB _db;
    public UserController(AppDB db) => _db = db;

    // [GET]::/api/user/all
    [Route("all")]
    [HttpGet]
    public async Task<List<SuggestedUserRepresent>> GetAll() // Get all user
    {
        var users = await _db.Users.FindAsync(_ => true);
        var result = new List<SuggestedUserRepresent>();
        await users.ForEachAsync(user =>
        {
            result.Add(new SuggestedUserRepresent(user.username, user.avatarUrl, user.Id));
        });
        return result;
    }

    // [GET]::/api/user/arrayUserIds
    [Route("arrayUserIds")]
    [HttpPost]
    public async Task<List<SuggestedUserRepresent>> GetUsersByArrayIds(ArrayUserIds userIds)
    {
        var users = await _db.Users.FindAsync(u => userIds.UserIds.Contains(u.Id));
        var result = new List<SuggestedUserRepresent>();
        await users.ForEachAsync(user =>
        {
            result.Add(new SuggestedUserRepresent(user.username, user.avatarUrl, user.Id));
        });
        return result;
    }

    // [GET]::/api/user/{userid}
    [Route("{userID}")]
    [HttpGet]
    public async Task<UserAPIRepresent> GetById(string userId)
    {
        var users = await _db.Users.FindAsync(user => user.userId == userId);
        var targetUser = users.FirstOrDefault();
        return new UserAPIRepresent(targetUser.username, targetUser.avatarUrl);
    }

    // [PATCH]::/api/user/{userid}
    [Route("{userID}")]
    [HttpPatch]
    public async Task UpdateUserInfo(string userId, UserAPIRepresent newInfo)
    {
        var filter = Builders<UserModel>.Filter.Eq("userId", userId);
        if (!string.IsNullOrEmpty(newInfo.AvatarUrl))
        {
            var update = Builders<UserModel>.Update.Set("avatarUrl", newInfo.AvatarUrl);
            await _db.Users.UpdateOneAsync(filter, update);
        }
        if (!string.IsNullOrEmpty(newInfo.Username))
        {
            var update = Builders<UserModel>.Update.Set("username", newInfo.Username);
            await _db.Users.UpdateOneAsync(filter, update);
        }
    }

}
public record UserAPIRepresent(string? Username, string? AvatarUrl);
public record ArrayUserIds(string[] UserIds);
public record SuggestedUserRepresent(string Username, string AvatarUrl, string UserDbId);
