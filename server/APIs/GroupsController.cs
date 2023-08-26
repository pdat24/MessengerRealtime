using Microsoft.AspNetCore.Mvc;
using server.Db;
using server.Models;
using MongoDB.Driver;
using MongoDB.Bson;

namespace server.APIs;

[ApiController]
[Route("/api/[controller]")]
public class GroupsController : ControllerBase
{
    private readonly AppDB _db;
    public GroupsController(AppDB db) => _db = db;

    // [GET]::/api/groups/{groupId}
    [HttpGet]
    [Route("{groupId}")]
    public async Task<GroupsModelWithMemberIdsIsString> GetGroupById(string groupId)
    {
        var group = (await _db.Groups.FindAsync(g => g.Id == groupId)).FirstOrDefault();
        var result = new GroupsModelWithMemberIdsIsString
        (
            Id: group.Id,
            conversationId: group.conversationId,
            name: group.name,
            members: group.members.Select(m => m.ToString()).ToList(),
            AvatarUrl: group.avatarUrl
        );
        return result;
    }

    // [GET]::/api/groups/{groupId}/messages
    [HttpGet]
    [Route("{groupId}/messages")]
    public async Task<List<MessageModel>> GetGroupMessages(string groupId)
    {
        var conversationId = (await GetGroupById(groupId)).conversationId;
        var conversation = (await _db.Conversations.FindAsync(c => conversationId == c.Id)).FirstOrDefault();
        var messages = conversation.conversation;
        return messages;
    }

    // [GET]::/api/groups/of/{userDbId}
    [HttpGet]
    [Route("of/{userDbId}")]
    public async Task<List<string>> GetGroupsByUserDbId(string userDbId)
    {
        var user = (await _db.Users.FindAsync(u => u.Id == userDbId)).FirstOrDefault();
        var result = new List<string>();
        user.groups.ForEach(group =>
        {
            result.Add(group.ToString());
        });
        return result;
    }

    // [GET]::/api/groups/data
    [HttpPost]
    [Route("data")]
    public async Task<List<GroupsModelWithMemberIdsIsString>> GetGroupDataByIds(GroupsIdArray groupsId)
    {
        var groups = (await _db.Groups.FindAsync(u => groupsId.GroupsId.Contains(u.Id))).ToList();
        var result = groups.Select(g => new GroupsModelWithMemberIdsIsString
        (
            Id: g.Id,
            name: g.name,
            conversationId: g.conversationId,
            members: g.members.Select(m => m.ToString()).ToList(),
            AvatarUrl: g.avatarUrl
        )).ToList();
        return result;
    }

    // [POST]::/api/groups/createdBy/{ownerDbId}
    [HttpPost]
    [Route("createdBy/{ownerDbId}")]
    public async Task<GroupsModelWithMemberIdsIsString> Create(string ownerDbId, NewGroupData group)
    {
        var owner = (await _db.Users.FindAsync(u => u.Id == ownerDbId)).FirstOrDefault();
        // create new conversation
        var newConversationId = ObjectId.GenerateNewId().ToString();
        await _db.Conversations.InsertOneAsync(new ConversationModel()
        {
            Id = newConversationId,
        });
        // create new conversation
        var newGroupId = ObjectId.GenerateNewId();
        var newGroup = new GroupModel
        {
            Id = newGroupId.ToString(),
            members = new List<ObjectId> { new ObjectId(ownerDbId) },
            conversationId = newConversationId,
            name = group.Name,
        };
        await _db.Groups.InsertOneAsync(newGroup);

        // update user group
        var filter = Builders<UserModel>.Filter.Eq("Id", ownerDbId);
        var update = Builders<UserModel>.Update.Push("groups", newGroupId);
        await _db.Users.UpdateOneAsync(filter, update);

        return new GroupsModelWithMemberIdsIsString
        (
            Id: newGroup.Id,
            conversationId: newGroup.conversationId,
            name: newGroup.name,
            members: newGroup.members.Select(m => m.ToString()).ToList(),
            AvatarUrl: newGroup.avatarUrl
        );
    }

    // [DELETE]::/api/groups/{groupId}
    [HttpDelete]
    [Route("{groupId}")]
    public async Task Delete(string groupId)
    {
        var filer = Builders<GroupModel>.Filter.Eq("Id", groupId);
        await _db.Groups.DeleteOneAsync(filer);
    }

    // [PATCH]::/api/groups/{groupId}/changeAvatar
    [HttpPatch]
    [Route("{groupId}/changeAvatar")]
    public async Task ChangeGroupAvatar(string groupId, GroupAvatar newAvatar)
    {
        var fitler = Builders<GroupModel>.Filter.Eq("Id", groupId);
        var update = Builders<GroupModel>.Update.Set("avatarUrl", newAvatar.AvatarUrl);
        await _db.Groups.UpdateOneAsync(fitler, update);
    }

    // [PATCH]::/api/groups/{groupId}/changeName
    [HttpPatch]
    [Route("{groupId}/changeName")]
    public async Task ChangeGroupName(string groupId, GroupName newName)
    {
        var fitler = Builders<GroupModel>.Filter.Eq("Id", groupId);
        var update = Builders<GroupModel>.Update.Set("name", newName.Name);
        await _db.Groups.UpdateOneAsync(fitler, update);
    }

    // [PATCH]::/api/groups/{userDbId}/join/{groupId}
    [HttpPatch]
    [Route("{userDbId}/join/{groupId}")]
    public async Task Join(string userDbId, string groupId)
    {
        if (ObjectId.TryParse(groupId, out _))
        {
            var group = (await _db.Groups.FindAsync(g => g.Id == groupId)).ToList();
            if (group.Count == 0) Response.StatusCode = 204;
            else
            {
                // add member from group
                var filterMember = Builders<GroupModel>.Filter.Eq("Id", groupId);
                var updateMember = Builders<GroupModel>.Update.Push("members", new ObjectId(userDbId));
                await _db.Groups.UpdateOneAsync(filterMember, updateMember);

                // add group in group list of user
                var filerGroup = Builders<UserModel>.Filter.Eq("Id", userDbId);
                var updateGroup = Builders<UserModel>.Update.Push("groups", new ObjectId(groupId));
                await _db.Users.UpdateOneAsync(filerGroup, updateGroup);
                Response.StatusCode = 200;
            }
        }
        else Response.StatusCode = 204;
    }

    // [PATCH]::/api/groups/{userDbId}/leave/{groupId}
    [HttpPatch]
    [Route("{userDbId}/leave/{groupId}")]
    public async Task Leave(string userDbId, string groupId)
    {
        //remove member from group
        var group = (await _db.Groups.FindAsync(g => g.Id == groupId)).FirstOrDefault();
        var newMembers = group.members.Where(m => m.ToString() != userDbId).ToList();
        var filterMember = Builders<GroupModel>.Filter.Eq("Id", groupId);
        var updateMember = Builders<GroupModel>.Update.Set("members", newMembers);
        await _db.Groups.UpdateOneAsync(filterMember, updateMember);
        // delete group if don't have member
        if (group.members.Count - 1 <= 0) await Delete(groupId);

        //remove group in group list of user
        var user = (await _db.Users.FindAsync(u => u.Id == userDbId)).FirstOrDefault();
        var newGroups = user.groups.Where(m => m.ToString() != groupId).ToList();
        var filerGroup = Builders<UserModel>.Filter.Eq("Id", userDbId);
        var updateGroup = Builders<UserModel>.Update.Set("groups", newGroups);
        await _db.Users.UpdateOneAsync(filerGroup, updateGroup);

    }
}

public record NewGroupData(string Name);
public record GroupsIdArray(string[] GroupsId);
public record GroupAvatar(string AvatarUrl);
public record GroupName(string Name);
public record GroupsModelWithMemberIdsIsString(string Id, List<string> members, string conversationId, string name, string AvatarUrl);
