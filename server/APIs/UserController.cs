using Microsoft.AspNetCore.Mvc;
using server.Db;
using server.Models;
using MongoDB.Driver;

namespace server.APIs
{
    [Route("api/[controller]/{userID}")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private AppDB _db;
        public UserController(AppDB db)
        {
            _db = db;
        }
        // [GET]::/api/user/{userid}
        [HttpGet]
        public async Task<UserAPIRepresent> Get(string userId)
        {
            var users = await _db.Users.FindAsync(user => user.userId == userId);
            var targetUser = users.FirstOrDefault();
            return new UserAPIRepresent(targetUser.username, targetUser.avatarUrl, targetUser.friends);
        }
        // [PATCH]::/api/user/{userid}
        [HttpPatch]
        public async Task Patch(string userId, NewUserInfoToPatch newInfo)
        {
            try
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
            } catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            Response.StatusCode = 200;
        }
    }
    public record UserAPIRepresent(string username, string avatarUrl, IEnumerable<FriendModel> friends);
    public record NewUserInfoToPatch(string? username, string? avatarUrl);
}
