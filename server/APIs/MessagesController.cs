using Microsoft.AspNetCore.Mvc;
using server.Db;
using MongoDB.Driver;
using server.Models;

namespace server.APIs;

[Route("/api/[controller]")]
[ApiController]
public class MessagesController : ControllerBase
{
    private readonly AppDB _db;
    public MessagesController(AppDB db) => _db = db;

    // [GET]::/api/messages/{conversationId}/images
    [HttpGet]
    [Route("{conversationId}/images")]
    public async Task<List<MessageModel>> GetImages(string conversationId)
    {
        return await GetMessageByType("image", conversationId);
    }

    // [GET]::/api/messages/{conversationId}/files
    [HttpGet]
    [Route("{conversationId}/files")]
    public async Task<List<MessageModel>> GetFiles(string conversationId)
    {
        return await GetMessageByType("file", conversationId);
    }

    public async Task<List<MessageModel>> GetMessageByType(string type, string conversationId) 
    {
        var target = (await _db.Conversations.FindAsync(c => c.Id == conversationId)).FirstOrDefault();
        var result = new List<MessageModel>();
        target.conversation.ForEach(m =>
        {
            if (m.message.type == type)
            {
                result.Add(m);
            }
        });
        return result;
    }
}
