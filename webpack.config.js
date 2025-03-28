const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist')
		},
		compress: true,
		port: 8080,
		hot: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Alien Outlaws: The Cosmic Stampede',
			template: './src/index.html'
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: 'assets', to: 'assets' }]
		})
	]
};
