"use client";

import { useEffect, useMemo, useState } from "react";

type SecurityEvent = {
  id: number;
  event: string;
  source: string;
  destination: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  status:
    | "OPEN"
    | "ACKNOWLEDGED"
    | "RESOLVED"
    | "CLOSED";
  system: string;
  time: string;
};

const dummyEventSets: SecurityEvent[][] = [
  [
    {
      id: 1001,
      event: "Brute Force Attack",
      source: "192.168.1.45",
      destination: "192.168.1.10",
      severity: "HIGH",
      status: "OPEN",
      system: "Production Server",
      time: "Just now",
    },
    {
      id: 1002,
      event: "Suspicious Network Scan",
      source: "10.10.24.17",
      destination: "192.168.1.20",
      severity: "HIGH",
      status: "ACKNOWLEDGED",
      system: "Web Server",
      time: "2 min ago",
    },
    {
      id: 1003,
      event: "Abnormal Login Activity",
      source: "172.16.0.22",
      destination: "192.168.1.30",
      severity: "MEDIUM",
      status: "OPEN",
      system: "Database Server",
      time: "5 min ago",
    },
    {
      id: 1004,
      event: "Unusual Traffic Pattern",
      source: "192.168.1.88",
      destination: "10.0.0.15",
      severity: "LOW",
      status: "RESOLVED",
      system: "API Gateway",
      time: "8 min ago",
    },
    {
      id: 1005,
      event: "Suspicious API Requests",
      source: "10.0.0.44",
      destination: "10.0.0.20",
      severity: "MEDIUM",
      status: "OPEN",
      system: "API Gateway",
      time: "11 min ago",
    },
  ],

  [
    {
      id: 1006,
      event: "DDoS Traffic Detected",
      source: "45.83.21.19",
      destination: "192.168.1.10",
      severity: "HIGH",
      status: "OPEN",
      system: "Production Server",
      time: "Just now",
    },
    {
      id: 1007,
      event: "Port Scanning Activity",
      source: "103.42.88.12",
      destination: "192.168.1.20",
      severity: "HIGH",
      status: "ACKNOWLEDGED",
      system: "Web Server",
      time: "3 min ago",
    },
    {
      id: 1008,
      event: "Credential Attack",
      source: "185.22.91.42",
      destination: "192.168.1.30",
      severity: "HIGH",
      status: "OPEN",
      system: "Database Server",
      time: "6 min ago",
    },
    {
      id: 1009,
      event: "Abnormal DNS Query",
      source: "192.168.0.91",
      destination: "8.8.8.8",
      severity: "MEDIUM",
      status: "RESOLVED",
      system: "DNS Gateway",
      time: "10 min ago",
    },
  ],

  [
    {
      id: 1010,
      event: "Unauthorized Access Attempt",
      source: "172.20.10.14",
      destination: "192.168.1.10",
      severity: "HIGH",
      status: "OPEN",
      system: "Production Server",
      time: "Just now",
    },
    {
      id: 1011,
      event: "Suspicious File Activity",
      source: "192.168.1.76",
      destination: "192.168.1.40",
      severity: "MEDIUM",
      status: "ACKNOWLEDGED",
      system: "File Server",
      time: "4 min ago",
    },
    {
      id: 1012,
      event: "Multiple Failed Logins",
      source: "10.20.30.45",
      destination: "192.168.1.30",
      severity: "MEDIUM",
      status: "OPEN",
      system: "Database Server",
      time: "7 min ago",
    },
    {
      id: 1013,
      event: "Unusual Outbound Traffic",
      source: "192.168.1.55",
      destination: "185.12.44.90",
      severity: "LOW",
      status: "CLOSED",
      system: "Workstation",
      time: "13 min ago",
    },
  ],
];

export default function SecurityEventsDummy() {
  const [setIndex, setSetIndex] = useState(0);

  const [search, setSearch] = useState("");

  const [severity, setSeverity] =
    useState("ALL");

  const [status, setStatus] =
    useState("ALL");

  const [events, setEvents] =
    useState<SecurityEvent[]>(
      dummyEventSets[0]
    );

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        setSetIndex((previous) => {
          const next =
            (previous + 1) %
            dummyEventSets.length;

          setEvents(
            dummyEventSets[next]
          );

          return next;
        });
      }, 5000);

    return () =>
      window.clearInterval(
        interval
      );
  }, []);

  const filteredEvents = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return events.filter((event) => {
      const matchesSearch =
        !searchValue ||
        event.event
          .toLowerCase()
          .includes(searchValue) ||
        event.source
          .toLowerCase()
          .includes(searchValue) ||
        event.destination
          .toLowerCase()
          .includes(searchValue) ||
        event.system
          .toLowerCase()
          .includes(searchValue) ||
        String(event.id).includes(
          searchValue
        );

      const matchesSeverity =
        severity === "ALL" ||
        event.severity === severity;

      const matchesStatus =
        status === "ALL" ||
        event.status === status;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus
      );
    });
  }, [
    events,
    search,
    severity,
    status,
  ]);

  const highCount =
    events.filter(
      (event) =>
        event.severity === "HIGH"
    ).length;

  const mediumCount =
    events.filter(
      (event) =>
        event.severity === "MEDIUM"
    ).length;

  const openCount =
    events.filter(
      (event) =>
        event.status === "OPEN"
    ).length;

  const resolvedCount =
    events.filter(
      (event) =>
        event.status === "RESOLVED" ||
        event.status === "CLOSED"
    ).length;

  function severityColor(
    value: string
  ) {
    if (value === "HIGH")
      return "#ef4444";

    if (value === "MEDIUM")
      return "#eab308";

    return "#22c55e";
  }

  function statusColor(
    value: string
  ) {
    if (value === "OPEN")
      return "#ef4444";

    if (value === "ACKNOWLEDGED")
      return "#eab308";

    return "#22c55e";
  }

  function refreshDummyData() {
    setSetIndex((previous) => {
      const next =
        (previous + 1) %
        dummyEventSets.length;

      setEvents(
        dummyEventSets[next]
      );

      return next;
    });
  }

  return (
    <main style={styles.page}>

      {/* =========================================
          HEADER
      ========================================== */}

      <div style={styles.header}>

        <div>
          <div style={styles.breadcrumb}>
            AEGISDRP / EVENTS
          </div>

          <h1 style={styles.title}>
            Security Event Management
          </h1>

          <p style={styles.subtitle}>
            Autonomous digital risk monitoring
            and protection
          </p>
        </div>

        <div style={styles.headerActions}>

          <div style={styles.apiStatus}>
            <span
              style={styles.onlineDot}
            />
            API ONLINE
          </div>

          <button
            style={styles.refreshButton}
            onClick={
              refreshDummyData
            }
          >
            ↻ Refresh Events
          </button>

        </div>

      </div>


      {/* =========================================
          SUMMARY CARDS
      ========================================== */}

      <section
        style={styles.summaryGrid}
      >

        <SummaryCard
          title="TOTAL EVENTS"
          value={events.length}
          description="Detected security events"
          icon="◉"
          color="#60a5fa"
        />

        <SummaryCard
          title="HIGH SEVERITY"
          value={highCount}
          description="High priority threats"
          icon="!"
          color="#ef4444"
        />

        <SummaryCard
          title="OPEN EVENTS"
          value={openCount}
          description="Awaiting response"
          icon="⚠"
          color="#f97316"
        />

        <SummaryCard
          title="RESOLVED"
          value={resolvedCount}
          description="Successfully handled"
          icon="✓"
          color="#22c55e"
        />

      </section>


      {/* =========================================
          MAIN EVENT PANEL
      ========================================== */}

      <section style={styles.panel}>

        <div style={styles.panelHeader}>

          <div>
            <h2 style={styles.panelTitle}>
              Security Event Management
            </h2>

            <p style={styles.panelSubtitle}>
              Search, filter and investigate
              detected events
            </p>
          </div>

          <div style={styles.liveBadge}>
            <span
              style={styles.pulse}
            />
            LIVE EVENTS
          </div>

        </div>


        {/* =====================================
            FILTERS
        ====================================== */}

        <div style={styles.filters}>

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search event, IP or system..."
            style={styles.input}
          />

          <select
            value={severity}
            onChange={(event) =>
              setSeverity(
                event.target.value
              )
            }
            style={styles.select}
          >

            <option value="ALL">
              All Severity
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="LOW">
              Low
            </option>

          </select>


          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value
              )
            }
            style={styles.select}
          >

            <option value="ALL">
              All Status
            </option>

            <option value="OPEN">
              Open
            </option>

            <option value="ACKNOWLEDGED">
              Acknowledged
            </option>

            <option value="RESOLVED">
              Resolved
            </option>

            <option value="CLOSED">
              Closed
            </option>

          </select>

        </div>


        {/* =====================================
            TABLE HEADER
        ====================================== */}

        <div
          style={styles.tableHeader}
        >

          <span>ID</span>

          <span>EVENT</span>

          <span>SOURCE</span>

          <span>SEVERITY</span>

          <span>STATUS</span>

          <span>SYSTEM</span>

          <span>TIME</span>

        </div>


        {/* =====================================
            EVENT ROWS
        ====================================== */}

        {filteredEvents.length === 0 ? (

          <div style={styles.empty}>
            No matching security events.
          </div>

        ) : (

          filteredEvents.map(
            (event) => (

              <div
                key={event.id}
                style={
                  styles.tableRow
                }
              >

                <span
                  style={
                    styles.eventId
                  }
                >
                  #{event.id}
                </span>


                <div
                  style={
                    styles.eventName
                  }
                >

                  <strong>
                    {event.event}
                  </strong>

                  <small>
                    Security detection
                  </small>

                </div>


                <span
                  style={
                    styles.mono
                  }
                >
                  {event.source}
                </span>


                <span
                  style={{
                    ...styles.badge,
                    color:
                      severityColor(
                        event.severity
                      ),
                    background:
                      `${severityColor(
                        event.severity
                      )}18`,
                    border:
                      `1px solid ${severityColor(
                        event.severity
                      )}40`,
                  }}
                >
                  {event.severity}
                </span>


                <span
                  style={{
                    ...styles.statusBadge,
                    color:
                      statusColor(
                        event.status
                      ),
                  }}
                >
                  ● {event.status}
                </span>


                <span
                  style={
                    styles.systemText
                  }
                >
                  {event.system}
                </span>


                <span
                  style={
                    styles.timeText
                  }
                >
                  {event.time}
                </span>

              </div>

            )
          )

        )}

      </section>


      {/* =========================================
          FOOTER
      ========================================== */}

      <div style={styles.footer}>

        <span>
          AEGISDRP · Security Event Management
        </span>

        <span>
          Dummy security telemetry ·
          Auto-updating every 5 seconds
        </span>

      </div>

    </main>
  );
}


/* =====================================================
   SUMMARY CARD COMPONENT
===================================================== */

function SummaryCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: number;
  description: string;
  icon: string;
  color: string;
}) {
  return (
    <div style={styles.summaryCard}>

      <div
        style={
          styles.summaryHeader
        }
      >

        <span
          style={
            styles.summaryTitle
          }
        >
          {title}
        </span>

        <div
          style={{
            ...styles.summaryIcon,
            color,
            background:
              `${color}18`,
          }}
        >
          {icon}
        </div>

      </div>

      <strong
        style={{
          ...styles.summaryValue,
          color,
        }}
      >
        {value}
      </strong>

      <span
        style={
          styles.summaryDescription
        }
      >
        {description}
      </span>

    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

const styles: {
  [key: string]: React.CSSProperties;
} = {

  page: {
    minHeight: "100vh",
    width: "100%",
    padding: "28px",
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg,#070d18,#0b1220,#080e19)",
    color: "#ffffff",
    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "22px",
  },

  breadcrumb: {
    color: "#637890",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    marginBottom: "5px",
  },

  title: {
    margin: 0,
    fontSize: "25px",
    fontWeight: 800,
  },

  subtitle: {
    margin:
      "5px 0 0",
    color: "#8fa3bb",
    fontSize: "11px",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  apiStatus: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding:
      "7px 10px",
    border:
      "1px solid rgba(148,163,184,0.15)",
    borderRadius: "999px",
    color: "#9db0c6",
    fontSize: "9px",
    fontWeight: 700,
  },

  onlineDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow:
      "0 0 10px #22c55e",
  },

  refreshButton: {
    border:
      "1px solid rgba(148,163,184,0.16)",
    background:
      "rgba(148,163,184,0.06)",
    color: "#dbe7f5",
    borderRadius: "9px",
    padding:
      "8px 11px",
    fontSize: "10px",
    cursor: "pointer",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4,minmax(0,1fr))",
    gap: "14px",
    marginBottom: "18px",
  },

  summaryCard: {
    background:
      "linear-gradient(145deg,rgba(18,27,43,.96),rgba(12,19,32,.92))",
    border:
      "1px solid rgba(148,163,184,.15)",
    borderRadius: "14px",
    padding: "16px",
    minHeight: "120px",
    boxSizing: "border-box",
  },

  summaryHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  summaryTitle: {
    color: "#9aaabd",
    fontSize: "9px",
    fontWeight: 700,
  },

  summaryIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    display: "grid",
    placeItems: "center",
    fontSize: "12px",
    fontWeight: 800,
  },

  summaryValue: {
    display: "block",
    marginTop: "13px",
    fontSize: "28px",
    lineHeight: 1,
  },

  summaryDescription: {
    display: "block",
    marginTop: "8px",
    color: "#71859d",
    fontSize: "9px",
  },

  panel: {
    background:
      "linear-gradient(145deg,rgba(17,25,40,.96),rgba(10,17,29,.96))",
    border:
      "1px solid rgba(148,163,184,.15)",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow:
      "0 18px 50px rgba(0,0,0,.20)",
  },

  panelHeader: {
    padding:
      "17px 20px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "15px",
    borderBottom:
      "1px solid rgba(148,163,184,.10)",
  },

  panelTitle: {
    margin: 0,
    fontSize: "15px",
  },

  panelSubtitle: {
    margin:
      "4px 0 0",
    color: "#71859d",
    fontSize: "10px",
  },

  liveBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding:
      "5px 9px",
    borderRadius: "999px",
    background:
      "rgba(34,197,94,.10)",
    border:
      "1px solid rgba(34,197,94,.18)",
    color: "#22c55e",
    fontSize: "8px",
    fontWeight: 800,
  },

  pulse: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow:
      "0 0 10px #22c55e",
  },

  filters: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0,1fr) 180px 180px",
    gap: "10px",
    padding:
      "15px 20px",
    borderBottom:
      "1px solid rgba(148,163,184,.08)",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    background:
      "rgba(15,23,42,.75)",
    border:
      "1px solid rgba(148,163,184,.15)",
    borderRadius: "9px",
    padding:
      "10px 12px",
    color: "#ffffff",
    outline: "none",
    fontSize: "10px",
  },

  select: {
    width: "100%",
    boxSizing: "border-box",
    background:
      "#111827",
    border:
      "1px solid rgba(148,163,184,.15)",
    borderRadius: "9px",
    padding:
      "10px 12px",
    color: "#dbe7f5",
    outline: "none",
    fontSize: "10px",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "70px minmax(160px,1.5fr) minmax(130px,1fr) 90px 120px 140px 90px",
    gap: "12px",
    padding:
      "12px 20px",
    color: "#52677f",
    fontSize: "8px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    borderBottom:
      "1px solid rgba(148,163,184,.08)",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns:
      "70px minmax(160px,1.5fr) minmax(130px,1fr) 90px 120px 140px 90px",
    gap: "12px",
    alignItems: "center",
    padding:
      "14px 20px",
    borderBottom:
      "1px solid rgba(148,163,184,.07)",
    minHeight: "58px",
    boxSizing: "border-box",
  },

  eventId: {
    color: "#71859d",
    fontSize: "9px",
    fontFamily:
      "monospace",
  },

  eventName: {
    minWidth: 0,
  },

  mono: {
    color: "#91a5bc",
    fontSize: "9px",
    fontFamily:
      "monospace",
  },

  eventNameSmall: {
    color: "#71859d",
  },

  badge: {
    display: "inline-block",
    padding:
      "5px 8px",
    borderRadius: "999px",
    textAlign: "center",
    fontSize: "8px",
    fontWeight: 800,
  },

  statusBadge: {
    fontSize: "8px",
    fontWeight: 700,
  },

  systemText: {
    color: "#9aacc0",
    fontSize: "9px",
  },

  timeText: {
    color: "#647890",
    fontSize: "8px",
    textAlign: "right",
  },

  empty: {
    minHeight: "260px",
    display: "grid",
    placeItems: "center",
    color: "#71859d",
    fontSize: "11px",
  },

  footer: {
    display: "flex",
    justifyContent:
      "space-between",
    marginTop: "15px",
    paddingTop: "12px",
    borderTop:
      "1px solid rgba(148,163,184,.08)",
    color: "#53677e",
    fontSize: "8px",
  },
};