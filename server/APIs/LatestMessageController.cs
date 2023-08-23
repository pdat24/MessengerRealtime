using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using server.Db;
using server.Models;

namespace server.APIs;

[Route("api/[controller]")]
[ApiController]
public partial class LatestMessageController : ControllerBase
{
    private readonly AppDB _db;
    public LatestMessageController(AppDB db) => _db = db;

    // [PUT]::/api/latestMessage/{userDbId}/{friendDbId}
    [Route("{userDbId}/{friendDbId}")]
    [HttpPut]
    public async Task ChangeLatestMessage(string userDbId, string friendDbId, MessageModel newMessage)
    {
        await Update(userDbId, friendDbId, newMessage);
        await Update(friendDbId, userDbId, newMessage);
    }

    // [PUT]::/api/latestMessage/{userDbId}/{friendDbId}/{state}
    [Route("{userDbId}/{friendDbId}/{state}")]
    [HttpPut]
    public async Task ChangeReadState(string userDbId, string friendDbId, string state)
    {
        var users = await _db.Users.FindAsync(user => user.Id == userDbId);
        var user = users.FirstOrDefault();
        bool changed = true;
        // mutate latest message
        user.friends.ForEach(friend =>
        {
            if (friend.friendId == friendDbId)
            {
                if (state == "read" && !friend.read) friend.read = true;
                else if (state == "unread" && friend.read) friend.read = false;
                else changed = false;
            }
        });
        // clone new friend collection
        if (changed)
        {
            var filter = Builders<UserModel>.Filter.Eq("Id", userDbId);
            var update = Builders<UserModel>.Update.Set("friends", user.friends);
            await _db.Users.UpdateOneAsync(filter, update);
        }
    }
}


public partial class LatestMessageController
{
    public async Task Update(string userDbId, string friendDbId, MessageModel newMessage)
    {
        var userInList = await _db.Users.FindAsync(user => user.Id == userDbId);
        var user = userInList.FirstOrDefault();
        // mutate latest message
        user.friends.ForEach(friend =>
        {
            if (friend.friendId == friendDbId)
            {
                friend.latestMessage = newMessage;
            }
        });
        // clone new friend collection
        var filter = Builders<UserModel>.Filter.Eq("Id", userDbId);
        var update = Builders<UserModel>.Update.Set("friends", user.friends);
        await _db.Users.UpdateOneAsync(filter, update);
    }
}
