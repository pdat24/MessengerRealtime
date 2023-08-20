using Microsoft.AspNetCore.Mvc;
using server.Db;
using server.Models;
using server.Utils;

namespace server.Controllers
{
    public class SignupController : Controller
    {
        // [GET]::/signup
        public IActionResult Index()
        {
            string? user_id = Request.Cookies["user_id"];
            if (user_id == null)
                return View();
            return Redirect("/");
        }

        // [POST]::/signup
        [HttpPost]
        public async Task<IActionResult> Index(
            string userId, 
            string username, 
            string password, 
            [FromServices] AppDB db,
            [FromServices] IUtilsContainer utils
        ) {
            var newUser = new UserModel
            {
                userId = userId,
                username = username,
                password = password,
            };
            await db.Users.InsertOneAsync(newUser);
            var userDbId = await utils.GetUserDbIdByUserIdAndPassord(username, password, db);
            Response.Cookies.Append("user_id", userId);
            Response.Cookies.Append("user_DbId", userDbId);
            return Redirect("/");
        }
    }
}
