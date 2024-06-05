import { consumeToken, setSession } from "@/auth";

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    const user = await consumeToken(token, "MAGIC_LINK");

    await setSession(user, { days: 30 });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/sign-in" },
    });
  }
}
