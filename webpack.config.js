const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { DefinePlugin } = require('webpack');

module.exports = () => [
  {
    entry: './src/index.ts',
    target: 'electron-renderer',
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/assets/template.html',
        cache: false,
      }),
    ],
  },
  {
    mode: 'development',
    entry: './src/electron.ts',
    target: 'electron-main',
    module: {
      rules: [{
        test: /\.ts$/,
        use: 'ts-loader',
      }],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'electron.js',
    },
    // plugins: [
    //   new DefinePlugin({
    //     'process.env.PRODUCTION': JSON.stringify(env.production ? 'PRODUCTION' : 'DEVELOPMENT'),
    //   }),
    // ],
  },
];
