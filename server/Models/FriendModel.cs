using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public class FriendModel
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string friendId { get; set; } = "";
        [BsonRepresentation(BsonType.ObjectId)]
        public string conversationId { get; set; } = "";
        public MessageModel latestMessage { get; set; } = new();
        public bool read { get; set; }
    }
}
