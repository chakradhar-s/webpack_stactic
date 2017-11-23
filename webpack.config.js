var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const autoprefixer = require('autoprefixer');
const precss = require('precss');

module.exports = {
	context: path.resolve('./app'),
	entry: './js/index.js',
	output: {
		path: path.resolve('./dist/'),
		filename: 'js/bundle.js',
		publicPath: '/'
	},
	module: {	
        rules: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
					presets: ['es2015']
                },
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
            {
                test: /\.(scss|css)?$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader', // translates CSS into CommonJS modules
                        }, 
                        {
                            loader: 'postcss-loader', // Run post css actions
                            options: {
                                plugins() {
                                    // post css plugins, can be exported to postcss.config.js
                                    return [
                                        precss,
                                        autoprefixer
                                    ];
                                }
                            }
                        },
						 {
                            loader: 'sass-loader' // compiles SASS to CSS
                        }
                    ]
                })
            },           
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]',
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                use: 'file-loader',
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?name=images/[name].[ext]',
                    'image-webpack-loader?bypassOnDebug'
                ]
            }            
        ]
    },
	resolve: {
        extensions: ['.js'],
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),        
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'           
		}),
		new CopyWebpackPlugin([{
			from: './manifest.json'
		},{
			from: './manifest.webapp'
		},{
			from: './robots.txt'
		},{
			from: './favicon.ico'
		},{
			from: './img/**/*',
			to: './'
		}]),
		new HtmlWebpackPlugin({
			template: './index.html'
		}),
		new ExtractTextPlugin("style.css")
    ],

}
