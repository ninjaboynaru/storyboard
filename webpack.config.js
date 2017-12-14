const webpack = require('webpack');
const Uglify = require("uglifyjs-webpack-plugin"); // to get uglify to work with ES6!!!!
const path = require('path');

let devtool = 'cheap-eval-source-map';
let plugins = []
if(process.env.NODE_ENV == 'production')
{
	console.log('Webpack building for production');
	
	devtool = 'none';
	plugins.push(
		new webpack.DefinePlugin({
			'process.env':{
				'NODE_ENV': JSON.stringify('production')
			}
		})
	);

	plugins.push(
		new Uglify()
	);
}

const webpackConfig = {
	context: __dirname,
	entry: './www-js/app.jsx',
	devtool: devtool,
	output: {
		path: path.join(__dirname, '/www'),
		filename: 'bundle.js'
	},

	resolve: {
		extensions: ['.js', '.json', '.jsx']
	},

	stats: {
		colors: true,
		reasons: true,
		chunks: true
	},

	plugins: plugins,

	module: {
		rules: [
			{
				test: /\.json$/,
				loader: 'json-loader',
				exclude: '/node_modules'
			},
			{
				enforce: 'pre',
				test: /\.jsx$/,
				loader: 'eslint-loader',
				exclude: '/node_modules'
			},
			{
				loader: 'babel-loader',
				test: /\.js(x)$/,
				exclude: '/node_modules'
			}
		]
	}
};

module.exports = webpackConfig;
