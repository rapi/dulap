const withImages = require("next-images");
const withNextCircularDeps = require("next-circular-dependency");
module.exports = withImages({
  output: "export",
  // webpack: (config, { isServer }) => {
  //     config.externals = ["webpack", "readable-stream", "d3-interpolate", "next"]
  //     return config
  // }
});
