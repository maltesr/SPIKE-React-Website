const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    target: 'web',
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 4444
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        })
    ],
    module: {
        rules: [
            {
                test: /\.(tsx|tx|jsx|js)$/, //for these files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', //use this loader
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', {'runtime': 'automatic'}],
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.css$/, // for css files
                use: ['style-loader', 'css-loader'] //use css loader, then style loader (its last to first)
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    }
}