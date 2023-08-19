using MongoDB.Bson;

namespace server.Models
{
    public class FriendModel
    {
        public ObjectId friendId { get; set; }
        public IEnumerable<MessageModel> conversion { get; set; } = new List<MessageModel>();
    }
}
