const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const config = (env, argv) => {
  const devMode = argv.mode === 'development';

  const devCssLoaders = [
    'style-loader',
     {
      loader: 'css-loader',
      options: {
        modules: true,
        localIdentName: '[local]',
        camelCase: 'only'
      } 
    }
  ];

  const prodCssLoaders = [
    MiniCssExtractPlugin.loader, 
    {
      loader: 'css-loader',
      options: {
        modules: true,
        localIdentName: '[local]--[hash:base64:5]',
        camelCase: 'only',
        importLoaders: 1
      }
    }, 
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          cssnano({ preset: 'default' }),
          autoprefixer({ browsers: ['last 2 versions', 'IE 10', 'not dead'] })
        ]
      }
    }
  ];
  
  return {
    devtool: devMode ? 'source-map' : false,
    entry: './src/js/CalculatorUI.js',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'Calculator.js',
      publicPath: '/',
      libraryTarget: 'var',
      libraryExport: 'default',
      library: 'Calculator'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: devMode ? devCssLoaders : prodCssLoaders
        }
      ]
    },
    plugins: [
      devMode ? new webpack.HotModuleReplacementPlugin() : new MiniCssExtractPlugin({ filename: 'calculator.css' })
    ],
    devServer: {
      contentBase: path.resolve(__dirname, './public'),
      port: 3000,
      historyApiFallback: true,
      inline: true,
      hot: true
    }
  }
}

module.exports = config;