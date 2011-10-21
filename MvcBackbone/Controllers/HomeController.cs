using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MvcBackbone.Models;

namespace MvcBackbone.Controllers
{
	public class HomeController : Controller
	{
		public static List<Todo> TodoList = new List<Todo>
			                   	{
			                   		new Todo{id = Guid.NewGuid(), content = "Take out trash"},
									new Todo{id = Guid.NewGuid(), content = "clean house"}
			                   	};
		public ActionResult Index()
		{
			ViewBag.Message = "Welcome to ASP.NET MVC!";

			return View();
		}

		public ActionResult Todos()
		{
			return Json(TodoList, JsonRequestBehavior.AllowGet);
		}

		[HttpPost]
		public ActionResult Todos(Todo todo)
		{
			todo.id = Guid.NewGuid();
			TodoList.Add(todo);
			return Json(TodoList, JsonRequestBehavior.AllowGet);
		}
	}
}
