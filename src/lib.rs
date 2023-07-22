mod image_processing;

use wasm_bindgen::prelude::*;
use wasm_bindgen::{Clamped, JsCast};
use web_sys::ImageData;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace=console)]
    fn log(a: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

macro_rules! measure_elapsed_time {
    ($t:tt,$s:block) => {{
        let window = web_sys::window().expect("should have a window in this context");
        let performance = window
            .performance()
            .expect("performance should be available");
        let start = performance.now();
        let result = { $s };
        let end = performance.now();
        console_log!("{}:{}[ms]", $t, end - start);
        result
    }};
}

#[wasm_bindgen]
pub fn draw_result(buf: Clamped<Vec<u8>>, width: u32, height: u32) {
    const CANVAS_ID: &str = "canvas_wasm";
    let document = web_sys::window().unwrap().document().unwrap();
    let canvas = document.get_element_by_id(CANVAS_ID).unwrap();

    // HtmlCanvasElement型のAPIを使うためにElement型からキャストする
    let canvas: web_sys::HtmlCanvasElement = canvas
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .map_err(|_| ())
        .unwrap();

    // Object型からCanvasRenderingContext2d型にキャストする
    let context: web_sys::CanvasRenderingContext2d = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()
        .unwrap();

    let mut result = measure_elapsed_time!("\tgenerate:wasm\telapsed: ", {
        image_processing::process(buf.0, width, height)
    });

    measure_elapsed_time!("\tdraw:wasm\telapsed: ", {
        let data = ImageData::new_with_u8_clamped_array_and_sh(Clamped(&mut result), width, height);
        if let Ok(data) = data {
            let _ = context.put_image_data(&data, 0.0, 0.0);
        }
    })
}
