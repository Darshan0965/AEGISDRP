"use client";

import { useEffect, useState } from "react";

type ThreatData = {
  activeThreats: number;
  highSeverity: number;
  riskScore: number;
  detectionStatus: string;
  threats: {
    id: number;
    type: string;
    source: string;
    severity: string;
  }[];
};

const dummyData: ThreatData[] = [
  {
    activeThreats: 4,
    highSeverity: 2,
    riskScore: 72,
    detectionStatus: "ONLINE",
    threats: [
      {
        id: 1,
        type: "Brute Force Attack",
        source: "192.168.1.45",
        severity: "HIGH",
      },
      {
        id: 2,
        type: "Suspicious Network Scan",
        source: "10.10.24.17",
        severity: "HIGH",
      },
      {
        id: 3,
        type: "Abnormal Login Activity",
        source: "172.16.0.22",
        severity: "MEDIUM",
      },
      {
        id: 4,
        type: "Unusual Traffic Pattern",
        source: "192.168.1.88",
        severity: "LOW",
      },
    ],
  },

  {
    activeThreats: 7,
    highSeverity: 3,
    riskScore: 86,
    detectionStatus: "ONLINE",
    threats: [
      {
        id: 5,
        type: "DDoS Traffic Detected",
        source: "45.83.21.19",
        severity: "HIGH",
      },
      {
        id: 6,
        type: "Port Scanning Activity",
        source: "103.42.88.12",
        severity: "HIGH",
      },
      {
        id: 7,
        type: "Credential Attack",
        source: "185.22.91.42",
        severity: "HIGH",
      },
      {
        id: 8,
        type: "Suspicious API Requests",
        source: "10.0.0.44",
        severity: "MEDIUM",
      },
      {
        id: 9,
        type: "Abnormal DNS Query",
        source: "192.168.0.91",
        severity: "MEDIUM",
      },
    ],
  },

  {
    activeThreats: 2,
    highSeverity: 1,
    riskScore: 48,
    detectionStatus: "ONLINE",
    threats: [
      {
        id: 10,
        type: "Unauthorized Access Attempt",
        source: "172.20.10.14",
        severity: "HIGH",
      },
      {
        id: 11,
        type: "Suspicious File Activity",
        source: "192.168.1.76",
        severity: "MEDIUM",
      },
    ],
  },

  {
    activeThreats: 0,
    highSeverity: 0,
    riskScore: 0,
    detectionStatus: "OFFLINE",
    threats: [],
  },
];

export default function ThreatMonitoringDummy() {
  const [dataIndex, setDataIndex] = useState(0);
  const [threatData, setThreatData] = useState(dummyData[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataIndex((previous) => {
        const next =
          (previous + 1) % dummyData.length;

        setThreatData(dummyData[next]);

        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const riskColor =
    threatData.riskScore >= 70
      ? "#ef4444"
      : threatData.riskScore >= 40
      ? "#eab308"
      : "#22c55e";

  return (
    <section
      style={{
        width: "100%",
        minHeight: "500px",
        padding: "20px",
        color: "#ffffff",
      }}
    >

      {/* ================================
          TOP STAT CARDS
      ================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "14px",
          marginBottom: "18px",
        }}
      >

        {/* Active Threats */}

        <div style={cardStyle}>
          <div style={cardHeader}>
            <span>Active Threats</span>

            <div
              style={{
                ...iconStyle,
                background:
                  "rgba(239,68,68,0.15)",
                color: "#ef4444",
              }}
            >
              !
            </div>
          </div>

          <strong
            style={{
              ...numberStyle,
              color: "#ff315f",
            }}
          >
            {threatData.activeThreats}
          </strong>

          <small style={descriptionStyle}>
            Threats requiring response
          </small>
        </div>

        {/* High Severity */}

        <div style={cardStyle}>
          <div style={cardHeader}>
            <span>High Severity</span>

            <div
              style={{
                ...iconStyle,
                background:
                  "rgba(239,68,68,0.15)",
                color: "#ef4444",
              }}
            >
              ⚠
            </div>
          </div>

          <strong
            style={{
              ...numberStyle,
              color: "#ff315f",
            }}
          >
            {threatData.highSeverity}
          </strong>

          <small style={descriptionStyle}>
            High priority detections
          </small>
        </div>

        {/* Risk Score */}

        <div style={cardStyle}>
          <div style={cardHeader}>
            <span>Risk Score</span>

            <div
              style={{
                ...iconStyle,
                background:
                  "rgba(234,179,8,0.15)",
                color: "#eab308",
              }}
            >
              ◐
            </div>
          </div>

          <strong
            style={{
              ...numberStyle,
              color: riskColor,
            }}
          >
            {threatData.riskScore}
          </strong>

          <small style={descriptionStyle}>
            Current calculated risk
          </small>
        </div>

        {/* Detection Engine */}

        <div style={cardStyle}>
          <div style={cardHeader}>
            <span>Detection Engine</span>

            <div
              style={{
                ...iconStyle,
                background:
                  threatData.detectionStatus ===
                  "ONLINE"
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(239,68,68,0.15)",
                color:
                  threatData.detectionStatus ===
                  "ONLINE"
                    ? "#22c55e"
                    : "#ef4444",
              }}
            >
              ✓
            </div>
          </div>

          <strong
            style={{
              ...numberStyle,
              fontSize: "30px",
              color:
                threatData.detectionStatus ===
                "ONLINE"
                  ? "#39ff88"
                  : "#ff315f",
            }}
          >
            {threatData.detectionStatus}
          </strong>

          <small style={descriptionStyle}>
            Automated detection service
          </small>
        </div>
      </div>


      {/* ================================
          LIVE THREAT FEED
      ================================= */}

      <div
        style={{
          background:
            "rgba(17,24,39,0.82)",
          border:
            "1px solid rgba(148,163,184,0.16)",
          borderRadius: "14px",
          minHeight: "310px",
          overflow: "hidden",
        }}
      >

        {/* Header */}

        <div
          style={{
            padding: "18px 20px",
            borderBottom:
              "1px solid rgba(148,163,184,0.12)",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "16px",
              }}
            >
              Live Threat Feed
            </h2>

            <p
              style={{
                margin:
                  "4px 0 0",
                color: "#8fa3bb",
                fontSize: "11px",
              }}
            >
              Real-time detections from AEGISDRP
            </p>
          </div>

          <span
            style={{
              background:
                "rgba(34,197,94,0.12)",
              color: "#22c55e",
              border:
                "1px solid rgba(34,197,94,0.2)",
              padding:
                "5px 9px",
              borderRadius:
                "999px",
              fontSize: "9px",
              fontWeight: 800,
            }}
          >
            ● MONITORING
          </span>
        </div>


        {/* Threat List */}

        {threatData.threats.length === 0 ? (

          <div
            style={{
              minHeight: "230px",
              display: "flex",
              flexDirection:
                "column",
              justifyContent:
                "center",
              alignItems:
                "center",
              gap: "7px",
            }}
          >

            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background:
                  "rgba(34,197,94,0.14)",
                color: "#22c55e",
                fontSize: "20px",
              }}
            >
              ✓
            </div>

            <strong>
              No active threats
            </strong>

            <span
              style={{
                color: "#71859d",
                fontSize: "10px",
              }}
            >
              The monitoring engine has not detected threats.
            </span>

          </div>

        ) : (

          <div>

            {threatData.threats.map(
              (threat) => {

                const severityColor =
                  threat.severity ===
                  "HIGH"
                    ? "#ef4444"
                    : threat.severity ===
                      "MEDIUM"
                    ? "#eab308"
                    : "#22c55e";

                return (
                  <div
                    key={threat.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "5px minmax(0,1fr) 90px 140px",
                      gap: "14px",
                      alignItems:
                        "center",
                      padding:
                        "14px 20px",
                      borderBottom:
                        "1px solid rgba(148,163,184,0.08)",
                    }}
                  >

                    {/* Severity indicator */}

                    <div
                      style={{
                        width: "4px",
                        height: "35px",
                        borderRadius:
                          "5px",
                        background:
                          severityColor,
                        boxShadow:
                          `0 0 12px ${severityColor}`,
                      }}
                    />

                    {/* Threat */}

                    <div>

                      <strong
                        style={{
                          display:
                            "block",
                          fontSize:
                            "12px",
                        }}
                      >
                        {threat.type}
                      </strong>

                      <span
                        style={{
                          display:
                            "block",
                          marginTop:
                            "3px",
                          color:
                            "#71859d",
                          fontSize:
                            "10px",
                        }}
                      >
                        Source:{" "}
                        {threat.source}
                      </span>

                    </div>

                    {/* Severity */}

                    <span
                      style={{
                        color:
                          severityColor,
                        background:
                          `${severityColor}18`,
                        border:
                          `1px solid ${severityColor}35`,
                        padding:
                          "5px 8px",
                        borderRadius:
                          "999px",
                        textAlign:
                          "center",
                        fontSize:
                          "9px",
                        fontWeight:
                          800,
                      }}
                    >
                      {threat.severity}
                    </span>

                    {/* Detection */}

                    <span
                      style={{
                        color:
                          "#71859d",
                        fontSize:
                          "9px",
                        textAlign:
                          "right",
                      }}
                    >
                      DETECTED NOW
                    </span>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>


      {/* ================================
          AUTO UPDATE INDICATOR
      ================================= */}

      <div
        style={{
          textAlign: "right",
          marginTop: "8px",
          color: "#647890",
          fontSize: "9px",
        }}
      >
        ● Dummy telemetry · Auto-updating every 3 seconds
      </div>

    </section>
  );
}


/* ======================================
   INLINE STYLES
====================================== */

const cardStyle: React.CSSProperties = {
  background:
    "rgba(17,24,39,0.82)",
  border:
    "1px solid rgba(148,163,184,0.16)",
  borderRadius: "14px",
  padding: "16px",
  minHeight: "125px",
};

const cardHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#9aaabd",
  fontSize: "11px",
  fontWeight: 600,
};

const iconStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "9px",
  display: "grid",
  placeItems: "center",
  fontWeight: 800,
};

const numberStyle: React.CSSProperties = {
  display: "block",
  marginTop: "12px",
  fontSize: "28px",
  lineHeight: 1,
};

const descriptionStyle: React.CSSProperties = {
  display: "block",
  marginTop: "9px",
  color: "#71859d",
  fontSize: "9px",
};