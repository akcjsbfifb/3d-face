import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

const app = new Hono();

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(4000),
});

const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3000";
const port = Number(process.env.PORT ?? 4000);

app.use(
  "*",
  cors({
    origin: webOrigin,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/health", (c) =>
  c.json({
    ok: true,
    service: "portfolio-api",
    time: new Date().toISOString(),
  }),
);

app.get("/", (c) =>
  c.json({
    name: "@portfolio/api",
    endpoints: ["/health", "POST /contact"],
  }),
);

app.post("/contact", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      { ok: false, error: "Invalid payload", issues: parsed.error.issues },
      400,
    );
  }

  // Placeholder: log and acknowledge. Wire to email/CRM later.
  console.log("[contact]", {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return c.json({ ok: true });
});

serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, (info) => {
  console.log(`API listening on http://0.0.0.0:${info.port}`);
});
