import { Parser } from './../wasm/pkg/grib2_wasm.js';

const ctx: Worker = self as any;
let wasm: any;
let parser: Parser;

// Listen for messages sent from the main thread
ctx.onmessage = async (event) => {
    if (event.data.request == "init") {
        await init();
        parser = wasm.Parser.new();
        self.postMessage({ response: "initComplete" });
    }
    else if (event.data.request == "loadData") {
        // First load the grib2 data from the server
        let data = await fetchData();

        // Then hand it off to the wasm code to parse it for us
        parser.parse_grib2_data(data);

        // Lastly get the parsed data and dimensions 
        let buf: Float32Array = parser.get_data();
        let width = parser.get_width();
        let height = parser.get_height();

        self.postMessage({ response: "data", data: buf, width: width, height: height });
    }
};

// Initialize the worker by importing the generated wasm code
async function init() {
    wasm = await import('./../wasm/pkg/grib2_wasm.js');
    await wasm.default();
};

// Fetch the demo data from the server
async function fetchData(): Promise<Uint8Array> {
    let filename = "HARMONIE_DINI_SF_12_5.grib";
    let response = await fetch(filename, { method: "GET" });
    if (!response.ok) {
        try {
            throw response.text();
        } catch (error) {
            console.error("%s, %s", response.status, response.statusText);
            throw new Error("Fetch failed: " + filename);
        }
    } else {
        let data = await (await response.blob()).arrayBuffer();
        return new Uint8Array(data);
    }
}
