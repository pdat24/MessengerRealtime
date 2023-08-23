using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using server.Db;
using server.Models;

namespace server.APIs;

// Update friend requests
[Route("api/[controller]")]
[ApiController]
public partial class FriendRequestsController : ControllerBase
{
    private readonly AppDB _db;
    public FriendRequestsController(AppDB db) => _db = db;

    // [PATCH]::/api/friendRequests/{userid}/sent/{userDbIdReceivedRequest}
    [Route("{userID}/sent/{userDbIdReceivedRequest}")]
    [HttpPatch]
    public async Task AddFriendRequestsSent(string userId, string userDbIdReceivedRequest)
    {
        var filter = Builders<UserModel>.Filter.Eq("userId", userId);
        var update = Builders<UserModel>.Update.Push("friendRequestsSent", new ObjectId(userDbIdReceivedRequest));
        await _db.Users.UpdateOneAsync(filter, update);
    }

    // [DELETE]::/api/friendRequests/{userid}/sent/{userDbIdReceivedRequest}
    [Route("{userID}/sent/{userDbIdReceivedRequest}")]
    [HttpDelete]
    public async Task RemoveFriendRequestsSent(string userId, string userDbIdReceivedRequest)
    {
        var filterUser = Builders<UserModel>.Filter.Eq("userId", userId);

        // get requets without {userDbIdReceivedRequest}
        var user = (await _db.Users.FindAsync(user => user.userId == userId)).FirstOrDefault();
        var newRequests = user.friendRequestsSent.Where(request => request.ToString() != userDbIdReceivedRequest);

        var update = Builders<UserModel>.Update.Set("friendRequestsSent", newRequests.ToList());
        await _db.Users.UpdateOneAsync(filterUser, update);
    }

    // [PATCH]::/api/friendRequests/{userDbIdReceivedRequest}/received/{userDbIdSentRequest}
    [Route("{userDbIdReceivedRequest}/received/{userDbIdSentRequest}")]
    [HttpPatch]
    public async Task AddFriendRequestsReceived(string userDbIdReceivedRequest, string userDbIdSentRequest)
    {
        var filter = Builders<UserModel>.Filter.Eq("Id", userDbIdReceivedRequest);
        var update = Builders<UserModel>.Update.Push("friendRequestsReceived", new ObjectId(userDbIdSentRequest));
        await _db.Users.UpdateOneAsync(filter, update);
    }

    // [DELETE]::/api/friendRequests/{userDbIdReceivedRequest}/received/{userDbIdSentRequest}
    [Route("{userDbIdReceivedRequest}/received/{userDbIdSentRequest}")]
    [HttpDelete]
    public async Task RemoveFriendRequestsReceived(string userDbIdReceivedRequest, string userDbIdSentRequest)
    {
        var filterUser = Builders<UserModel>.Filter.Eq("Id", userDbIdReceivedRequest);

        // get requets without {userDbIdSentRequest}
        var user = (await _db.Users.FindAsync(user => user.Id == userDbIdReceivedRequest)).FirstOrDefault();
        var newRequests = user.friendRequestsSent.Where(request => request.ToString() != userDbIdSentRequest);

        var update = Builders<UserModel>.Update.Set("friendRequestsReceived", newRequests.ToList());
        await _db.Users.UpdateOneAsync(filterUser, update);
    }
}


// Get friend requests
public partial class FriendRequestsController
{
    // [GET]::/api/friendRequests/{userId}/sent
    [Route("{userId}/sent")]
    [HttpGet]
    public async Task<List<SuggestedUserRepresent>> GetFriendRequestsSent(string userId)
    {
        var user = (await _db.Users.FindAsync(user => user.userId == userId)).FirstOrDefault();
        var idsSent = user.friendRequestsSent.Select(i => i.ToString()).ToList();

        // get user info from request id
        var usersSent = await _db.Users.FindAsync(user => idsSent.Contains(user.Id));
        var result = new List<SuggestedUserRepresent>();
        await usersSent.ForEachAsync(user =>
        {
            result.Add(new SuggestedUserRepresent(user.username, user.avatarUrl, user.Id));
        });
        return result;
    }

    // [GET]::/api/friendRequests/{userId}/received
    [Route("{userId}/received")]
    [HttpGet]
    public async Task<List<SuggestedUserRepresent>> GetFriendRequestsReceived(string userId)
    {
        var user = (await _db.Users.FindAsync(user => user.userId == userId)).FirstOrDefault();
        var idsReceived = user.friendRequestsReceived.Select(i => i.ToString()).ToList();

        // get user info from request id
        var userReceived = await _db.Users.FindAsync(user => idsReceived.Contains(user.Id));
        var result = new List<SuggestedUserRepresent>();
        await userReceived.ForEachAsync(user =>
        {
            result.Add(new SuggestedUserRepresent(user.username, user.avatarUrl, user.Id));
        });
        return result;
    }
}


// Update friend list base on acceptance or denail
public partial class FriendRequestsController
{
    // [POST]::/api/friendRequests/{receiverDbId}/accept/{senderDbId}
    [Route("{receiverDbId}/accept/{senderDbId}")]
    [HttpPost]
    public async Task Accept(string receiverDbId, string senderDbId)
    {
        // create welcome message
        var welcomeMsg = new MessageModel
        {
            message = new Message("Bắt đàu cuộc trò chuyện.", "text"),
            senderId = ObjectId.GenerateNewId().ToString(),
        };
        // create new conversation
        await _db.Conversations.InsertOneAsync(new ConversationModel());
        var allConversations = await _db.Conversations.FindAsync(_ => true);
        var newConversation = allConversations.ToList().LastOrDefault();
        // get new conversation id
        var newConversationId = newConversation!.Id;
        // generate new friend for receiver
        var newFriendOfReceiver = new FriendModel
        {
            friendId = senderDbId,
            read = false,
            latestMessage = welcomeMsg,
            conversationId = newConversationId.ToString()
        };
        // generate new friend for sender
        var newFriendOfSender = new FriendModel
        {
            friendId = receiverDbId,
            read = false,
            latestMessage = welcomeMsg,
            conversationId = newConversationId.ToString()
        };
        // update receiver friend list
        var receiverFilter = Builders<UserModel>.Filter.Eq("Id", receiverDbId);
        var receiverUpdate = Builders<UserModel>.Update.Push("friends", newFriendOfReceiver);
        // update sender friend list
        var senderFilter = Builders<UserModel>.Filter.Eq("Id", senderDbId);
        var senderUpdate = Builders<UserModel>.Update.Push("friends", newFriendOfSender);
        // upgrade
        await _db.Users.UpdateOneAsync(receiverFilter, receiverUpdate);
        await _db.Users.UpdateOneAsync(senderFilter, senderUpdate);
        // remove friend request
        await Reject(receiverDbId, senderDbId);
    }

    // [DELETE]::/api/friendRequests/{receiverId}/receiverDbId/{senderDbId}
    [Route("{receiverDbId}/reject/{senderDbId}")]
    [HttpDelete]
    public async Task Reject(string receiverDbId, string senderDbId)
    {
        // update friend requests received of receiver
        var receiver = (await _db.Users.FindAsync(user => user.Id == receiverDbId)).FirstOrDefault();
        // remove senderDbId
        var newFriendRequestsReceived = receiver.friendRequestsReceived.Where(id => id.ToString() != senderDbId).ToList();
        var receiverFilter = Builders<UserModel>.Filter.Eq("Id", receiverDbId);
        var receiverUpdate = Builders<UserModel>.Update.Set("friendRequestsReceived", newFriendRequestsReceived);
        await _db.Users.UpdateOneAsync(receiverFilter, receiverUpdate);

        // update friend requests sent of sender
        var sender = (await _db.Users.FindAsync(user => user.Id == senderDbId)).FirstOrDefault();
        // remove receiverDbId
        var newFriendRequestsSent = receiver.friendRequestsSent.Where(id => id.ToString() != receiverDbId).ToList();
        var senderFilter = Builders<UserModel>.Filter.Eq("Id", senderDbId);
        var senderUpdate = Builders<UserModel>.Update.Set("friendRequestsSent", newFriendRequestsSent);
        await _db.Users.UpdateOneAsync(senderFilter, senderUpdate);
    }
}
