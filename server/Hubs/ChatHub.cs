using Microsoft.AspNetCore.SignalR;

namespace server.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendPrivateMessage(string senderId, string receiverId, string message, string type)
        {
            await Clients.All.SendAsync("sentAPrivateMessage", senderId, receiverId, message, type);
        }
        public async Task UserOnline(string userDbId)
        {
            await Clients.All.SendAsync("userOnline", userDbId);
        }
        public async Task UserOffline(string userDbId)
        {
            await Clients.All.SendAsync("userOffline", userDbId);
        }
    }
}
