/**
 * @fileoverview Snowpack configuration file.
 */

/**
 * @type {import('snowpack').SnowpackUserConfig}
 */
module.exports = exports = {
  mount: {
    public: '/',
    src: '/dist'
  },
  buildOptions: {
    out: 'dist'
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv'
  ]
}
