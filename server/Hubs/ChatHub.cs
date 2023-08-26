using Microsoft.AspNetCore.SignalR;

namespace server.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendPrivateMessage(string senderId, string receiverId, string message, string type)
        {
            await Clients.All.SendAsync("sentAPrivateMessage", senderId, receiverId, message, type);
        }
        public async Task SendGroupMessage(string senderId, string groupId, string conversationId, string message, string type)
        {
            await Clients.All.SendAsync("receivedGroupMessage", senderId, groupId, conversationId, message, type);
        }
    }
}
