using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public class UserModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = "";
        public string username { get; set; } = "";
        public string password { get; set; } = "";
        public string userId { get; set; } = "";
        public string avatarUrl { get; set; } = "https://firebasestorage.googleapis.com/v0/b/messengerrealtime-134d1.appspot.com/o/no-avatar.png?alt=media&token=3fd65e2c-ebb7-4e3d-9161-19a90566b930";
        public List<FriendModel> friends { get; set; } = new();
        public List<ObjectId> friendRequestsReceived { get; set; } = new();
        public List<ObjectId> friendRequestsSent { get; set; } = new();
    }
}
