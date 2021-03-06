const webpack = require("webpack");

const packageJson = require("../package.json");

const LICENSE_HEADER =
`Plottable ${packageJson.version} (https://github.com/palantir/plottable)
Copyright 2014-2017 Palantir Technologies
Licensed under MIT (https://github.com/palantir/plottable/blob/master/LICENSE)`;

/**
 * Builds plottable.js from sources in /build/src. Requirements:
 *
 * Be ready for consumption by a script tag, or requireJS.
 * should specify d3 as an external dependency.
 *
 * Example script tag usage:
 *
 * User adds two script tags to their html page:
 *
 *   <script src="https://cdn.jsdelivr.net/npm/d3@4.5.0/build/d3.min.js"></script>
 *   <script src="https://cdn.jsdelivr.net/npm/plottable/plottable.min.js"></script>
 *
 * And then references Plottable globally.
 *
 * Example RequireJS usage:
 *
 * User configures their requireJS to point to Plottable, e.g.
 *
 * require.config( {
 *   paths: {
 *     d3: "https://cdn.jsdelivr.net/npm/d3@4.5.0/build/d3.min.js",
 *     plottable: "//cdn.jsdelivr.net/npm/plottable/plottable.min.js"
 *   },
 *   shim: {
 *     "plottable": {
 *       deps: [ "d3" ]
 *     }
 *   }
 * } );
 *
 * User calls define(["plottable"], function (Plottable) { ... })
 *
 * So there's two ideas:
 * (a) Getting the plottable.js file. This is probably from a web url.
 * (b) Referencing the Plottable object/code. This is either globally or by declaring
 *     a dependency on a module named "plottable" (both in AMD and CommonJS).
 */
module.exports = {
  devtool: "source-map",
  entry: "./src/index.ts",

  output: {
    filename: "plottable.js",
    // adds the UMD header to allow export to AMD, commonJS, or global
    libraryTarget: "umd",
    // the name of the AMD/commonJS/global
    library: "Plottable"
  },

  externals: {
    // don't bundle d3 but instead it request it externally
    "d3": "d3"
  },

  module: {
    rules: [
        {
            test: /\.tsx?$/,
            loader: require.resolve("awesome-typescript-loader"),
            options: {
                configFileName: "./tsconfig.json",
            },
        },
    ],
  },

  resolve: {
    extensions: [ ".js", ".jsx", ".ts", ".tsx", ".scss" ],
  },

  plugins: [
    new webpack.BannerPlugin({
      banner: LICENSE_HEADER,
      entryOnly: true
    }),
    new webpack.DefinePlugin({
      "__VERSION__": JSON.stringify(packageJson.version)
    })
  ]
};
