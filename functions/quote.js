export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const ticker = url.searchParams.get('ticker');

  if (!ticker) {
    return new Response(JSON.stringify({ error: 'Ticker não informado' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = env.BRAPI_TOKEN || '';
  
  // Copia todos os parâmetros recebidos da URL (como range e interval) e adiciona o token de forma segura
  url.searchParams.set('token', token);
  const brapiUrl = `https://brapi.dev/api/quote/${encodeURIComponent(ticker)}?${url.searchParams.toString()}`;

  try {
    const apiResponse = await fetch(brapiUrl);
    const data = await apiResponse.json();

    return new Response(JSON.stringify(data), {
      status: apiResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao consultar a API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
