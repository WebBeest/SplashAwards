/** @type { import('@storybook/server-webpack5').StorybookConfig } */
const config = {
  stories: ["../web/**/*.mdx", "../web/**/*.stories.@(json|yaml|yml)"],
  core: {
    disableTelemetry: true
  },
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-styling-webpack",
    ({
        name: "@storybook/addon-styling-webpack",

        options: {
          rules: [{
        test: /\.css$/,
        sideEffects: true,
        use: [
            require.resolve("style-loader"),
            {
                loader: require.resolve("css-loader"),
                options: {


                },
            },
        ],
      },{
        test: /\.s[ac]ss$/,
        sideEffects: true,
        use: [
            require.resolve("style-loader"),
            {
                loader: require.resolve("css-loader"),
                options: {

                    importLoaders: 2,
                },
            },
            require.resolve("resolve-url-loader"),
            {
                loader: require.resolve("sass-loader"),
                options: {
                    // Want to add more Sass options? Read more here: https://webpack.js.org/loaders/sass-loader/#options
                    implementation: require.resolve("node-sass"),
                    sourceMap: true,
                    sassOptions: {},
                },
            },
        ],
      },],
        }
    })
  ],
  framework: {
    name: "@storybook/server-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
