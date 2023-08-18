using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public class UserModel
    {
        [BsonId]
        public ObjectId _id { get; set; }
        public string username { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        public string userId { get; set; } = string.Empty;
        public string avatarUrl { get; set; } = "https://firebasestorage.googleapis.com/v0/b/messengerrealtime-134d1.appspot.com/o/no-avatar.png?alt=media&token=3fd65e2c-ebb7-4e3d-9161-19a90566b930";
        public IEnumerable<AFriend> friends { get; set; } = new List<AFriend>();
    }
    public record AFriend(ObjectId _id, IEnumerable<AMessage> conversion);
    public record AMessage(string content, ObjectId senderId);
}
