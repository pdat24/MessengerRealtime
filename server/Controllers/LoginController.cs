using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using server.Db;

namespace server.Controllers
{
    public class LoginController : Controller
    {
        // [GET]::/login
        public IActionResult Index()
        {
            string? user_id = Request.Cookies["user_id"];
            if (user_id == null)
                return View();
            return Redirect("/");
        }

        // [POST]::/login
        [HttpPost]
        public async Task<IActionResult> Index(string userId, string password, [FromServices] AppDB db)
        {
            bool ok = false;
            var users = await db.Users.FindAsync(item => true);
            await users.ForEachAsync(user =>
            {
                if (user.userId == userId && user.password == password)
                    ok = true;
            });

            if (ok)
            {
                Response.Cookies.Append("user_id", userId);
                return Redirect("/");
            }
            return View();
        }
    }
}
