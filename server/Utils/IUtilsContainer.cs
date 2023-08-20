using server.Db;

namespace server.Utils
{
    public interface IUtilsContainer
    {
        Task<string> GetUserDbIdByUserIdAndPassord(string userId, string password, AppDB db);
    }
}
