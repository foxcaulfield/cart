import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
// import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

import "webpack-dev-server";

const config: webpack.Configuration = {
	devtool: false,
	performance: {
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
		hints: false
	},
	mode: "production",
	entry: "./src/ts/main.ts",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].bundle.js"
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					"sass-loader"
				]
			}
		]
	},
	plugins: [
		new CompressionPlugin(),
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: path.join(__dirname, "src", "favicon.ico"), to: path.join(__dirname, "dist", "favicon.ico") }]
		})
	],
	devServer: {
		static: {
			directory: path.join(__dirname, "dist")
		},
		compress: true,
		port: 9000,
		hot: true
	},

	optimization: {
		splitChunks: {
			chunks: "async",
			minSize: 20000,
			maxSize: 200000,
			minRemainingSize: 0,
			minChunks: 1,
			maxAsyncRequests: 30,
			maxInitialRequests: 30,
			enforceSizeThreshold: 50000,
			cacheGroups: {
				defaultVendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					reuseExistingChunk: true
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		}
	}
};

export default config;
