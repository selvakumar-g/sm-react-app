const webpack = require('webpack');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_DIR = path.join(__dirname, 'dist')
const APP_DIR = path.join(__dirname, 'src')

const VENDOR_LIBS = [
    "axios", "bootstrap", "chart.js", "moment", "prop-types",
    "react", "react-bootstrap-table", "react-chartjs-2", "react-day-picker",
    "react-dom", "react-modal", "react-router-dom", "react-select"
]

const buildConfig = {
    devtool: 'cheap-module-source-map',
    entry: APP_DIR + '/index.js',
    // entry: {
    // bundle: APP_DIR + '/index.js',
    //vendor: VENDOR_LIBS
    //},
    output: {
        path: BUILD_DIR,
        // filename: '[name].[hash].js',
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: 'file-loader'
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: APP_DIR + '/index.html',
        }),
        //new webpack.optimize.CommonsChunkPlugin({
        // names: ['vendor', 'manifest']
        //}),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        })//,
        //new webpack.optimize.UglifyJsPlugin(),
        // new BundleAnalyzerPlugin()
    ]
}


module.exports = buildConfig;