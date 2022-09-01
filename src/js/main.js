const theme = new Theme() // 100r theme init
theme.install()
theme.start()

let created = false;

const start = document.getElementById("start")
const sizeInput = document.getElementById("size")

const canvas = document.getElementById("imageCanvas") // the actual canvas
const ctx = canvas.getContext("2d") // canvas context
const tools = document.getElementsByName("tool") // tools html elements
const fileInput = document.getElementById("fileInput") // invisible file input (for opening images)

let imageSize; // size of the image [width, height]
let image; // imageData

let color = [255, 255, 255] // currently used color
let selectedTool; // selected tool (paint or fill)

const picker = new Pickr({ // color picker init
	el: "#picker",
	container: "#top",
	theme: "nano",
	components: {
		preview: true,
		hue: true,
		interaction: {
			input: true,
			hex: true,
			rgba: true,
			hsva: true
		}
	}
})

const colorSwatches = document.getElementsByClassName("swatch") // color swatches html elements
let selectedSwatch; // currently selected color swatch index
let mouseDown = false; // mouseDown

for (let i = 0; i < colorSwatches.length; i++) {
	colorSwatches[i].addEventListener("click", () => {
		setSelectedSwatch(i) // select color swatch on click
	})
	colorSwatches[i].style.setProperty("--color", `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`) // random color for every swatch
}

picker.on("change", (c) => {
	colorSwatches[selectedSwatch].style.setProperty("--color", c.toRGBA()) // set currently selected color swatch to color of picker
	color = c.toRGBA() // set currently used color to color of picker
})

function setImageSize(w, h) {
	imageSize = [w, h] // imageSize = [width, height]
	canvas.width = w // set canvas size
	canvas.height = h
	image = ctx.createImageData(w, h) // new image
}

function randomizeImage() {
	for (let i = 0; i < image.data.length; i += 4) {
		image.data[i + 0] = Math.round(Math.random() * 255) // random red
		image.data[i + 1] = Math.round(Math.random() * 255) // random green
		image.data[i + 2] = Math.round(Math.random() * 255) // random blue
		image.data[i + 3] = 255 // always 255 opacity
	}
}

function clearImage() {
	for (let i = 0; i < image.data.length; i += 4) {
		const brightness = 255; // white
		image.data[i + 0] = brightness
		image.data[i + 1] = brightness
		image.data[i + 2] = brightness
		image.data[i + 3] = 0 // 0 opacity
	}
}

function drawImage() {
	ctx.putImageData(image, 0, 0); // draw image on canvas
}

function downloadImage() {
	const link = document.createElement('a');
	link.download = 'image.png';
	link.href = canvas.toDataURL()
	link.click();
}

function openImage() {
	fileInput.click() // click invisible file input
}

function create() {
	const xPos = sizeInput.value.indexOf("x")
	if (xPos == -1) {
		setImageSize(16, 16)
	} else {
		const size = sizeInput.value.split("x")
		setImageSize(Number(size[0]), Number(size[1]))
	}

	start.remove()
	created = true
	setSelectedSwatch(0) // first color swatch by default
	setSelectedTool("p") // paint tool by default
	drawImage()
}

function setSelectedSwatch(index) {
	for (let i = 0; i < colorSwatches.length; i++) {
		if (i == index) { // if color swatch is the one to be selected
			colorSwatches[index].className = "swatch selected" // add selected class (selection glow)
			selectedSwatch = index // set selected swatch index variable
			picker.setColor(colorSwatches[index].style.getPropertyValue("--color")) // set picker to color of selected color swatch
			color = rgbParse(colorSwatches[index].style.getPropertyValue("--color")) // set currently used color to color of selected color swatch
		} else {
			colorSwatches[i].className = "swatch" // if not selected, make sure selection class is removed
		}
	}
}

function setSelectedTool(t) {
	if (t == "p" | t == "f") {
		selectedTool = t
		tools[{p: 0, f: 1}[t]].className = "button selected"; // selected tool has selection class
		tools[{p: 1, f: 0}[t]].className = "button"; // other tool doesn't have selection class
	}
}

function paint(e) { // paint
	const pos = getCanvasPos(e)

	setImageColor(pos, color)
	image.data[pos + 3] = 255
	
	drawImage()
}

function fill(e) { // fill
	const pos = getCanvasPosVector(e)
	const oldColor = getImageColor(getCanvasPos(e))
	const newColor = color
	dfs(pos[0], pos[1], oldColor, newColor)
	drawImage()
}


function dfs(i, j, oldColor, newColor) { // depth first search
	if (i < 0 || i >= imageSize[0] || j < 0 || j >= imageSize[1] || colorEqual(getImageColor(getPixelIndex(i, j)), oldColor) == false) {
		return
	}
	const pos = getPixelIndex(i, j)
	setImageColor(pos, newColor)
	image.data[pos + 3] = 255
	dfs(i + 1, j, oldColor, newColor)
	dfs(i - 1, j, oldColor, newColor)
	dfs(i, j + 1, oldColor, newColor)
	dfs(i, j - 1, oldColor, newColor)
}

canvas.addEventListener("mousedown", (e) => {
	mouseDown = true
	if (selectedTool == "p") { // paint
		paint(e)
	} else if (selectedTool == "f") { // fill
		fill(e)
	}
})

canvas.addEventListener("mouseup", () => {
	mouseDown = false
})

canvas.addEventListener("mousemove", (e) => {
	if (mouseDown && selectedTool == "p") { // if mouse down and paint tool is selected, paint
		paint(e)
	}
})

document.addEventListener("keydown", (e) => {
	const key = e.key
	if (created == false && key == "Enter") {
		create()
		return
	}
	if (isNumeric(key) && Number(key) < 9) { // 1-9 swatches
		setSelectedSwatch(Math.round(key) - 1)
	} else {
		switch (key) {
			case "p": // paint tool
			case "f": // fill tool
				setSelectedTool(key)
				break
			case "r": // randomize imahe
				randomizeImage()
				drawImage()
				break
			case "c": // clear image
				clearImage()
				drawImage()
			default:
				break
		}
	}
})

fileInput.addEventListener("change", (e) => {
	const reader = new FileReader()
	reader.onload = () => {
		const i = new Image()
		i.crossOrigin = "Anonymous";
		i.src = reader.result
		i.onload = () => {
			setImageSize(i.width, i.height)
			ctx.drawImage(i, 0, 0, i.width, i.height)
			image = ctx.getImageData(0, 0, i.width, i.height)
		}
	}
	reader.readAsDataURL(fileInput.files[0])
})

function isNumeric(value) {
    return /^\d+$/.test(value);
}

function rgbParse(c) { // parse rgba to number array
	return c.replace("rgba(", "").replace(")", "").split(", ").map(Number)
}

function getPixelIndex(x, y) { // get pixel index in imagedata
	return ((y * imageSize[0]) + x) * 4
}

function getCanvasPos(e) {
	const rect = canvas.getBoundingClientRect()
	const x = Math.floor((e.clientX - rect.left) / (rect.width / imageSize[0]))
	const y = Math.floor((e.clientY - rect.top) / (rect.height / imageSize[1]))
	return getPixelIndex(x, y)
}

function getCanvasPosVector(e) {
	const rect = canvas.getBoundingClientRect()
	const x = Math.floor((e.clientX - rect.left) / (rect.width / imageSize[0]))
	const y = Math.floor((e.clientY - rect.top) / (rect.height / imageSize[1]))
	return [x, y]
}

function setImageColor(pos, c) {
	image.data[pos + 0] = c[0]
	image.data[pos + 1] = c[1]
	image.data[pos + 2] = c[2]
	image.data[pos + 3] = c[3]
	//image.data[pos + 3] = 255
}

function getImageColor(pos) {
	return [
		image.data[pos + 0],
		image.data[pos + 1],
		image.data[pos + 2],
		image.data[pos + 3]
	]
}

function colorEqual(c1, c2) {
	for (let i = 0; i < 4; i++) {
		if (c1[i] != c2[i]) {
			return false
		}
	}
	return true
}