const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './index.js', // Entry point for your JavaScript
    output: {
        filename: 'bundle.js', // Name of the bundled JavaScript file
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html', // Use your HTML file as a template
            inject: 'body', // Inject the script into the body of the HTML file
        }),
    ],
};
