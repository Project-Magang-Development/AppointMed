const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "production", // Change mode based on environment
  entry: path.resolve(
    __dirname,
    "../app/embededConfig/embededScheduleReact.tsx"
  ), // Ensure the correct entry path
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "scheduler.js",
    library: "Scheduler",
    libraryTarget: "umd",
    umdNamedDefine: true,
    globalObject: 'typeof self !== "undefined" ? self : this',
  },
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React",
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "react-dom",
      root: "ReactDOM",
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
          "ts-loader",
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    fallback: {
      path: require.resolve("path-browserify"),
      util: require.resolve("util/"),
    },
  },
};
