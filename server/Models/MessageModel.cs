using MongoDB.Bson;

namespace server.Models
{
    public class MessageModel
    {
        public ObjectId senderId { get; set; }
        public string content { get; set; } = "";
    }
}
