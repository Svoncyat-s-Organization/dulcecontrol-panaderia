const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const body = event.body;
    // forward headers and body to backend
    const backendRes = await fetch('http://pasteleria.spring.informaticapp.com:2250/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      redirect: 'follow'
    });

    const text = await backendRes.text();
    return {
      statusCode: backendRes.status,
      headers: { 'Content-Type': backendRes.headers.get('content-type') || 'text/plain' },
      body: text
    };
  } catch (err) {
    return { statusCode: 500, body: String(err) };
  }
};
