# Grib2 Wasm Example

Minimal example to view a grib2 file decoded using a Rust WebAssembly module.

## Build Instructions

Go to the `wasm` folder and run the following commands:

* `wasm-pack build --debug --target web --out-dir ./pkg`

Then in the root folder run `npm install` first and then `npm run start` to serve the code on http://localhost:9000

Example Grib data from the Danish Meteorological Institute - License CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
