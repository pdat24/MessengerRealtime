using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public class MessageModel
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string senderId { get; set; } = "";
        public Message message { get; set; } = new();
    }
    public record Message(string content = "", string type = "");
}
