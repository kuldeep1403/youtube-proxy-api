export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const q = req.query.q ?? "";
    const base = "https://suggestqueries.google.com/complete/search";
    const url = `${base}?client=youtube&ds=yt&q=${encodeURIComponent(q)}`;

    const upstream = await fetch(url);
    const body = await upstream.text();
    console.log(body);

    res.status(upstream.status);
    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") || "application/json"
    );

    res.send(body);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Upstream fetch failed" });
  }
}
