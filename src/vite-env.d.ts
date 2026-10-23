/// <reference types="vite/client" />

// vite/client declares the wildcard modules (*.css, *.svg, ...) that this app
// imports for their side effects. TypeScript 6 enables
// noUncheckedSideEffectImports by default, so without these declarations
// `import "./style.css"` fails with TS2882.
