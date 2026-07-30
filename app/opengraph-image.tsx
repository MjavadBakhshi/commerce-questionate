import { ImageResponse } from "next/og";

export const alt = "Questionate — Online Store Owner Research Survey";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)",
          color: "#0f172a",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#059669",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            Q
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, color: "#059669" }}>
            Questionate
          </span>
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 900 }}>
          Online Store Owner Research Survey
        </div>
        <div style={{ marginTop: 24, fontSize: 28, color: "#64748b", maxWidth: 820 }}>
          Help us understand the biggest challenges online business owners face.
        </div>
      </div>
    ),
    size,
  );
}
