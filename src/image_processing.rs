use image::{ImageBuffer, Rgba};

extern crate console_error_panic_hook;
use std::panic;

pub fn process(buf: Vec<u8>, width: u32, height: u32) -> Vec<u8> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));

    let img = ImageBuffer::<Rgba<u8>, Vec<u8>>::from_raw(width, height, buf).unwrap();
    let dst = average_mosaic(&img, 12);

    let mut data = vec![];
    for y in 0..dst.height() {
        for x in 0..dst.width() {
            let p = dst.get_pixel(x, y);
            data.push(p[0]);
            data.push(p[1]);
            data.push(p[2]);
            data.push(p[3]);
        }
    }

    data
}

fn average_mosaic(
    img: &ImageBuffer<Rgba<u8>, Vec<u8>>,
    kernel_size: u32,
) -> ImageBuffer<Rgba<u8>, Vec<u8>> {
    let height: u32 = img.height();
    let width: u32 = img.width();

    let number_h: u32 = height / kernel_size;
    let number_w: u32 = width / kernel_size;

    let num_kernel_pixels: u32 = kernel_size * kernel_size;

    let mut out: ImageBuffer<Rgba<u8>, Vec<u8>> = img.clone();

    for h in 0..number_h {
        for w in 0..number_w {
            let mut sum_r: u32 = 0;
            let mut sum_g: u32 = 0;
            let mut sum_b: u32 = 0;
            for y in (kernel_size * h)..(kernel_size * (h + 1)) {
                for x in (kernel_size * w)..(kernel_size * (w + 1)) {
                    let p: [u8; 4] = img.get_pixel(x, y).0;
                    sum_r += p[0] as u32;
                    sum_g += p[1] as u32;
                    sum_b += p[2] as u32;
                }
            }

            let avg_r: u8 = (sum_r / num_kernel_pixels) as u8;
            let avg_g: u8 = (sum_g / num_kernel_pixels) as u8;
            let avg_b: u8 = (sum_b / num_kernel_pixels) as u8;

            for y in (kernel_size * h)..(kernel_size * (h + 1)) {
                for x in (kernel_size * w)..(kernel_size * (w + 1)) {
                    out.put_pixel(x, y, Rgba([avg_r, avg_g, avg_b, 255]));
                }
            }
        }
    }

    out
}
