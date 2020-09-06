use crate::puyo;
use rocket::{Response, response::{Responder}, http::Status};

pub struct Board {
    width: u32,
    height: u32,
    hidden_rows: u32,
    puyos: Vec<puyo::Puyo>
}

#[derive(Debug, Copy, Clone)]
pub enum ChainError {
    InvalidCharacter,
}

impl<'r> Responder<'r, 'static> for ChainError {
    fn respond_to(self, _request: &'r rocket::Request<'_>) -> Result<Response<'static>, Status> {
        match self {
            ChainError::InvalidCharacter => {
                Err(Status::BadRequest)
            }
        }
    }
}

impl Board {
    pub fn new(width: u32, height: u32, hidden_rows: u32) -> Board {
        Board{
            width,
            height,
            hidden_rows,
            puyos: vec![puyo::EMPTY; (width * (height + hidden_rows)) as usize],
        }
    }

    pub fn from_legacy_chain(width: u32, height: u32, hidden_rows: u32, chain: &str) -> Result<Board, ChainError> {
        let mut board = Board::new(width, height, hidden_rows);
        board.load_chain(chain, true)?;
        Ok(board)
    }

    pub fn get_width(self: &Board) -> u32 {
        self.width
    }

    pub fn get_height(self: &Board) -> u32 {
        self.height
    }

    pub fn get_hidden_rows(self: &Board) -> u32 {
        self.hidden_rows
    }

    pub fn get(self: &Board, x: u32, y: u32) -> &puyo::Puyo {
        if x >= self.width || y >= self.height + self.hidden_rows {
            &puyo::EMPTY
        } else {
            self.puyos.get((y * self.width + x) as usize).unwrap_or(&puyo::EMPTY)
        }
    }

    fn load_chain(self: &mut Board, chain: &str, legacy: bool) -> Result<(), ChainError> {
        let mut index = self.puyos.len() - chain.len();
        if legacy {
            for i in chain.chars() {
                self.puyos.get_mut(index).unwrap().puyo = match i {
                    '0' => Ok(puyo::Type::None),
                    '4' => Ok(puyo::Type::Red),
                    '7' => Ok(puyo::Type::Green),
                    '5' => Ok(puyo::Type::Blue),
                    '6' => Ok(puyo::Type::Yellow),
                    '8' => Ok(puyo::Type::Purple),
                    '1' => Ok(puyo::Type::Garbage),
                    'B' => Ok(puyo::Type::Point),
                    'C' => Ok(puyo::Type::Sun),
                    'A' => Ok(puyo::Type::Hard),
                    '3' => Ok(puyo::Type::Iron),
                    '2' => Ok(puyo::Type::Block),
                    _ => Err(ChainError::InvalidCharacter),
                }?;
                index += 1;
            }    
        } else {
            for i in chain.chars() {
                self.puyos.get_mut(index).unwrap().puyo = match i {
                    '0' => Ok(puyo::Type::None),
                    '1' => Ok(puyo::Type::Red),
                    '2' => Ok(puyo::Type::Green),
                    '3' => Ok(puyo::Type::Blue),
                    '4' => Ok(puyo::Type::Yellow),
                    '5' => Ok(puyo::Type::Purple),
                    '6' => Ok(puyo::Type::Garbage),
                    '7' => Ok(puyo::Type::Point),
                    '8' => Ok(puyo::Type::Sun),
                    '9' => Ok(puyo::Type::Hard),
                    'a' => Ok(puyo::Type::Iron),
                    'b' => Ok(puyo::Type::Block),
                    _ => Err(ChainError::InvalidCharacter),
                }?;
                index += 1;
            }    
        }
        self.recalculate_neighbors();
        Ok(())
    }

    pub fn recalculate_neighbors(self: &mut Board) {
        let width = self.width as usize;

        for y in 0..self.height + self.hidden_rows {
            let row = y * self.width;
            for x in 0..self.width {
                let index = (row + x) as usize;
                let puyo = *self.puyos.get(index).unwrap();

                if !puyo.is_color_puyo() {
                    continue;
                }

                let same_horiz = puyo.is_neighbor(self.get(x - 1, y));
                let same_vert = y != self.hidden_rows && puyo.is_neighbor(self.get(x, y - 1));
                if x > 0 {
                    self.puyos.get_mut(index - 1).unwrap().neighbors.set(puyo::Neighbors::RIGHT, same_horiz);
                }
                self.puyos.get_mut(index).unwrap().neighbors.set(puyo::Neighbors::LEFT, same_horiz);
                if y > 0 {
                    self.puyos.get_mut(index - width).unwrap().neighbors.set(puyo::Neighbors::DOWN, same_vert);
                }
                self.puyos.get_mut(index).unwrap().neighbors.set(puyo::Neighbors::UP, same_vert);
            }
        }
    }
}
