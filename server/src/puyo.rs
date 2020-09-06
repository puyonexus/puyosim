bitflags! {
    pub struct Neighbors: u32 {
        const DOWN = 0b0001;
        const UP = 0b0010;
        const RIGHT = 0b0100;
        const LEFT = 0b1000;
    }
}

#[derive(Debug, Copy, Clone, PartialEq)]
pub enum Type {
    None = 0,
    Red = 1,
    Green = 2,
    Blue = 3,
    Yellow = 4,
    Purple = 5,
    Garbage = 6,
    Point = 7,
    Sun = 8,
    Hard = 9,
    Iron = 10,
    Block = 11,
}

#[derive(Debug, Copy, Clone)]
pub struct Puyo {
    pub puyo: Type,
    pub cleared: bool,
    pub neighbors: Neighbors,
}

impl From<Type> for Puyo {
    fn from(puyo: Type) -> Puyo {
        Puyo{puyo, cleared: false, neighbors: Neighbors::empty()}
    }
}

impl Puyo {
    #[inline(always)]
    pub fn is_color_puyo(self: &Puyo) -> bool {
        match self.puyo {
            Type::Red | Type::Green | Type::Blue | Type::Yellow | Type::Purple => true,
            _ => false
        }
    }

    #[inline(always)]
    pub fn is_neighbor(self: &Puyo, other: &Puyo) -> bool {
        self.is_color_puyo() && self.puyo == other.puyo
    }
}

pub const EMPTY: Puyo = Puyo{puyo: Type::None, cleared: false, neighbors: Neighbors::empty()};
