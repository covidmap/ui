const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/bootstrap/boot.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                exclude: [
                    path.resolve(__dirname,"node_modules")
                ],
                options: {
                    presets: [
                        "@babel/preset-env",
                        "@babel/preset-typescript"
                        //"@babel/preset-react"
                    ],
                    plugins: [
                        //"babel-plugin-transform-custom-element-classes",
                        "transform-class-properties",
                        "@babel/plugin-transform-classes",
                        "@babel/plugin-proposal-export-default-from",
                        ["@babel/plugin-transform-runtime",{regenerator:true}]
                    ]
                },
            }
        ],
    },
    devServer: {
        contentBase: './dist'
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
