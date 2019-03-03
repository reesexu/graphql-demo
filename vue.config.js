const isProduction = process.env.NODE_ENV === 'production'
const CDN_URL = 'graphql'
module.exports = {
  baseUrl: isProduction ? CDN_URL : '/'
}