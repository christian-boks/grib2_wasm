# Grib2 Wasm Example

Small example to view a grib2 file decoded using a Rust web assembly module.

To get the source code displayed in chrome debugger:

1. `cargo build --target wasm32-unknown-unknown`
1. `wasm-bindgen ./target/wasm32-unknown-unknown/debug/grib2_wasm.wasm --keep-debug --debug --target web --out-dir ./pkg`

The magic argument here is `--keep-debug` that instructs wasm-bindgen to keep the DWARF symbols in the output wasm file.


