import { NextRequest, NextResponse } from "next/server";

// Secure Proxy Route to GetBlock.io
// The GetBlock access token is injected server-side and never exposed
// to client-side JavaScript or browser network logs.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const localRpcUrl = process.env.ZCASH_RPC_URL;
  const localRpcUser = process.env.ZCASH_RPC_USER;
  const localRpcPass = process.env.ZCASH_RPC_PASS;
  const token = process.env.GETBLOCK_ZCASH_TOKEN;

  const isLocal = !!localRpcUrl;
  let targetUrl = "";
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (isLocal) {
    targetUrl = localRpcUrl;
    if (localRpcUser && localRpcPass) {
      const auth = Buffer.from(`${localRpcUser}:${localRpcPass}`).toString("base64");
      headers["Authorization"] = `Basic ${auth}`;
    }
  } else {
    if (!token || token === "your_getblock_access_token_here") {
      return NextResponse.json(
        {
          error:
            "Server misconfiguration: Neither ZCASH_RPC_URL nor GETBLOCK_ZCASH_TOKEN is set. Please configure one in your environment.",
        },
        { status: 500 }
      );
    }
    targetUrl = `https://go.getblock.io/${token}/`;
  }

  let body: { method?: string; params?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  const { method, params } = body;

  if (!method || typeof method !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'method' field." },
      { status: 400 }
    );
  }

  const rpcPayload = {
    jsonrpc: "2.0",
    method,
    params: Array.isArray(params) ? params : [],
    id: "zcash-playground",
  };

  try {
    const upstream = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(rpcPayload),
      cache: "no-store",
    });

    const text = await upstream.text();

    // Rate-limit handling
    if (upstream.status === 429) {
      return NextResponse.json(
        {
          error:
            "Rate limit encountered. Please slow down and try again shortly.",
        },
        { status: 429 }
      );
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          error: `Upstream returned non-JSON response (status ${upstream.status}).`,
          raw: text.slice(0, 500),
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      status: upstream.status,
      headers: {
        "x-zcash-node-provider": isLocal ? "Local Node" : "GetBlock.io Node",
        "x-zcash-target-url": isLocal ? targetUrl : "https://go.getblock.io/...",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to reach Zcash node at ${targetUrl}: ${message}` },
      { status: 502 }
    );
  }
}
