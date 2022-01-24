const qr = require('qr-image')


const generate = async request => {
  const { vpa, name, amount, remarks } = await request.json()
  if (vpa === '') {
    return new Response(JSON.stringify({ error: `vpa cannot be empty` }), {
      headers: {
        "content-type": "application/json;charset=UTF-8", 'Access-Control-Allow-Origin': '*'
      }
    })
  }
  if (name === '') {
    return new Response(JSON.stringify({ error: `name cannot be empty` }), {
      headers: {
        "content-type": "application/json;charset=UTF-8", 'Access-Control-Allow-Origin': '*'
      }
    })
  }
  if (amount === '') {
    return new Response(JSON.stringify({ error: `amount cannot be empty` }), {
      headers: {
        "content-type": "application/json;charset=UTF-8", 'Access-Control-Allow-Origin': '*'
      }
    })
  }
  if (amount > 100000) {
    return new Response(JSON.stringify({ error: `maximum amount exceeded` }), {
      headers: {
        "content-type": "application/json;charset=UTF-8", 'Access-Control-Allow-Origin': '*'
      }
    })
  }
  if (remarks.length > 50) {
    return new Response(JSON.stringify({ error: `character limit for remarks is 50` }), {
      headers: {
        "content-type": "application/json;charset=UTF-8", 'Access-Control-Allow-Origin': '*',
      }
    })
  }
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'image/png' }
  const url = `upi://pay?pa=${vpa}&pn=${name}&am=${amount}&tn=${remarks}`
  const qr_png = qr.imageSync(url)
  return new Response(qr_png, { headers })
}

let landing = `<h1>404</h1>`


async function handleRequest(request) {
  const origin = request.headers.get('Origin');

  if (request.method === 'OPTIONS') {

    // Make sure the necesssary headers are present for this to be a
    // valid pre-flight request
    if (request.headers.get('Origin') !== null &&
      request.headers.get('Access-Control-Request-Method') !== null &&
      request.headers.get('Access-Control-Request-Headers') !== null) {
      // Handle CORS pre-flight request.
      // If you want to check the requested method + headers
      // you can do that here.

      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }
    else {
      // Handle standard OPTIONS request.
      return new Response(null, {
        headers: {
          Allow: 'GET, HEAD, OPTIONS',
        },
      })
    }
  }


  if (request.method === 'POST') {
    return response = await generate(request)
  } else {
    return response = new Response(landing, { 'Access-Control-Allow-Origin': '*', status: 404 })
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
}) 