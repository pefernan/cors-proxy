'use strict'
const url = require('url')
const pkg = require('./package.json')
const {send} = require('micro')
const origin = process.env.ALLOW_ORIGIN
const insecure_origins = (process.env.INSECURE_HTTP_ORIGINS || '').split(',')
const middleware = require('./middleware.js')({ origin, insecure_origins })

async function service (req, res) {
  middleware(req, res, () => {
    let u = url.parse(req.url, true)

    if (u.pathname === '/ping') {
      res.setHeader('content-type', 'text/plain')
      return send(res, 200, "pong")
    }

    if (u.pathname === '/') {
      res.setHeader('content-type', 'text/html')
      let html = `<!DOCTYPE html>
      <html>
        <title>@pefernan/cors-proxy</title>
        <h1>@pefernan/cors-proxy (forked from @isopmorphic-git/cors-proxy)</h1>
        <p>This is the server software for users of <a href="https://isomorphic-git.org">isomorphic-git</a> that enables cloning and pushing repos in the browser.</p>
        <p>The source code is hosted on Github at <a href="https://github.com/pefernan/cors-proxy">https://github.com/pefernan/cors-proxy</a></p>
        <p>It can also be installed from npm with <code>npm install <a href="https://npmjs.org/package/${pkg.name}">@pefernan/cors-proxy</a></code></p>

        <h2>Terms of Use</h2>
        <p><b>This free service is provided to you AS IS with no guarantees.
        By using this free service, you promise not to use excessive amounts of bandwidth.
        </b></p>

        <p><b>If you are cloning or pushing large amounts of data your IP address may be banned.
        Please run your own instance of the software if you need to make heavy use this service.</b></p>

        <h2>Allowed Origins</h2>
        This proxy allows git clone / fetch / push / getRemoteInfo requests from these domains: <code>${process.env.ALLOW_ORIGIN || '*'}</code>
      </html>
      `
      return send(res, 400, html)
    }

    // Don't waste my precious bandwidth
    return send(res, 403, '')
  })
}

module.exports = service
