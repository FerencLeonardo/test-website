export async function GET() {
    const res = await fetch("http://localhost:8000/api/animals/", { cache: "no-store" });
    if (!res.ok) {
        return new Response("Upstream error", { status: 502 });
    }
    const data = await res.json();
    return Response.json(data);
}

export async function POST(req: Request) {
    const body = await req.json();
    const res = await fetch("http://localhost:8000/api/animals/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const text = await res.text();
    try {
        const json = JSON.parse(text);
        return new Response(JSON.stringify(json), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(text, {status: res.status});
    }
}