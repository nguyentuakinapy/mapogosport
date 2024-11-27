export const dynamic = 'force-static'

export async function POST(request: Request) {
  const res = await request.json();
  const sessionDataAuth = res;

  // Log giá trị sessionDataAuth
  console.log('sessionDataAuth:', sessionDataAuth);

  if (!sessionDataAuth) {
    return new Response(
      JSON.stringify({
        message: "Invalid session data",
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ res }),
    {
      status: 200,
      headers: {
        'Set-Cookie': `sessionDataAuth=${encodeURIComponent(JSON.stringify(sessionDataAuth))}; Path=/; HttpOnly;`,
        'Content-Type': 'application/json',
      },
    }
  );
  
}


