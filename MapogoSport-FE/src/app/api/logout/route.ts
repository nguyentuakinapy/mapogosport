
export async function DELETE() {
    return new Response(
        JSON.stringify({ message: "Logged out successfully" }),
        {
            status: 200,
            headers: {
                'Set-Cookie': `sessionDataAuth=; Path=/; HttpOnly; Max-Age=0;`,
                'Content-Type': 'application/json',
            },
        }
    );
  }