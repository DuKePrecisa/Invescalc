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

  // Pega o token seguro armazenado nas variáveis de ambiente do Cloudflare
  const token = env.BRAPI_TOKEN || '';
  
  // Monta a URL de chamada para a Brapi com o token embutido no servidor
  const brapiUrl = `https://brapi.dev/api/quote/${encodeURIComponent(ticker)}?token=${token}`;

  try {
    const apiResponse = await fetch(brapiUrl);
    const data = await apiResponse.json();

    return new Response(JSON.stringify(data), {
      status: apiResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Permite o acesso do próprio site
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao consultar a API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
