'use strict'
import { draw_result } from '../pkg/image_processing'
import { averageMosaic } from './image-processing'

console.log('start loading wasm')
const imageInput = document.getElementById('input_image')

imageInput.addEventListener('change', (e) => {
  const image = new Image()
  image.onload = async () => {
    const { width, height } = image
    const orig_canvas = document.getElementById('original_canvas')
    orig_canvas.width = width
    orig_canvas.height = height

    const wasm_canvas = document.getElementById('canvas_wasm')
    wasm_canvas.width = width
    wasm_canvas.height = height

    const js_canvas = document.getElementById('canvas_js')
    js_canvas.width = width
    js_canvas.height = height

    orig_canvas.getContext('2d').drawImage(image, 0, 0, width, height)
    const { data } = orig_canvas.getContext('2d').getImageData(0, 0, width, height)

    console.log('js only')
    let js_context = js_canvas.getContext('2d')
    let js_imageData = js_context.createImageData(width, height)

    const jsGenerateStartTime = Date.now()
    averageMosaic(data, width, height, 12, js_imageData)
    const jsGenerateEndTime = Date.now()

    const jsDrawStartTime = Date.now()
    await js_context.putImageData(js_imageData, 0, 0)
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
