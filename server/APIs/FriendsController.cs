using Microsoft.AspNetCore.Mvc;
using server.Db;
using MongoDB.Driver;
using server.Models;

namespace server.APIs;

[Route("api/[controller]/{userID}")]
[ApiController]
public class FriendsController : ControllerBase
{
    private readonly AppDB _db;
    public FriendsController(AppDB db) => _db = db;
    // [GET]::/api/friends/{userId}
    [HttpGet]
    public async Task<List<FriendAPIRepresent>> Get(string userId)
    {
        int friendIndex = 0;
        var users = await _db.Users.FindAsync(user => user.userId == userId);
        var targetUser = users.FirstOrDefault();

        var friendIds = GetFriendIds(targetUser);
        var friendsInDB = await GetFriendInfoInDB(friendIds);

        var friends = new List<FriendAPIRepresent>();
        // collect user informations
        await friendsInDB.ForEachAsync(friend =>
        {
            var conversationId = targetUser.friends[friendIndex].conversationId;
            friends.Add(new FriendAPIRepresent(friend.username, friend.avatarUrl, conversationId));
            friendIndex++;
        });

        return friends;
    }
    private static List<string> GetFriendIds(UserModel user)
    {
        // friend id container
        var friendIds = new List<string>();
        // collect friends id
        foreach (var friend in user.friends)
        {
            friendIds.Add(friend.friendId);
        }
        return friendIds;
    }
    private async Task<IAsyncCursor<UserModel>> GetFriendInfoInDB(List<string> friendIds)
    {
        // friend information container
        var friendsInDB = await _db.Users.FindAsync(user => friendIds.Contains(user.Id));
        return friendsInDB;
    }
}

public record FriendAPIRepresent(string username, string avatarUrl, string conversationId);
