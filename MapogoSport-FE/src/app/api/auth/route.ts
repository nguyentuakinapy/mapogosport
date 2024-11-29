export const dynamic = 'force-static';

export async function POST(request: Request) {
  const res = await request.json();
  const sessionDataAuth = res;

  // Kiểm tra xem sessionDataAuth có hợp lệ không
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

  // Thiết lập cookie với Max-Age (thời gian sống) để duy trì
  const cookie = `sessionDataAuth=${encodeURIComponent(
    JSON.stringify(sessionDataAuth)
  )}; Path=/; HttpOnly; Max-Age=604800 ;`; // 86400 giây = 1 ngày

  return new Response(
    JSON.stringify({ res }),
    {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json',
      },
    }
  );
}
