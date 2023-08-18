using Microsoft.AspNetCore.Mvc;
using server.Db;
using server.Models;

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
            return RedirectPermanent("/");
        }

        // [POST]::/signup
        [HttpPost]
        public async Task<IActionResult> Index(string userId, string username, string password, [FromServices] AppDB db)
        {
            UserModel newUser = new() 
            {
                userId = userId,
                username = username,
                password = password,
            };
            await db.Users.InsertOneAsync(newUser);
            Response.Cookies.Append("user_id", userId);
            return Redirect("/");
        }
    }
}
