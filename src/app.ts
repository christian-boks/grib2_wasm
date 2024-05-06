import { colors } from "./colors";

export class App {
    worker: Worker;

    constructor() {
        this.worker = new Worker(new URL('./wasm.worker.ts', import.meta.url), { type: "module" });
        this.worker.addEventListener("message", (data) => this.handleWorkerMessage(data));
    }

    start() {
        console.log("Page loaded");
        this.worker.postMessage({ request: "init" });
    }

    async workerInitComplete() {
        this.worker.postMessage({ request: "loadData" });
    }

    displayImage(img: ImageData, width: number, height: number) {
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        if (canvas) {
            canvas.width = width;
            canvas.height = height;

            let ctx = canvas.getContext("2d");
            ctx.putImageData(img, 0, 0);
        }
    }

    convertImageTo32Bit(imageData: Float32Array, width: number, height: number) {
        const arrayBuffer = new ArrayBuffer(width * height * 4);
        const pixels = new Uint8ClampedArray(arrayBuffer);
        let idx = 0;

        let max = -1e10;
        let min = 1e10;
        imageData.forEach((value: number) => {
            max = value > max ? value : max;
            min = value < min ? value : min;
        });

        let colorLength = (colors.length) / 3 - 1;
        let offset = -min;
        let scale = colorLength / (max - min);

        for (let y = height - 1; y > 0; y--) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                let p = Math.round((imageData[idx++] + offset) * scale);
                pixels[i] = colors[p * 3];
                pixels[i + 1] = colors[p * 3 + 1];
                pixels[i + 2] = colors[p * 3 + 2];
                pixels[i + 3] = 255;
            }
        }

        return new ImageData(pixels, width, height);
    }

    async handleWorkerMessage({ data }: any) {
        console.log("Got message from worker", data);
        if (data && data.response == "initComplete") {
            this.workerInitComplete();
        } else if (data && data.response == "data") {
            let imageData = this.convertImageTo32Bit(data.data, data.width, data.height);
            this.displayImage(imageData, data.width, data.height);
        }
    }
}

