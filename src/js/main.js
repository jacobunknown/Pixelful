const theme = new Theme()

const canvas = document.getElementById("imageCanvas")
const ctx = canvas.getContext("2d")
const tools = document.getElementsByName("tool")

let imageSize;
let image;

let color = [255, 255, 255]
let selectedTool;

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
let selectedSwatch;
let mouseDown = false;

for (let i = 0; i < colorSwatches.length; i++) {
	colorSwatches[i].addEventListener("click", () => {
		setSelectedSwatch(i)
	})
	colorSwatches[i].style.setProperty("--color", `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`)
}

picker.on("change", (c) => {
	colorSwatches[selectedSwatch].style.setProperty("--color", c.toRGBA())
	color = c.toRGBA()
})

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

function clearImage() {
	for (let i = 0; i < image.data.length; i += 4) {
		const b = 255;
		image.data[i + 0] = b
		image.data[i + 1] = b
		image.data[i + 2] = b
		image.data[i + 3] = 0
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
			picker.setColor(colorSwatches[index].style.getPropertyValue("--color"))
			color = rgbParse(colorSwatches[index].style.getPropertyValue("--color"))
		} else {
			colorSwatches[i].className = "swatch"
		}
	}
}

function setSelectedTool(t) {
	if (t == "p" | t == "f") {
		selectedTool = t
		tools[{p: 0, f: 1}[t]].className = "button selected";
		tools[{p: 1, f: 0}[t]].className = "button";
	}
}

theme.install()
theme.start()
setImageSize(16)
setSelectedSwatch(0)
setSelectedTool("p")
//randomizeImage()
//clearImage()
drawImage()

canvas.addEventListener("mousedown", (e) => {
	mouseDown = true
	if (selectedTool == "p") {
		draw(e)
	} else if (selectedTool == "f") {
		console.log("fill")
	}
})

canvas.addEventListener("mouseup", () => {
	mouseDown = false
})

function draw(e) {
	const rect = canvas.getBoundingClientRect()
	const x = Math.floor((e.clientX - rect.left) / (rect.width / imageSize))
	const y = Math.floor((e.clientY - rect.top) / (rect.height / imageSize))
	const pos = getPixelIndex(x, y)

	image.data[pos + 0] = color[0]
	image.data[pos + 1] = color[1]
	image.data[pos + 2] = color[2]

	drawImage()
}

canvas.addEventListener("mousemove", (e) => {
	if (mouseDown && selectedTool == "p") {
		draw(e)
	}
})

document.addEventListener("keydown", (e) => {
	const key = e.key
	if (isNumeric(key) && Number(key) < 9) {
		setSelectedSwatch(Math.round(key) - 1)
	} else if (key == "p" | key == "f") {
		setSelectedTool(key)
	}
})

function isNumeric(value) {
    return /^\d+$/.test(value);
}

function rgbParse(c) {
	return c.replace("rgb(", "").replace(")", "").split(", ")
}

function getPixelIndex(x, y) {
	return ((y * imageSize) + x) * 4
}