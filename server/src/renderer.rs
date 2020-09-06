use crate::{assets, board, puyo::{Puyo, Type}};
use image::{GenericImageView, SubImage, RgbaImage};
use image::{ImageBuffer, imageops::overlay, Rgba};

pub struct Renderer {
    skin: assets::Skin,
}

impl Renderer {
    pub fn new(skin: assets::Skin) -> Renderer {
        Renderer{
            skin,
        }
    }

    fn get_puyo_tile(self: &Renderer, col: u32, row: u32) -> SubImage<&image::DynamicImage> {
        self.skin.puyo_skin.view(
            col * assets::PUYO_WIDTH_PX, 
            row * assets::PUYO_HEIGHT_PX, 
            assets::PUYO_WIDTH_PX, 
            assets::PUYO_HEIGHT_PX,
        )
    }

    fn blit_puyo_tile(self: &Renderer, img: &mut RgbaImage, x: u32, y: u32, col: u32, row: u32) {
        overlay(
            img,
            &self.get_puyo_tile(col, row),
            x * assets::PUYO_WIDTH_PX,
            y * assets::PUYO_HEIGHT_PX,
        );
    }

    fn get_puyo_row_col(puyo: &Puyo) -> Option<(u32, u32)> {
        match puyo {
            Puyo{puyo: Type::None, cleared: _, neighbors: _} => None,
            Puyo{puyo: Type::Red, cleared: false, neighbors} => Some((neighbors.bits(), 0)),
            Puyo{puyo: Type::Green, cleared: false, neighbors} => Some((neighbors.bits(), 1)),
            Puyo{puyo: Type::Blue, cleared: false, neighbors} => Some((neighbors.bits(), 2)),
            Puyo{puyo: Type::Yellow, cleared: false, neighbors} => Some((neighbors.bits(), 3)),
            Puyo{puyo: Type::Purple, cleared: false, neighbors} => Some((neighbors.bits(), 4)),
            Puyo{puyo: Type::Garbage, cleared: _, neighbors: _} => Some((0, 5)),
            Puyo{puyo: Type::Point, cleared: _, neighbors: _} => Some((1, 5)),
            Puyo{puyo: Type::Sun, cleared: _, neighbors: _} => Some((2, 5)),
            Puyo{puyo: Type::Hard, cleared: _, neighbors: _} => Some((3, 5)),
            Puyo{puyo: Type::Iron, cleared: _, neighbors: _} => Some((4, 5)),
            Puyo{puyo: Type::Block, cleared: _, neighbors: _} => Some((5, 5)),
            Puyo{puyo: Type::Red, cleared: true, neighbors: _} => Some((6, 5)),
            Puyo{puyo: Type::Green, cleared: true, neighbors: _} => Some((7, 5)),
            Puyo{puyo: Type::Blue, cleared: true, neighbors: _} => Some((8, 5)),
            Puyo{puyo: Type::Yellow, cleared: true, neighbors: _} => Some((9, 5)),
            Puyo{puyo: Type::Purple, cleared: true, neighbors: _} => Some((10, 5)),
        }
    }

    fn blit_puyo(self: &Renderer, img: &mut RgbaImage, x: u32, y: u32, puyo: &Puyo) {
        for (col, row) in Renderer::get_puyo_row_col(puyo) {
            self.blit_puyo_tile(img, x, y, col, row);
        }
    }

    fn blit_border(self: &Renderer, img: &mut RgbaImage, x: u32, y: u32) {
        overlay(
            img,
            &self.skin.border,
            x * assets::PUYO_WIDTH_PX,
            y * assets::PUYO_HEIGHT_PX,
        );
    }

    pub fn render_board(self: &Renderer, board: board::Board) -> RgbaImage {
        let width = board.get_width();
        let height = board.get_height();
        let hidden_rows = board.get_hidden_rows();

        let total_height = height + hidden_rows;
        let width_px = assets::PUYO_WIDTH_PX * (width + 2);
        let height_px = assets::PUYO_HEIGHT_PX * (total_height + 1);
        let mut image = ImageBuffer::from_pixel(width_px, height_px, Rgba([48, 48, 48, 255]));

        for y in 0..total_height {
            if y > 0 {
                self.blit_border(&mut image, 0, y);
                self.blit_border(&mut image, width + 1, y);
            }
            for x in 0..width {
                self.blit_puyo(&mut image, x + 1, y, board.get(x, y));
            }
        }

        for x in 0..width+2 {
            self.blit_border(&mut image, x, total_height);
        }

        image
    }
}