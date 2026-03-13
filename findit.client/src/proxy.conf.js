const { env } = require('process');

const target = env.ASPNETCORE_URLS ? 
  env.ASPNETCORE_URLS.split(';')[0] : 
  'http://localhost:5167';

const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/api"
    ],
    target,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    headers: {
      'Connection': 'Keep-Alive'
    }
  }
]

module.exports = PROXY_CONFIG;
