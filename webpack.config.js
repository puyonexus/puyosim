const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");

module.exports = {
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
                    loader: 'html-loader',
                    options: {
                        attrs: false,
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: {
                        loader: "css-loader",
                        options: {
                            minimize: true,
                            url: false,
                        }
                    }
                })
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
        new ExtractTextPlugin("../css/simulator.css"),
    ]
};