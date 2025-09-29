// next.config.js
module.exports = {
  async rewrites() {
    return [
      // handle the root
      // { source: '/', destination: '/ro' },

      // match anything that does NOT start with ro or ru
      // and capture it as :path
      { source: '/:path((?!ro|ru).*)', destination: '/ro/:path' },
    ]
  },
}
