using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public class GroupModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = "";
        public string name { get; set; } = "";
        public string avatarUrl { get; set; } = "https://firebasestorage.googleapis.com/v0/b/messengerrealtime-134d1.appspot.com/o/group-img.png?alt=media&token=0beb50a7-2118-4a63-a960-c60c8880ce12";
        public List<ObjectId> members { get; set; } = new();
        [BsonRepresentation(BsonType.ObjectId)]
        public string conversationId { get; set; } = "";
    }
}
