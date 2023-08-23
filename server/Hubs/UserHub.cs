using Microsoft.AspNetCore.SignalR;

namespace server.Hubs
{
    public class UserHub : Hub
    {
        public async Task SendPrivateMessage(string senderId, string receiverId, string message, string type)
        {
            await Clients.All.SendAsync("sentAPrivateMessage", senderId, receiverId, message, type);
        }
    }
}
