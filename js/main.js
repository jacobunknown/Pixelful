const theme = new Theme()

const canvas = document.getElementById("imageCanvas")
const ctx = canvas.getContext("2d")

const gridCanvas = document.getElementById("gridCanvas")
const gridCtx = gridCanvas.getContext("2d")

let imageSize = 8;
let image = ctx.createImageData(imageSize, imageSize)

let color = [255, 255, 255]

const picker = new Pickr({
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

const colorSwatches = document.getElementsByClassName("swatch")
let selectedSwatch = 0;
let mouseDown = false;

for (let i = 0; i < colorSwatches.length; i++) {
	colorSwatches[i].addEventListener("click", () => {
		setSelectedSwatch(i)
	})
	colorSwatches[i].style.background = `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`
}

picker.on("change", (c) => {
	colorSwatches[selectedSwatch].style.background = picker.getColor()
	console.log(colorSwatches[selectedSwatch].style.background)
})

theme.install()
theme.start()
setImageSize(8)
setSelectedSwatch(0)
randomizeImage()
drawImage()

function setImageSize(s) {
	imageSize = s
	canvas.width = s
	canvas.height = s
	image = ctx.createImageData(s, s)
}

function randomizeImage() {
	for (let i = 0; i < image.data.length; i += 4) {
		image.data[i + 0] = Math.round(Math.random() * 255)
		image.data[i + 1] = Math.round(Math.random() * 255)
		image.data[i + 2] = Math.round(Math.random() * 255)
		image.data[i + 3] = 255
	}
}

function drawImage() {
	ctx.putImageData(image, 0, 0);
}

function downloadImage() {
	const link = document.createElement('a');
	link.download = 'image.png';
	link.href = canvas.toDataURL()
	link.click();
}

function setSelectedSwatch(index) {
	for (let i = 0; i < colorSwatches.length; i++) {
		if (i == index) {
			colorSwatches[index].className = "swatch selected"
			selectedSwatch = index
			picker.setColor(colorSwatches[index].style.background)
			color = rgbParse(colorSwatches[index].style.background)
		} else {
			colorSwatches[i].className = "swatch"
		}
	}
}

canvas.addEventListener("mousedown", (e) => {
	mouseDown = true
	draw(e)
})

canvas.addEventListener("mouseup", () => {
	mouseDown = false
})

function draw(e) {
	const rect = canvas.getBoundingClientRect()
	const x = Math.floor((e.clientX - rect.left) / (rect.width / imageSize))
	const y = Math.floor((e.clientY - rect.top) / (rect.height / imageSize))
	const pos = ((y * imageSize) + x) * 4

	image.data[pos + 0] = color[0]
	image.data[pos + 1] = color[1]
	image.data[pos + 2] = color[2]

	drawImage()
}

canvas.addEventListener("mousemove", (e) => {
	if (mouseDown) {
		draw(e)
	}
})

document.addEventListener("keydown", (e) => {
	const key = Number(e.key)
	if (isNumeric(key) && key < 9) {
		setSelectedSwatch(Math.round(key) - 1)
	}
})

function isNumeric(value) {
    return /^\d+$/.test(value);
}

function rgbParse(c) {
	return c.replace("rgb(", "").replace(")", "").split(", ")
}