const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require("path");

module.exports = {
    optimization: {
        minimizer: [new TerserJSPlugin({ extractComments: false }), new OptimizeCSSAssetsPlugin({})],
    },
    entry: [
        "./resources/styles/simulator.css",
        "./resources/scripts/simulator.js",
    ],
    output: {
        filename: "simulator.min.js",
        path: path.resolve(__dirname, "public/assets/js/"),
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        attributes: false,
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, {
                    loader: "css-loader",
                    options: {
                        url: false,
                    }
                }],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [{
                    loader: "file-loader",
                }],
            }
        ],
    },
    resolve: {
        extensions: [".css", ".html", ".js", ".json"]
    },
    externals: {
        "clipboard": "Clipboard",
        "jquery": "$"
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: "../css/simulator.min.css",
        }),
    ]
};
