use grib2_reader::{Grib2, Grib2Parser, GridDefinitionTemplate};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Parser {
    parser: Grib2Parser,
    data: Vec<f32>,
    width: usize,
    height: usize,
}

#[wasm_bindgen]
impl Parser {
    pub fn new() -> Parser {
        set_panic_hook();

        Parser {
            parser: Grib2Parser::new(),
            data: vec![],
            width: 0,
            height: 0,
        }
    }

    pub fn parse_grib2_data(&mut self, data: Vec<u8>) {
        match self.parser.parse(data) {
            Ok(data) => {
                match get_data(&data) {
                    Some((data, width, height)) => {
                        self.data = data;
                        self.width = width;
                        self.height = height;
                    }
                    None => {
                        console_log!("Get data failed");
                    }
                };
            }
            Err(err) => {
                console_log!("Parse failed: {:?}", &err);
            }
        };
    }

    pub fn get_data(&self) -> Vec<f32> {
        self.data.clone()
    }

    pub fn get_width(&self) -> usize {
        self.width
    }

    pub fn get_height(&self) -> usize {
        self.height
    }
}

pub fn get_data(grib: &Grib2) -> Option<(Vec<f32>, usize, usize)> {
    let data = &grib.data[0].data;

    if let Some(grid_def) = &grib.grid_definition {
        if let GridDefinitionTemplate::LambertConformal(template) = &grid_def.template {
            let nx = template.nx_number_of_points_along_the_x_axis as usize;
            let ny = template.ny_number_of_points_along_the_y_axis as usize;

            let mut output: Vec<f32> = vec![0.; nx * ny];
            output.copy_from_slice(&data[..]);

            return Some((output, nx, ny));
        }
    }

    None
}

pub fn set_panic_hook() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

#[macro_export]
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}
