using Microsoft.AspNetCore.Mvc;
using server.Db;
using MongoDB.Driver;
using server.Models;

namespace server.APIs;

[Route("api/[controller]/{conversationId}")]
[ApiController]
public class ConversationController : ControllerBase
{
    private readonly AppDB _db;
    public ConversationController(AppDB db) => _db = db;

    // [GET]::/api/conversation/{conversationId}
    [HttpGet]
    public async Task<List<MessageModel>> Get(string conversationId)
    {
        var users = await _db.Conversations.FindAsync(conversation => conversationId == conversation.Id);
        var conversation = users.FirstOrDefault().conversation;
        return conversation;
    }

    // [POST]::/api/conversation/{conversationId}
    [HttpPost]
    public async Task Post(string conversationId, MessageModel newMessage)
    {
        var users = await _db.Conversations.FindAsync(conversation => conversationId == conversation.Id);
        var filter = Builders<ConversationModel>.Filter.Eq("Id", conversationId);
        var update = Builders<ConversationModel>.Update.Push("conversation", newMessage);
        await _db.Conversations.UpdateOneAsync(filter, update);
    }
}
