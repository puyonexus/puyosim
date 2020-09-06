use image::{DynamicImage};
use rocket::{http::ContentType, response::{content, Stream}};
use std::io::Cursor;

#[macro_use] extern crate rocket;
#[macro_use] extern crate lazy_static;
#[macro_use] extern crate bitflags;

mod assets;
mod board;
mod puyo;
mod renderer;

lazy_static! {
    static ref RENDERER: renderer::Renderer = {
        let skin = assets::get_skin_assets().unwrap();
        renderer::Renderer::new(skin)
    };
}

#[get("/image/<id>")]
fn image(id: String) -> String {
    id
}

#[get("/chainimage.php?<w>&<h>&<hr>&<chain>")]
fn chainimage(w: Option<u32>, h: Option<u32>, hr: Option<u32>, chain: Option<String>) -> Result<content::Content<Stream<Cursor<Vec<u8>>>>, board::ChainError> {
    let width = match w { Some(w) if w <= 16 => w, _ => 6 };
    let height = match h { Some(h) if h <= 26 => h, _ => 12 };
    let hidden_rows = match hr { Some(hr) if hr <= 2 => hr, _ => 1 };
    let chain_str = chain.as_ref().map(String::as_str).unwrap_or("");

    let board = board::Board::from_legacy_chain(width, height, hidden_rows, chain_str)?;
    let img = DynamicImage::ImageRgba8(RENDERER.render_board(board));

    let mut data: Vec<u8> = Vec::new();
    img.write_to(&mut data, image::ImageFormat::Png).unwrap();

    Ok(content::Content(ContentType::new("image", "png"), Stream::from(Cursor::new(data))))
}

#[launch]
fn rocket() -> rocket::Rocket {
    rocket::ignite().mount("/", routes![image, chainimage])
}
