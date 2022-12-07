use rocket::{fs::FileServer, get, launch, routes};
use rocket_dyn_templates::{context, Template};

#[get("/<_..>")]
fn index() -> Template {
    Template::render("index", context! {})
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index])
        .mount("/app", FileServer::from("app/").rank(-12))
        .attach(Template::fairing())
}
