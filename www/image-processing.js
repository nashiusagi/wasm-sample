export function averageMosaic(img, width, height, kernel_size, imageData) {
  const number_h = Math.floor(height / kernel_size)
  const number_w = Math.floor(width / kernel_size)
  const num_kernel_pixels = kernel_size * kernel_size

  for (let h = 0; h < number_h; h++) {
    for (let w = 0; w < number_w; w++) {
      let sumR = 0
      let sumG = 0
      let sumB = 0
      for (let y = kernel_size * h; y < kernel_size * (h + 1); y++) {
        for (let x = kernel_size * w; x < kernel_size * (w + 1); x++) {
          sumR += img[4 * (y * width + x) + 0]
          sumG += img[4 * (y * width + x) + 1]
          sumB += img[4 * (y * width + x) + 2]
        }
      }

      let avgR = Math.floor(sumR / num_kernel_pixels)
      let avgG = Math.floor(sumG / num_kernel_pixels)
      let avgB = Math.floor(sumB / num_kernel_pixels)

      for (let y = kernel_size * h; y < kernel_size * (h + 1); y++) {
        for (let x = kernel_size * w; x < kernel_size * (w + 1); x++) {
          imageData.data[4 * (y * width + x) + 0] = avgR
          imageData.data[4 * (y * width + x) + 1] = avgG
          imageData.data[4 * (y * width + x) + 2] = avgB
          imageData.data[4 * (y * width + x) + 3] = 255
        }
      }
    }
  }
}
