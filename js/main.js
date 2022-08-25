const theme = new Theme()

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let canvasSize = 8;
let image = ctx.createImageData(canvasSize, canvasSize)

const picker = new Pickr({
	el: "#picker",
	container: "#top",
	theme: "nano",
	components: {
		preview: true,
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

for (let i = 0; i < colorSwatches.length; i++) {
	colorSwatches[i].addEventListener("click", () => {
		setSelectedSwatch(i)
	})
}

picker.on("change", (c) => {
	const color = c.toRGBA()
	const r = Math.round(color[0])
	const g = Math.round(color[0])
	const b = Math.round(color[0])
})

theme.install()
theme.start()
setPixelSize(8)
setSelectedSwatch(0)
randomizeImage()
draw()

function setPixelSize(s) {
	canvasSize = s
	canvas.width = s
	canvas.height = s
	image = ctx.createImageData(s, s)
}

function randomizeImage() {
	for (let i = 0; i < image.data.length; i += 4) {
		image.data[i + 0] = Math.round(Math.random() * 255)
		image.data[i + 1] = Math.round(Math.random() * 255)
		image.data[i + 2] = Math.round(Math.random() * 255)
		image.data[i + 3] = Math.round(Math.random() * 255)
	}
}

function draw() {
	ctx.putImageData(image, 0, 0);
}

function setSelectedSwatch(index) {
	for (let i = 0; i < colorSwatches.length; i++) {
		colorSwatches[i].className = "swatch"
	}

	colorSwatches[index].className = "swatch selected"
	selectedSwatch = index
}

canvas.addEventListener("click", () => {
	randomizeImage()
	theme.open()
	draw()
})

document.onkeydown = (e) => {
	const key = Number(e.key)
	console.log(key)
	if (isNumeric(key) && key < 9) {
		setSelectedSwatch(Math.round(key) - 1)
	}
}

function isNumeric(value) {
    return /^\d+$/.test(value);
}