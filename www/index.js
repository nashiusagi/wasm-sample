'use strict'
import { draw_result } from '../pkg/image_processing'
import { averageMosaic } from './image-processing'

console.log('start loading wasm')
const imageInput = document.getElementById('input_image')

imageInput.addEventListener('change', (e) => {
  const image = new Image()
  image.onload = async () => {
    const { width, height } = image
    const origCanvas = document.getElementById('original_canvas')
    origCanvas.width = width
    origCanvas.height = height

    const wasmCanvas = document.getElementById('canvas_wasm')
    wasmCanvas.width = width
    wasmCanvas.height = height

    const jsCanvas = document.getElementById('canvas_js')
    jsCanvas.width = width
    jsCanvas.height = height

    origCanvas.getContext('2d').drawImage(image, 0, 0, width, height)
    const { data } = origCanvas.getContext('2d').getImageData(0, 0, width, height)

    console.log('js only')
    let jsContext = jsCanvas.getContext('2d')
    let jsImageData = jsContext.createImageData(width, height)

    const jsGenerateStartTime = Date.now()
    averageMosaic(data, width, height, 12, jsImageData)
    const jsGenerateEndTime = Date.now()

    const jsDrawStartTime = Date.now()
    await jsContext.putImageData(jsImageData, 0, 0)
    const jsDrawEndTime = Date.now()

    console.log(`\tgenerate:js\telapsed:${jsGenerateEndTime - jsGenerateStartTime}[ms]`)
    console.log(`\tdraw: js\telapsed: ${jsDrawEndTime - jsDrawStartTime} [ms]`)

    console.log('wasm only')
    draw_result(data, width, height)
  }
  const reader = new FileReader()
  reader.onload = () => {
    image.src = reader.result
  }

  reader.readAsDataURL(e.target.files[0])
})
