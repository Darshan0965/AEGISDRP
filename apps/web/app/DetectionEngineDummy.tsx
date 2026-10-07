"use client";

import { useEffect, useMemo, useState } from "react";

type DetectionRecord = {
  id: number;
  time: string;
  source: string;
  port: number;
  requests: number;
  failures: number;
  score: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "DETECTED" | "MONITORED" | "BLOCKED";
};

const API_URL = "http://127.0.0.1:8000";
const DETECTION_URL = "http://127.0.0.1:8001";

function severityStyle(severity: DetectionRecord["severity"]) {
  if (severity === "CRITICAL") {
    return {
      background: "rgba(239,68,68,0.14)",
      border: "1px solid rgba(239,68,68,0.35)",
      color: "#ff6b6b",
    };
  }

  if (severity === "HIGH") {
    return {
      background: "rgba(249,115,22,0.14)",
      border: "1px solid rgba(249,115,22,0.35)",
      color: "#fb923c",
    };
  }

  if (severity === "MEDIUM") {
    return {
      background: "rgba(234,179,8,0.14)",
      border: "1px solid rgba(234,179,8,0.35)",
      color: "#facc15",
    };
  }

  return {
    background: "rgba(34,197,94,0.14)",
    border: "1px solid rgba(34,197,94,0.35)",
    color: "#4ade80",
  };
}

function getSeverity(score: number): DetectionRecord["severity"] {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

function Card({
  title,
  value,
  subtitle,
  accent = "#38bdf8",
}: {
  title: string;
  value: string | number;
  subtitle: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg,#151b2c,#101522)",
        border: "1px solid rgba(148,163,184,0.13)",
        borderRadius: 16,
        padding: 20,
        minHeight: 120,
        boxShadow: "0 12px 35px rgba(0,0,0,0.16)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#8b98ae",
          letterSpacing: "0.08em",
          marginBottom: 14,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: accent,
          lineHeight: 1,
          marginBottom: 10,
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#748198",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: "#eef4ff",
          marginBottom: 5,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#718097",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

export default function DetectionEngineDummy() {
  const [serviceOnline, setServiceOnline] = useState(false);
  const [scanning, setScanning] = useState(false);

  const [systemId, setSystemId] = useState("3");
  const [sourceIp, setSourceIp] = useState("192.168.1.42");
  const [destinationPort, setDestinationPort] = useState("3389");
  const [requestCount, setRequestCount] = useState("180");
  const [failedRequests, setFailedRequests] = useState("100");

  const [lastScore, setLastScore] = useState(82);
  const [lastSeverity, setLastSeverity] =
    useState<DetectionRecord["severity"]>("CRITICAL");

  const [detections, setDetections] = useState<DetectionRecord[]>([
    {
      id: 1007,
      time: "Just now",
      source: "192.168.1.42",
      port: 3389,
      requests: 180,
      failures: 100,
      score: 82,
      severity: "CRITICAL",
      status: "DETECTED",
    },
    {
      id: 1006,
      time: "2 min ago",
      source: "10.20.4.18",
      port: 445,
      requests: 143,
      failures: 61,
      score: 74,
      severity: "HIGH",
      status: "BLOCKED",
    },
    {
      id: 1005,
      time: "5 min ago",
      source: "172.16.10.21",
      port: 22,
      requests: 118,
      failures: 49,
      score: 62,
      severity: "HIGH",
      status: "DETECTED",
    },
    {
      id: 1004,
      time: "8 min ago",
      source: "10.0.0.73",
      port: 443,
      requests: 96,
      failures: 29,
      score: 38,
      severity: "LOW",
      status: "MONITORED",
    },
  ]);

  const [telemetry, setTelemetry] = useState({
    packets: 18432,
    requests: 824,
    anomalies: 17,
    confidence: 94,
  });

  useEffect(() => {
    let mounted = true;

    const checkHealth = async () => {
      try {
        const response = await fetch(`${DETECTION_URL}/health`, {
          cache: "no-store",
        });

        if (mounted) {
          setServiceOnline(response.ok);
        }
      } catch {
        if (mounted) {
          setServiceOnline(false);
        }
      }
    };

    checkHealth();

    const interval = setInterval(checkHealth, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((previous) => ({
        packets: previous.packets + Math.floor(Math.random() * 180),
        requests: Math.max(
          500,
          previous.requests + Math.floor(Math.random() * 80 - 20)
        ),
        anomalies: Math.max(
          0,
          previous.anomalies + Math.floor(Math.random() * 5 - 2)
        ),
        confidence: Math.min(
          99,
          Math.max(
            88,
            previous.confidence + Math.floor(Math.random() * 5 - 2)
          )
        ),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const riskPosture = useMemo(() => {
    if (lastScore >= 80) return "CRITICAL";
    if (lastScore >= 60) return "HIGH";
    if (lastScore >= 40) return "ELEVATED";
    return "NORMAL";
  }, [lastScore]);

  const runDetection = async () => {
    setScanning(true);

    const payload = {
      system_id: Number(systemId) || 1,
      source_ip: sourceIp,
      destination_port: Number(destinationPort) || 443,
      request_count: Number(requestCount) || 0,
      failed_requests: Number(failedRequests) || 0,
    };

    try {
      const response = await fetch(`${DETECTION_URL}/detect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Detection service returned an error");
      }

      const result = await response.json();

      setServiceOnline(true);
      setLastScore(result.risk_score);
      setLastSeverity(
        String(result.severity).toUpperCase() as DetectionRecord["severity"]
      );

      const newRecord: DetectionRecord = {
        id: Date.now(),
        time: "Just now",
        source: sourceIp,
        port: Number(destinationPort),
        requests: Number(requestCount),
        failures: Number(failedRequests),
        score: result.risk_score,
        severity: String(
          result.severity
        ).toUpperCase() as DetectionRecord["severity"],
        status: result.threat_detected ? "DETECTED" : "MONITORED",
      };

      setDetections((previous) => [newRecord, ...previous].slice(0, 8));
    } catch {
      setServiceOnline(false);

      /*
       * Local fallback keeps the UI functional while the
       * detection microservice is offline.
       */
      const requests = Number(requestCount) || 0;
      const failures = Number(failedRequests) || 0;
      const port = Number(destinationPort) || 443;

      const ratio = requests > 0 ? failures / requests : 0;

      let score = 0;

      if (requests >= 100) score += 30;
      if (ratio >= 0.5) score += 40;
      else if (ratio >= 0.25) score += 20;

      if ([21, 22, 23, 445, 3389].includes(port)) {
        score += 20;
      }

      score = Math.min(score, 100);

      const severity = getSeverity(score);

      setLastScore(score);
      setLastSeverity(severity);

      const fallbackRecord: DetectionRecord = {
        id: Date.now(),
        time: "Just now",
        source: sourceIp,
        port,
        requests,
        failures,
        score,
        severity,
        status: score >= 40 ? "DETECTED" : "MONITORED",
      };

      setDetections((previous) => [
        fallbackRecord,
        ...previous,
      ].slice(0, 8));
    } finally {
      setTimeout(() => {
        setScanning(false);
      }, 700);
    }
  };

  const detectedCount = detections.filter(
    (item) => item.status === "DETECTED"
  ).length;

  const blockedCount = detections.filter(
    (item) => item.status === "BLOCKED"
  ).length;

  const criticalCount = detections.filter(
    (item) => item.severity === "CRITICAL"
  ).length;

  return (
    <div
      style={{
        width: "100%",
        color: "#e7edf7",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: "#65738a",
              letterSpacing: "0.13em",
              fontWeight: 700,
              marginBottom: 7,
            }}
          >
            AEGISDRP / DETECTION
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 850,
              color: "#f4f7fb",
            }}
          >
            Detection Engine
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#7d8aa0",
              fontSize: 13,
            }}
          >
            Autonomous threat detection, behavioral analysis and risk
            scoring.
          </p>
        </div>

        <div
          style={{
            padding: "11px 15px",
            borderRadius: 12,
            border: serviceOnline
              ? "1px solid rgba(34,197,94,.30)"
              : "1px solid rgba(239,68,68,.30)",
            background: serviceOnline
              ? "rgba(34,197,94,.08)"
              : "rgba(239,68,68,.08)",
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: serviceOnline ? "#22c55e" : "#ef4444",
              boxShadow: serviceOnline
                ? "0 0 12px rgba(34,197,94,.8)"
                : "0 0 12px rgba(239,68,68,.6)",
            }}
          />

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: serviceOnline ? "#4ade80" : "#ff6b6b",
              }}
            >
              {serviceOnline ? "ENGINE ONLINE" : "ENGINE OFFLINE"}
            </div>

            <div
              style={{
                fontSize: 10,
                color: "#69778d",
                marginTop: 2,
              }}
            >
              Detection service :8001
            </div>
          </div>
        </div>
      </div>

      {/* KPI GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(190px,1fr))",
          gap: 14,
          marginBottom: 22,
        }}
      >
        <Card
          title="RISK SCORE"
          value={lastScore}
          subtitle="Current detection risk"
          accent={
            lastScore >= 80
              ? "#ff5c68"
              : lastScore >= 60
              ? "#fb923c"
              : "#38bdf8"
          }
        />

        <Card
          title="DETECTIONS"
          value={detectedCount}
          subtitle="Threat indicators detected"
          accent="#38bdf8"
        />

        <Card
          title="CRITICAL SIGNALS"
          value={criticalCount}
          subtitle="High-priority detections"
          accent="#ff6472"
        />

        <Card
          title="BLOCKED"
          value={blockedCount}
          subtitle="Automated containment actions"
          accent="#4ade80"
        />

        <Card
          title="MODEL CONFIDENCE"
          value={`${telemetry.confidence}%`}
          subtitle="Detection confidence"
          accent="#a78bfa"
        />
      </div>

      {/* LIVE TELEMETRY */}

      <div
        style={{
          background: "linear-gradient(145deg,#141a29,#0f1420)",
          border: "1px solid rgba(148,163,184,.12)",
          borderRadius: 16,
          padding: 22,
          marginBottom: 22,
        }}
      >
        <SectionTitle
          title="Live Detection Telemetry"
          subtitle="Synthetic real-time security telemetry stream"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(160px,1fr))",
            gap: 12,
          }}
        >
          {[
            ["PACKETS ANALYZED", telemetry.packets.toLocaleString(), "packets"],
            ["REQUEST VELOCITY", telemetry.requests.toLocaleString(), "req/min"],
            ["ANOMALIES", telemetry.anomalies, "active signals"],
            ["MODEL CONFIDENCE", `${telemetry.confidence}%`, "confidence"],
          ].map(([label, value, sub]) => (
            <div
              key={label}
              style={{
                padding: 16,
                borderRadius: 12,
                background: "rgba(255,255,255,.025)",
                border: "1px solid rgba(148,163,184,.08)",
              }}
            >
              <div
                style={{
                  color: "#69778c",
                  fontSize: 10,
                  fontWeight: 800,
                  marginBottom: 9,
                }}
              >
                {label}
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#e9f1ff",
                }}
              >
                {value}
              </div>

              <div
                style={{
                  marginTop: 5,
                  fontSize: 10,
                  color: "#647289",
                }}
              >
                {sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0,1.25fr) minmax(320px,.75fr)",
          gap: 18,
          marginBottom: 22,
        }}
      >
        {/* DETECTION FORM */}

        <div
          style={{
            background: "linear-gradient(145deg,#141a29,#0f1420)",
            border: "1px solid rgba(148,163,184,.12)",
            borderRadius: 16,
            padding: 22,
          }}
        >
          <SectionTitle
            title="Threat Detection Console"
            subtitle="Submit network telemetry to the AEGISDRP detection engine"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2,minmax(0,1fr))",
              gap: 14,
            }}
          >
            {[
              {
                label: "SYSTEM ID",
                value: systemId,
                setter: setSystemId,
              },
              {
                label: "SOURCE IP",
                value: sourceIp,
                setter: setSourceIp,
              },
              {
                label: "DESTINATION PORT",
                value: destinationPort,
                setter: setDestinationPort,
              },
              {
                label: "REQUEST COUNT",
                value: requestCount,
                setter: setRequestCount,
              },
              {
                label: "FAILED REQUESTS",
                value: failedRequests,
                setter: setFailedRequests,
              },
            ].map((field) => (
              <label
                key={field.label}
                style={{
                  display: "block",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#8190a6",
                    marginBottom: 7,
                    letterSpacing: "0.06em",
                  }}
                >
                  {field.label}
                </div>

                <input
                  value={field.value}
                  onChange={(event) =>
                    field.setter(event.target.value)
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#0c111c",
                    border: "1px solid rgba(148,163,184,.13)",
                    borderRadius: 9,
                    padding: "12px 13px",
                    color: "#e7edf8",
                    outline: "none",
                    fontSize: 13,
                  }}
                />
              </label>
            ))}
          </div>

          <button
            onClick={runDetection}
            disabled={scanning}
            style={{
              marginTop: 20,
              border: "none",
              borderRadius: 10,
              padding: "12px 20px",
              background: scanning
                ? "#334155"
                : "linear-gradient(135deg,#0ea5e9,#38bdf8)",
              color: "#fff",
              fontWeight: 800,
              cursor: scanning ? "wait" : "pointer",
              boxShadow: scanning
                ? "none"
                : "0 8px 25px rgba(14,165,233,.22)",
            }}
          >
            {scanning
              ? "ANALYZING TELEMETRY..."
              : "RUN THREAT DETECTION"}
          </button>
        </div>

        {/* RISK PANEL */}

        <div
          style={{
            background: "linear-gradient(145deg,#141a29,#0f1420)",
            border: "1px solid rgba(148,163,184,.12)",
            borderRadius: 16,
            padding: 22,
          }}
        >
          <SectionTitle
            title="Detection Intelligence"
            subtitle="Current engine assessment"
          />

          <div
            style={{
              textAlign: "center",
              padding: "10px 0 22px",
            }}
          >
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: `10px solid ${
                  lastScore >= 80
                    ? "rgba(239,68,68,.25)"
                    : lastScore >= 60
                    ? "rgba(249,115,22,.25)"
                    : "rgba(56,189,248,.2)"
                }`,
                boxShadow:
                  "inset 0 0 30px rgba(0,0,0,.3)",
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 900,
                  color:
                    lastScore >= 80
                      ? "#ff6472"
                      : lastScore >= 60
                      ? "#fb923c"
                      : "#38bdf8",
                }}
              >
                {lastScore}
              </div>

              <div
                style={{
                  fontSize: 10,
                  color: "#738198",
                  fontWeight: 800,
                }}
              >
                RISK SCORE
              </div>
            </div>

            <div
              style={{
                marginTop: 15,
                fontSize: 15,
                fontWeight: 900,
                color:
                  lastSeverity === "CRITICAL"
                    ? "#ff6472"
                    : lastSeverity === "HIGH"
                    ? "#fb923c"
                    : "#facc15",
              }}
            >
              {riskPosture}
            </div>

            <div
              style={{
                color: "#66748a",
                fontSize: 11,
                marginTop: 5,
              }}
            >
              Latest engine assessment
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 9,
            }}
          >
            {[
              ["Behavioral anomaly", lastScore >= 40 ? "Detected" : "Normal"],
              ["Request velocity", lastScore >= 30 ? "Elevated" : "Normal"],
              ["Failure ratio", lastScore >= 40 ? "Suspicious" : "Normal"],
              ["Port reputation", [21,22,23,445,3389].includes(Number(destinationPort)) ? "Suspicious" : "Normal"],
            ].map(([name, value]) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "9px 0",
                  borderBottom:
                    "1px solid rgba(148,163,184,.07)",
                }}
              >
                <span
                  style={{
                    color: "#7c899e",
                    fontSize: 11,
                  }}
                >
                  {name}
                </span>

                <span
                  style={{
                    color:
                      value === "Normal"
                        ? "#4ade80"
                        : "#fb923c",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETECTION HISTORY */}

      <div
        style={{
          background: "linear-gradient(145deg,#141a29,#0f1420)",
          border: "1px solid rgba(148,163,184,.12)",
          borderRadius: 16,
          padding: 22,
        }}
      >
        <SectionTitle
          title="Detection Activity"
          subtitle="Recent threat intelligence generated by the detection engine"
        />

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 760,
            }}
          >
            <thead>
              <tr>
                {[
                  "ID",
                  "TIME",
                  "SOURCE",
                  "PORT",
                  "REQUESTS",
                  "FAILURES",
                  "RISK",
                  "SEVERITY",
                  "STATUS",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      textAlign: "left",
                      padding: "11px 10px",
                      color: "#647289",
                      fontSize: 9,
                      letterSpacing: ".07em",
                      borderBottom:
                        "1px solid rgba(148,163,184,.09)",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {detections.map((item) => {
                const style = severityStyle(item.severity);

                return (
                  <tr key={item.id}>
                    <td
                      style={{
                        padding: "13px 10px",
                        color: "#9daabd",
                        fontSize: 11,
                      }}
                    >
                      #{item.id}
                    </td>

                    <td
                      style={{
                        padding: "13px 10px",
                        color: "#748198",
                        fontSize: 11,
                      }}
                    >
                      {item.time}
                    </td>

                    <td
                      style={{
                        padding: "13px 10px",
                        color: "#dce5f4",
                        fontSize: 11,
                        fontFamily: "monospace",
                      }}
                    >
                      {item.source}
                    </td>

                    <td
                      style={{
                        padding: "13px 10px",
                        color: "#aebbd0",
                        fontSize: 11,
                      }}
                    >
                      {item.port}
                    </td>

                    <td
                      style={{
                        padding: "13px 10px",
                        color: "#aebbd0",
                        fontSize: 11,
                      }}
                    >
                      {item.requests}
                    </td>

                    <td
                      style={{
                        padding: "13px 10px",
                        color: "#ff8c8c",
                        fontSize: 11,
                      }}
                    >
                      {item.failures}
                    </td>

                    <td
                      style={{
                        padding: "13px 10px",
                        color: "#f4f7fb",
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {item.score}
                    </td>

                    <td style={{ padding: "13px 10px" }}>
                      <span
                        style={{
                          ...style,
                          padding: "5px 8px",
                          borderRadius: 6,
                          fontSize: 9,
                          fontWeight: 800,
                        }}
                      >
                        {item.severity}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "13px 10px",
                        color:
                          item.status === "BLOCKED"
                            ? "#4ade80"
                            : item.status === "DETECTED"
                            ? "#fb923c"
                            : "#7dd3fc",
                        fontSize: 10,
                        fontWeight: 800,
                      }}
                    >
                      {item.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ENGINE LOGIC */}

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(210px,1fr))",
          gap: 12,
        }}
      >
        {[
          {
            title: "Volume Analysis",
            value: "ACTIVE",
            description:
              "Monitors abnormal request and packet velocity.",
          },
          {
            title: "Failure Analysis",
            value: "ACTIVE",
            description:
              "Evaluates authentication and request failure ratios.",
          },
          {
            title: "Port Intelligence",
            value: "ACTIVE",
            description:
              "Flags commonly abused service ports.",
          },
          {
            title: "Risk Correlation",
            value: "ACTIVE",
            description:
              "Combines multiple indicators into a unified score.",
          },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              background: "rgba(255,255,255,.018)",
              border: "1px solid rgba(148,163,184,.09)",
              borderRadius: 13,
              padding: 16,
            }}
          >
            <div
              style={{
                fontWeight: 800,
                color: "#dce5f4",
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                color: "#4ade80",
                fontSize: 9,
                fontWeight: 900,
                marginBottom: 7,
              }}
            >
              ● {item.value}
            </div>

            <div
              style={{
                color: "#65738a",
                fontSize: 10,
                lineHeight: 1.5,
              }}
            >
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}