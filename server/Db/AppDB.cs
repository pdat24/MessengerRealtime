using MongoDB.Driver;
using MongoDB.Bson;
using server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections;

namespace server.Db;

public class AppDB
{
    private IMongoDatabase _getDatabase()
    {
        string connectionUri = "mongodb+srv://datp62661:Noircoding24@mogoservice.xzz2jci.mongodb.net/?retryWrites=true&w=majority";

        var settings = MongoClientSettings.FromConnectionString(connectionUri);

        settings.ServerApi = new ServerApi(ServerApiVersion.V1);

        var client = new MongoClient(settings);
        
        var db = client.GetDatabase("messenger");
        return db;
    }
    public IMongoCollection<UserModel> Users
    {
        get
        {
            var db = _getDatabase();
            return db.GetCollection<UserModel>("users");
        }
    }
    public IMongoCollection<ConversationModel> Conversations
    {
        get
        {
            var db = _getDatabase();
            return db.GetCollection<ConversationModel>("conversations");
        }
    }
}
