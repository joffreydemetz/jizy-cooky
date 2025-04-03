// webpack.config.js
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';

const config = {
	mode: 'production', // Enable optimizations for production
	entry: './lib/index.js', // Entry point for the bundle
    node: {
        __dirname: false
    },
    output: {
		filename: 'cooky.min.js', // Output file name
		path: path.resolve('dist'), // Output directory
		library: 'Cooky', // Expose Cooky as a global variable
		libraryTarget: 'umd', // Universal Module Definition for compatibility
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()], // Minify the output
	},
	module: {
		rules: [
			{
				test: /\.js$/, // Process JavaScript files
				exclude: /node_modules/, // Exclude dependencies
				use: {
					loader: 'babel-loader', // Transpile modern JavaScript
					options: {
						// cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/babel-loader'), // Specify cache directory
						presets: ['@babel/preset-env'], // Target modern browsers
					},
				},
			},
		],
	},
};

export default config;