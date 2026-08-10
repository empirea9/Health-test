const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 8000;
const ROOT = __dirname;
const ABDM_API_KEY = (process.env.ABDM_API_KEY || "").trim();
const ABDM_SEARCH_URL = "https://drugregistrysbx.abdm.gov.in/drug-registry/v1/search";

const MIME_TYPES = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
    });
    response.end(JSON.stringify(payload));
}

function searchMedicines(query, response) {
    if (!ABDM_API_KEY) {
        sendJson(response, 503, {
            code: "ABDM_API_KEY_MISSING",
            message: "Set ABDM_API_KEY before starting the server."
        });
        return;
    }

    const registryUrl = new URL(ABDM_SEARCH_URL);
    registryUrl.searchParams.set("q", query);
    registryUrl.searchParams.set("page", "0");
    registryUrl.searchParams.set("limit", "12");

    const request = https.get(registryUrl, {
        family: 4,
        headers: {
            Accept: "application/json",
            apikey: ABDM_API_KEY,
            "User-Agent": "medic.in/1.0"
        },
        timeout: 15000
    }, (registryResponse) => {
        let body = "";
        registryResponse.setEncoding("utf8");
        registryResponse.on("data", (chunk) => {
            body += chunk;
            if (body.length > 4_000_000) registryResponse.destroy();
        });
        registryResponse.on("end", () => {
            let payload;
            try {
                payload = JSON.parse(body);
            } catch {
                sendJson(response, 502, { message: "ABDM returned an unreadable response." });
                return;
            }

            if (registryResponse.statusCode < 200 || registryResponse.statusCode >= 300) {
                sendJson(response, registryResponse.statusCode, {
                    message: payload.message || payload.description || "ABDM rejected the search request."
                });
                return;
            }

            const results = Array.isArray(payload.drugDetails) ? payload.drugDetails : [];
            sendJson(response, 200, {
                results,
                total: Number(payload.drugsCount) || results.length,
                source: "ABDM Drug Registry"
            });
        });
    });

    request.on("timeout", () => request.destroy(new Error("ABDM request timed out")));
    request.on("error", () => {
        if (!response.headersSent) {
            sendJson(response, 502, { message: "Could not connect to the ABDM Drug Registry." });
        }
    });
}

function serveStatic(urlPath, response, isHeadRequest = false) {
    let pathname;
    try {
        pathname = decodeURIComponent(urlPath === "/" ? "/index.html" : urlPath);
    } catch {
        response.writeHead(400);
        response.end("Bad request");
        return;
    }

    const isPublicFile = pathname === "/index.html"
        || pathname.startsWith("/css/")
        || pathname.startsWith("/js/");
    if (!isPublicFile) {
        response.writeHead(404);
        response.end("Not found");
        return;
    }

    const filePath = path.resolve(ROOT, "." + pathname);
    if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    fs.stat(filePath, (statError, stats) => {
        if (statError || !stats.isFile()) {
            response.writeHead(404);
            response.end("Not found");
            return;
        }

        response.writeHead(200, {
            "Content-Type": MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
            "Content-Length": stats.size,
            "Cache-Control": "no-cache"
        });
        if (isHeadRequest) {
            response.end();
            return;
        }
        fs.createReadStream(filePath).pipe(response);
    });
}

const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, "http://localhost");

    if ((request.method === "GET" || request.method === "HEAD") && requestUrl.pathname === "/healthz") {
        response.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store"
        });
        response.end(request.method === "HEAD" ? undefined : JSON.stringify({ status: "ok" }));
        return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/medicines") {
        const query = (requestUrl.searchParams.get("q") || "").trim();
        if (query.length < 2 || query.length > 100) {
            sendJson(response, 400, { message: "Search terms must contain between 2 and 100 characters." });
            return;
        }
        searchMedicines(query, response);
        return;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { Allow: "GET, HEAD" });
        response.end("Method not allowed");
        return;
    }

    serveStatic(requestUrl.pathname, response, request.method === "HEAD");
});

server.listen(PORT, HOST, () => {
    console.log(`medic.in running at http://${HOST}:${PORT}`);
    if (!ABDM_API_KEY) console.log("ABDM search disabled: set ABDM_API_KEY to enable medicine results.");
});

const shutdown = () => server.close(() => process.exit(0));
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
