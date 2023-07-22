export function averageMosaic(img, width, height, kernelSize, imageData) {
  const numberH = Math.floor(height / kernelSize)
  const numberW = Math.floor(width / kernelSize)
  const numKernelPixels = kernelSize * kernelSize

  for (let h = 0; h < numberH; h++) {
    for (let w = 0; w < numberW; w++) {
      let sumR = 0
      let sumG = 0
      let sumB = 0
      for (let y = kernelSize * h; y < kernelSize * (h + 1); y++) {
        for (let x = kernelSize * w; x < kernelSize * (w + 1); x++) {
          sumR += img[4 * (y * width + x) + 0]
          sumG += img[4 * (y * width + x) + 1]
          sumB += img[4 * (y * width + x) + 2]
        }
      }

      let avgR = Math.floor(sumR / numKernelPixels)
      let avgG = Math.floor(sumG / numKernelPixels)
      let avgB = Math.floor(sumB / numKernelPixels)

      for (let y = kernelSize * h; y < kernelSize * (h + 1); y++) {
        for (let x = kernelSize * w; x < kernelSize * (w + 1); x++) {
          imageData.data[4 * (y * width + x) + 0] = avgR
          imageData.data[4 * (y * width + x) + 1] = avgG
          imageData.data[4 * (y * width + x) + 2] = avgB
          imageData.data[4 * (y * width + x) + 3] = 255
        }
      }
    }
  }
}
