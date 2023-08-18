using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    public class HomeController : Controller
    {
        public async Task Index()
        {
            string? user_id = Request.Cookies["user_id"];
            if (user_id == null)
            {
                Response.Redirect("/login");
            }
            await Response.SendFileAsync("./index.html");
        }
    }
}
