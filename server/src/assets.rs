use rust_embed::RustEmbed;
use image::{DynamicImage, ImageError, ImageFormat};

#[derive(RustEmbed)]
#[folder = "assets/"]
struct Asset;

pub const PUYO_WIDTH_PX: u32 = 16;
pub const PUYO_HEIGHT_PX: u32 = 16;

pub struct Skin {
    pub puyo_skin: DynamicImage,
    pub border: DynamicImage,
}

#[derive(Debug)]
pub enum AssetError {
    Image(ImageError),
    MissingAsset,
}

impl From<ImageError> for AssetError {
    fn from(err: ImageError) -> AssetError {
        AssetError::Image(err)
    }
}

fn load_png_asset(filename: &str) -> Result<DynamicImage, AssetError> {
    let data = Asset::get(filename).ok_or(AssetError::MissingAsset)?;
    Ok(image::load_from_memory_with_format(&data.into_owned(), ImageFormat::Png)?)
}

pub fn get_skin_assets() -> Result<Skin, AssetError> {
    Ok(Skin{
        puyo_skin: load_png_asset("puyo.png")?,
        border: load_png_asset("wood_block.png")?,
    })
}