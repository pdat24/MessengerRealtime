using Microsoft.AspNetCore.Mvc;
using server.Db;
using MongoDB.Driver;
using server.Models;

namespace server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class APIController : Controller
    {
        [Route("user/{userID}")]
        public new async Task<UserAPI> User(string userId, [FromServices] AppDB db)
        {
            var users = await db.Users.FindAsync(user => user.userId == userId);
            var targetUser = users.FirstOrDefault();
            return new UserAPI(targetUser.username, targetUser.avatarUrl, targetUser.friends);
        }
    }
    public record UserAPI(string username, string avatarUrl, IEnumerable<AFriend> friends);
}
