"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#0b0b0f",
          color: "#ececf1",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ opacity: 0.6, fontSize: 12, letterSpacing: "0.16em" }}>
            ERROR
          </p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 500 }}>
            Algo salió mal
          </h1>
          <p style={{ opacity: 0.55, maxWidth: 420, margin: "0.75rem auto" }}>
            {error.message || "Error inesperado"}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.25rem",
              padding: "0.65rem 1.25rem",
              border: "1px solid rgba(236,236,241,0.2)",
              background: "transparent",
              color: "#ececf1",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
