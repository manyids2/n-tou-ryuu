#!/usr/bin/env node

import esbuildServe from "esbuild-serve";

esbuildServe(
  {
    logLevel: "info",
    entryPoints: ["src/app.js"],
    bundle: true,
    outfile: "site/js/app.js",
  },
  { root: "./" }
);
