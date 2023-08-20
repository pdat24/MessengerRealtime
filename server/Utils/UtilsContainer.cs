using server.Db;
using MongoDB.Driver;

namespace server.Utils;

public class UtilsContainer : IUtilsContainer
{
    public async Task<string> GetUserDbIdByUserIdAndPassord(string userId, string password, AppDB db)
    {
        var users = await db.Users.FindAsync(user => user.userId == userId && user.password == password);
        var targetUser = users.FirstOrDefault();
        return targetUser.Id;
    }
}
