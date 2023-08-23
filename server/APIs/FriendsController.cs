using Microsoft.AspNetCore.Mvc;
using server.Db;
using MongoDB.Driver;
using server.Models;
using MongoDB.Bson;

namespace server.APIs;

[Route("api/[controller]")]
[ApiController]
public partial class FriendsController : ControllerBase
{
    private readonly AppDB _db;
    public FriendsController(AppDB db) => _db = db;

    // [GET]::/api/friends/{userId}
    [Route("{userID}")]
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
            var latestMessage = targetUser.friends[friendIndex].latestMessage;
            var read = targetUser.friends[friendIndex].read;
            friends.Add(new FriendAPIRepresent(friend.username, friend.avatarUrl, conversationId, friend.Id, latestMessage, read));
            friendIndex++;
        });

        return friends;
    }

    // [DELETE]::/api/friends/{userDbId}/{friendDbId}
    [Route("{userDbId}/{friendDbId}")]
    [HttpDelete]
    public async Task Delete(string userDbId, string friendDbId)
    {
        await Unfriend(userDbId, friendDbId);
        await Unfriend(friendDbId, userDbId);
    }
}


public partial class FriendsController
{
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
    public async Task Unfriend(string userDbId, string friendDbId)
    {
        var user = (await _db.Users.FindAsync(user => user.Id == userDbId)).FirstOrDefault();
        object conversationId = ObjectId.GenerateNewId().ToString();
        var newFriendList = user.friends.Where(friend =>
        {
            if (friend.friendId == friendDbId)
                conversationId = friend.conversationId;

            return friend.friendId != friendDbId;
        }).ToList();
        // remove conversation
        await _db.Conversations.DeleteOneAsync(Builders<ConversationModel>.Filter.Eq("Id", conversationId));
        var filter = Builders<UserModel>.Filter.Eq("Id", userDbId);
        var update = Builders<UserModel>.Update.Set("friends", newFriendList);
        await _db.Users.UpdateOneAsync(filter, update);
    }

}


public record FriendAPIRepresent(string Username, string AvatarUrl, string ConversationId, string Id, MessageModel LatestMessage, bool read);
