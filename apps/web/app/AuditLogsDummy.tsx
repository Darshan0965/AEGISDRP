"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

type Result = "SUCCESS" | "FAILED" | "BLOCKED";

type AuditEvent = {
  id: number;
  timestamp: string;
  actor: string;
  action: string;
  category: string;
  target: string;
  sourceIp: string;
  result: Result;
  severity: Severity;
  risk: number;
  description: string;
};

const initialEvents: AuditEvent[] = [
  {
    id: 10091,
    timestamp: "10:44:21",
    actor: "Darshan S",
    action: "LOGIN",
    category: "AUTHENTICATION",
    target: "AEGISDRP Console",
    sourceIp: "192.168.1.50",
    result: "SUCCESS",
    severity: "LOW",
    risk: 8,
    description:
      "Administrator successfully authenticated with MFA.",
  },
  {
    id: 10090,
    timestamp: "10:43:58",
    actor: "Arun Kumar",
    action: "ROLE_UPDATE",
    category: "IDENTITY",
    target: "user:priya",
    sourceIp: "192.168.1.61",
    result: "SUCCESS",
    severity: "MEDIUM",
    risk: 32,
    description:
      "SOC Analyst role permissions were reviewed and updated.",
  },
  {
    id: 10089,
    timestamp: "10:43:21",
    actor: "AEGIS Detection",
    action: "THREAT_DETECTED",
    category: "SECURITY",
    target: "WEB-SRV-03",
    sourceIp: "185.220.101.42",
    result: "SUCCESS",
    severity: "CRITICAL",
    risk: 94,
    description:
      "High-confidence brute-force activity detected against authentication service.",
  },
  {
    id: 10088,
    timestamp: "10:42:49",
    actor: "AEGIS Response",
    action: "SYSTEM_ISOLATION",
    category: "RESPONSE",
    target: "WEB-SRV-03",
    sourceIp: "127.0.0.1",
    result: "SUCCESS",
    severity: "HIGH",
    risk: 82,
    description:
      "Compromised system successfully isolated from the protected network.",
  },
  {
    id: 10087,
    timestamp: "10:42:12",
    actor: "Unknown",
    action: "LOGIN_ATTEMPT",
    category: "AUTHENTICATION",
    target: "admin@aegisdrp.local",
    sourceIp: "45.148.10.21",
    result: "FAILED",
    severity: "HIGH",
    risk: 76,
    description:
      "Multiple invalid authentication attempts detected.",
  },
  {
    id: 10086,
    timestamp: "10:41:37",
    actor: "Priya N",
    action: "EVENT_ACKNOWLEDGED",
    category: "SECURITY",
    target: "INC-1046",
    sourceIp: "192.168.1.77",
    result: "SUCCESS",
    severity: "MEDIUM",
    risk: 41,
    description:
      "Security analyst acknowledged an active credential abuse incident.",
  },
  {
    id: 10085,
    timestamp: "10:40:44",
    actor: "Arun Kumar",
    action: "POLICY_UPDATE",
    category: "CONFIGURATION",
    target: "Firewall Policy #17",
    sourceIp: "192.168.1.61",
    result: "SUCCESS",
    severity: "HIGH",
    risk: 63,
    description:
      "Network filtering policy modified by privileged administrator.",
  },
  {
    id: 10084,
    timestamp: "10:39:18",
    actor: "Unknown",
    action: "ACCESS_DENIED",
    category: "AUTHORIZATION",
    target: "/admin/settings",
    sourceIp: "103.76.120.11",
    result: "BLOCKED",
    severity: "HIGH",
    risk: 69,
    description:
      "Unauthorized attempt to access restricted administration endpoint.",
  },
  {
    id: 10083,
    timestamp: "10:38:52",
    actor: "Meena Raj",
    action: "EVIDENCE_COLLECTED",
    category: "FORENSICS",
    target: "DB-SRV-04",
    sourceIp: "192.168.1.82",
    result: "SUCCESS",
    severity: "LOW",
    risk: 18,
    description:
      "Forensic evidence collection completed successfully.",
  },
  {
    id: 10082,
    timestamp: "10:37:41",
    actor: "System Service",
    action: "API_KEY_ROTATED",
    category: "CREDENTIALS",
    target: "Detection Service",
    sourceIp: "127.0.0.1",
    result: "SUCCESS",
    severity: "MEDIUM",
    risk: 37,
    description:
      "Detection service API credential rotation completed.",
  },
];

const severityColor = (severity: Severity) => {
  if (severity === "CRITICAL") return "#ff3b5c";
  if (severity === "HIGH") return "#ff8a3d";
  if (severity === "MEDIUM") return "#ffc857";
  return "#4dd4a8";
};

const resultColor = (result: Result) => {
  if (result === "SUCCESS") return "#4dd4a8";
  if (result === "FAILED") return "#ff3b5c";
  return "#ffc857";
};

export default function AuditLogsDummy() {
  const [events, setEvents] =
    useState<AuditEvent[]>(initialEvents);

  const [selected, setSelected] =
    useState<AuditEvent>(initialEvents[0]);

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] =
    useState("ALL");

  const [categoryFilter, setCategoryFilter] =
    useState("ALL");

  const [resultFilter, setResultFilter] =
    useState("ALL");

  const [lastUpdate, setLastUpdate] =
    useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      const categories = [
        "AUTHENTICATION",
        "SECURITY",
        "RESPONSE",
        "IDENTITY",
        "CONFIGURATION",
        "FORENSICS",
      ];

      const actions = [
        "LOGIN",
        "LOGIN_ATTEMPT",
        "EVENT_ACKNOWLEDGED",
        "POLICY_UPDATE",
        "THREAT_DETECTED",
        "EVIDENCE_COLLECTED",
      ];

      const actors = [
        "AEGIS Detection",
        "AEGIS Response",
        "SOC Analyst",
        "Security Admin",
        "System Service",
      ];

      const severityList: Severity[] = [
        "LOW",
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
      ];

      const severity =
        severityList[
          Math.floor(
            Math.random() * severityList.length
          )
        ];

      const resultList: Result[] = [
        "SUCCESS",
        "SUCCESS",
        "SUCCESS",
        "FAILED",
        "BLOCKED",
      ];

      const result =
        resultList[
          Math.floor(
            Math.random() * resultList.length
          )
        ];

      const event: AuditEvent = {
        id:
          10100 +
          Math.floor(Math.random() * 900),
        timestamp: now.toLocaleTimeString(),
        actor:
          actors[
            Math.floor(
              Math.random() * actors.length
            )
          ],
        action:
          actions[
            Math.floor(
              Math.random() * actions.length
            )
          ],
        category:
          categories[
            Math.floor(
              Math.random() * categories.length
            )
          ],
        target:
          Math.random() > 0.5
            ? "AEGISDRP Console"
            : "WEB-SRV-03",
        sourceIp:
          Math.random() > 0.5
            ? "192.168.1." +
              Math.floor(
                Math.random() * 200 + 20
              )
            : "185.220.101.42",
        result,
        severity,
        risk:
          severity === "CRITICAL"
            ? 90 + Math.floor(Math.random() * 10)
            : severity === "HIGH"
            ? 60 + Math.floor(Math.random() * 25)
            : severity === "MEDIUM"
            ? 30 + Math.floor(Math.random() * 30)
            : Math.floor(Math.random() * 25),
        description:
          "Automated audit telemetry event generated by the AEGISDRP security monitoring pipeline.",
      };

      setEvents((current) => [
        event,
        ...current,
      ].slice(0, 30));

      setSelected(event);
      setLastUpdate(now);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const text =
        `${event.actor} ${event.action} ${event.target} ${event.sourceIp}`
          .toLowerCase();

      const matchesSearch =
        text.includes(search.toLowerCase());

      const matchesSeverity =
        severityFilter === "ALL" ||
        event.severity === severityFilter;

      const matchesCategory =
        categoryFilter === "ALL" ||
        event.category === categoryFilter;

      const matchesResult =
        resultFilter === "ALL" ||
        event.result === resultFilter;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesCategory &&
        matchesResult
      );
    });
  }, [
    events,
    search,
    severityFilter,
    categoryFilter,
    resultFilter,
  ]);

  const totalEvents = events.length;

  const criticalEvents = events.filter(
    (e) => e.severity === "CRITICAL"
  ).length;

  const failedEvents = events.filter(
    (e) =>
      e.result === "FAILED" ||
      e.result === "BLOCKED"
  ).length;

  const adminEvents = events.filter(
    (e) =>
      e.actor.includes("Admin") ||
      e.actor === "Darshan S"
  ).length;

  const authEvents = events.filter(
    (e) =>
      e.category === "AUTHENTICATION"
  ).length;

  const integrityScore = 99.98;

  return (
    <div style={styles.page}>
      {/* HEADER */}

      <div style={styles.header}>
        <div>
          <div style={styles.breadcrumb}>
            AEGISDRP / MANAGEMENT / AUDIT
          </div>

          <h1 style={styles.title}>
            Security Audit Logs
          </h1>

          <p style={styles.subtitle}>
            Centralized security activity, identity
            auditing and forensic event tracking
          </p>
        </div>

        <div style={styles.liveBadge}>
          <span style={styles.liveDot} />
          AUDIT PIPELINE ACTIVE
        </div>
      </div>

      {/* KPI */}

      <div style={styles.kpiGrid}>
        <Kpi
          label="TOTAL EVENTS"
          value={totalEvents}
          detail="events in current stream"
          color="#42d9ff"
        />

        <Kpi
          label="CRITICAL EVENTS"
          value={criticalEvents}
          detail="priority investigation"
          color="#ff3b5c"
        />

        <Kpi
          label="FAILED / BLOCKED"
          value={failedEvents}
          detail="access or action failures"
          color="#ff8a3d"
        />

        <Kpi
          label="ADMIN ACTIONS"
          value={adminEvents}
          detail="privileged activity"
          color="#9b7cff"
        />

        <Kpi
          label="AUTH EVENTS"
          value={authEvents}
          detail="identity activity"
          color="#ffc857"
        />

        <Kpi
          label="LOG INTEGRITY"
          value={`${integrityScore}%`}
          detail="pipeline health"
          color="#4dd4a8"
        />
      </div>

      {/* SECURITY POSTURE */}

      <div style={styles.postureGrid}>
        <Posture
          title="Audit Coverage"
          value="98.7%"
          description="Protected components reporting"
          color="#42d9ff"
        />

        <Posture
          title="Event Processing"
          value="99.9%"
          description="Events successfully processed"
          color="#4dd4a8"
        />

        <Posture
          title="Anomaly Detection"
          value="94.2%"
          description="Detection confidence"
          color="#9b7cff"
        />

        <Posture
          title="Retention"
          value="180D"
          description="Configured audit retention"
          color="#ffc857"
        />
      </div>

      {/* SEARCH / FILTER */}

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>
              Audit Event Explorer
            </h2>

            <p style={styles.panelSubtitle}>
              Search and investigate security activity
            </p>
          </div>

          <button style={styles.exportButton}>
            ↓ Export Logs
          </button>
        </div>

        <div style={styles.filters}>
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search actor, action, target or IP..."
            style={styles.search}
          />

          <select
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="ALL">
              All Severity
            </option>
            <option value="CRITICAL">
              Critical
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
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="ALL">
              All Categories
            </option>
            <option value="AUTHENTICATION">
              Authentication
            </option>
            <option value="SECURITY">
              Security
            </option>
            <option value="RESPONSE">
              Response
            </option>
            <option value="IDENTITY">
              Identity
            </option>
            <option value="CONFIGURATION">
              Configuration
            </option>
            <option value="FORENSICS">
              Forensics
            </option>
          </select>

          <select
            value={resultFilter}
            onChange={(e) =>
              setResultFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="ALL">
              All Results
            </option>
            <option value="SUCCESS">
              Success
            </option>
            <option value="FAILED">
              Failed
            </option>
            <option value="BLOCKED">
              Blocked
            </option>
          </select>
        </div>
      </section>

      {/* MAIN AUDIT AREA */}

      <div style={styles.mainGrid}>
        {/* EVENT TABLE */}

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Live Audit Stream
              </h2>

              <p style={styles.panelSubtitle}>
                Real-time activity feed
              </p>
            </div>

            <span style={styles.liveText}>
              ● LIVE
            </span>
          </div>

          <div style={styles.tableHeader}>
            <span>TIME</span>
            <span>ACTOR</span>
            <span>ACTION</span>
            <span>SEVERITY</span>
            <span>RESULT</span>
            <span>RISK</span>
          </div>

          <div>
            {filteredEvents.map((event) => (
              <button
                key={event.id}
                onClick={() =>
                  setSelected(event)
                }
                style={{
                  ...styles.eventRow,
                  background:
                    selected.id === event.id
                      ? "rgba(66,217,255,0.055)"
                      : "transparent",
                }}
              >
                <span style={styles.time}>
                  {event.timestamp}
                </span>

                <span style={styles.actor}>
                  {event.actor}
                </span>

                <span style={styles.action}>
                  {event.action}
                </span>

                <span
                  style={{
                    color: severityColor(
                      event.severity
                    ),
                    fontSize: 8,
                    fontWeight: 900,
                  }}
                >
                  {event.severity}
                </span>

                <span
                  style={{
                    color: resultColor(
                      event.result
                    ),
                    fontSize: 8,
                    fontWeight: 900,
                  }}
                >
                  {event.result}
                </span>

                <span
                  style={{
                    color: severityColor(
                      event.severity
                    ),
                    fontWeight: 900,
                  }}
                >
                  {event.risk}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* DETAILS */}

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Event Investigation
              </h2>

              <p style={styles.panelSubtitle}>
                Selected audit record
              </p>
            </div>

            <span
              style={{
                ...styles.severityBadge,
                color: severityColor(
                  selected.severity
                ),
                borderColor:
                  severityColor(
                    selected.severity
                  ),
              }}
            >
              {selected.severity}
            </span>
          </div>

          <div style={styles.eventId}>
            AUDIT-{selected.id}
          </div>

          <Detail
            label="Timestamp"
            value={selected.timestamp}
          />

          <Detail
            label="Actor"
            value={selected.actor}
          />

          <Detail
            label="Action"
            value={selected.action}
          />

          <Detail
            label="Category"
            value={selected.category}
          />

          <Detail
            label="Target"
            value={selected.target}
          />

          <Detail
            label="Source IP"
            value={selected.sourceIp}
          />

          <Detail
            label="Result"
            value={selected.result}
          />

          <div style={styles.description}>
            <span>Description</span>
            <p>{selected.description}</p>
          </div>

          <div style={styles.riskBox}>
            <div>
              <span>Event Risk Score</span>

              <strong
                style={{
                  color: severityColor(
                    selected.severity
                  ),
                }}
              >
                {selected.risk}/100
              </strong>
            </div>

            <div style={styles.riskBar}>
              <div
                style={{
                  width: `${selected.risk}%`,
                  height: "100%",
                  background:
                    severityColor(
                      selected.severity
                    ),
                  borderRadius: 20,
                }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* INTELLIGENCE */}

      <div style={styles.threeGrid}>
        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>
            Authentication Intelligence
          </h2>

          <p style={styles.panelSubtitle}>
            Identity-related audit signals
          </p>

          <Signal
            title="Successful Logins"
            value="1,284"
            status="NORMAL"
          />

          <Signal
            title="Failed Logins"
            value="37"
            status="MONITORED"
          />

          <Signal
            title="Blocked Access"
            value="18"
            status="ELEVATED"
          />

          <Signal
            title="MFA Events"
            value="184"
            status="NORMAL"
          />
        </section>

        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>
            Privileged Activity
          </h2>

          <p style={styles.panelSubtitle}>
            Administrative security events
          </p>

          <Signal
            title="Role Changes"
            value="14"
            status="REVIEWED"
          />

          <Signal
            title="Policy Changes"
            value="8"
            status="MONITORED"
          />

          <Signal
            title="Account Changes"
            value="21"
            status="NORMAL"
          />

          <Signal
            title="Privilege Escalations"
            value="2"
            status="INVESTIGATE"
            danger
          />
        </section>

        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>
            Audit Integrity
          </h2>

          <p style={styles.panelSubtitle}>
            Protection and pipeline status
          </p>

          <Integrity
            name="Event Ingestion"
            value="ONLINE"
            good
          />

          <Integrity
            name="Central Storage"
            value="HEALTHY"
            good
          />

          <Integrity
            name="Tamper Detection"
            value="ACTIVE"
            good
          />

          <Integrity
            name="Retention Policy"
            value="180 DAYS"
            good
          />
        </section>
      </div>

      {/* USER ACTIVITY */}

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>
              User Activity Timeline
            </h2>

            <p style={styles.panelSubtitle}>
              Chronology of significant identity actions
            </p>
          </div>

          <span style={styles.updated}>
            Updated {lastUpdate.toLocaleTimeString()}
          </span>
        </div>

        <div style={styles.timeline}>
          <Timeline
            time="10:44:21"
            title="Administrator login"
            detail="Darshan S authenticated using MFA"
            color="#4dd4a8"
          />

          <Timeline
            time="10:43:58"
            title="Role permission updated"
            detail="SOC Analyst permissions modified"
            color="#42d9ff"
          />

          <Timeline
            time="10:42:49"
            title="System isolation completed"
            detail="WEB-SRV-03 removed from network"
            color="#ff3b5c"
          />

          <Timeline
            time="10:42:12"
            title="Authentication failure detected"
            detail="Multiple invalid attempts from external IP"
            color="#ff8a3d"
          />

          <Timeline
            time="10:40:44"
            title="Firewall policy modified"
            detail="Policy #17 changed by administrator"
            color="#ffc857"
          />
        </div>
      </section>

      {/* ALERT */}

      <div style={styles.alert}>
        <div style={styles.alertIcon}>!</div>

        <div>
          <strong>
            Audit Investigation Recommendation
          </strong>

          <p>
            A failed privileged-access attempt and
            multiple authentication anomalies were
            detected. Review the associated source IP,
            identity and session activity.
          </p>
        </div>

        <button style={styles.investigate}>
          Investigate
        </button>
      </div>

      <div style={styles.footer}>
        AEGISDRP Security Audit Engine • Centralized
        Logging • Forensics • Identity Monitoring •
        Integrity Protection
      </div>
    </div>
  );
}

/* COMPONENTS */

function Kpi({
  label,
  value,
  detail,
  color,
}: {
  label: string;
  value: string | number;
  detail: string;
  color: string;
}) {
  return (
    <div style={styles.kpi}>
      <span style={styles.kpiLabel}>
        {label}
      </span>

      <strong
        style={{
          ...styles.kpiValue,
          color,
        }}
      >
        {value}
      </strong>

      <span style={styles.kpiDetail}>
        {detail}
      </span>
    </div>
  );
}

function Posture({
  title,
  value,
  description,
  color,
}: {
  title: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div style={styles.posture}>
      <span>{title}</span>

      <strong style={{ color }}>
        {value}
      </strong>

      <small>{description}</small>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={styles.detail}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Signal({
  title,
  value,
  status,
  danger,
}: {
  title: string;
  value: string;
  status: string;
  danger?: boolean;
}) {
  return (
    <div style={styles.signal}>
      <div>
        <strong>{title}</strong>
        <span>{status}</span>
      </div>

      <b
        style={{
          color: danger
            ? "#ff3b5c"
            : "#42d9ff",
        }}
      >
        {value}
      </b>
    </div>
  );
}

function Integrity({
  name,
  value,
  good,
}: {
  name: string;
  value: string;
  good?: boolean;
}) {
  return (
    <div style={styles.integrity}>
      <div style={styles.integrityName}>
        <i
          style={{
            background: good
              ? "#4dd4a8"
              : "#ff3b5c",
          }}
        />

        <span>{name}</span>
      </div>

      <strong
        style={{
          color: good
            ? "#4dd4a8"
            : "#ff3b5c",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function Timeline({
  time,
  title,
  detail,
  color,
}: {
  time: string;
  title: string;
  detail: string;
  color: string;
}) {
  return (
    <div style={styles.timelineItem}>
      <div
        style={{
          ...styles.timelineDot,
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />

      <span style={styles.timelineTime}>
        {time}
      </span>

      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}

/* STYLES */

const styles: {
  [key: string]: CSSProperties;
} = {
  page: {
    width: "100%",
    color: "#eaf3ff",
    fontFamily:
      "Inter, system-ui, sans-serif",
    paddingBottom: 50,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },

  breadcrumb: {
    fontSize: 9,
    letterSpacing: 2,
    color: "#65748a",
    fontWeight: 800,
    marginBottom: 7,
  },

  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
  },

  subtitle: {
    color: "#718096",
    fontSize: 12,
    marginTop: 6,
  },

  liveBadge: {
    padding: "9px 13px",
    borderRadius: 9,
    border:
      "1px solid rgba(77,212,168,0.25)",
    color: "#4dd4a8",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: 1,
  },

  liveDot: {
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#4dd4a8",
    marginRight: 7,
  },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(6,minmax(120px,1fr))",
    gap: 11,
    marginBottom: 14,
  },

  kpi: {
    padding: 15,
    minHeight: 105,
    borderRadius: 13,
    border:
      "1px solid rgba(255,255,255,0.07)",
    background:
      "linear-gradient(145deg,#151d2e,#0c1220)",
  },

  kpiLabel: {
    display: "block",
    color: "#6d7a90",
    fontSize: 8,
    fontWeight: 900,
    letterSpacing: 1,
  },

  kpiValue: {
    display: "block",
    fontSize: 27,
    marginTop: 12,
  },

  kpiDetail: {
    display: "block",
    color: "#59677c",
    fontSize: 9,
    marginTop: 3,
  },

  postureGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4,minmax(0,1fr))",
    gap: 11,
    marginBottom: 15,
  },

  posture: {
    padding: 15,
    borderRadius: 12,
    background:
      "rgba(18,25,40,0.8)",
    border:
      "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },

  panel: {
    padding: 17,
    borderRadius: 15,
    border:
      "1px solid rgba(255,255,255,0.07)",
    background:
      "linear-gradient(145deg,#141b2b,#0b111e)",
    marginBottom: 15,
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },

  panelTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 800,
  },

  panelSubtitle: {
    color: "#647287",
    fontSize: 10,
    margin: "5px 0 0",
  },

  filters: {
    display: "flex",
    gap: 9,
  },

  search: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 8,
    border:
      "1px solid rgba(255,255,255,0.08)",
    background: "#090f1a",
    color: "#dce8f8",
    outline: "none",
    fontSize: 10,
  },

  select: {
    padding: "9px 10px",
    borderRadius: 8,
    border:
      "1px solid rgba(255,255,255,0.08)",
    background: "#090f1a",
    color: "#cbd7e8",
    fontSize: 10,
  },

  exportButton: {
    padding: "8px 12px",
    borderRadius: 7,
    border:
      "1px solid rgba(66,217,255,0.2)",
    background:
      "rgba(66,217,255,0.06)",
    color: "#42d9ff",
    fontSize: 9,
    fontWeight: 800,
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.65fr 0.65fr",
    gap: 15,
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "0.8fr 1.3fr 1.3fr 0.8fr 0.8fr 0.5fr",
    gap: 8,
    padding: "9px 10px",
    color: "#536176",
    fontSize: 8,
    fontWeight: 900,
    letterSpacing: 0.8,
  },

  eventRow: {
    width: "100%",
    display: "grid",
    gridTemplateColumns:
      "0.8fr 1.3fr 1.3fr 0.8fr 0.8fr 0.5fr",
    gap: 8,
    alignItems: "center",
    padding: "11px 10px",
    border: "none",
    borderTop:
      "1px solid rgba(255,255,255,0.045)",
    color: "#dce8f8",
    textAlign: "left",
    cursor: "pointer",
  },

  time: {
    color: "#56657a",
    fontFamily: "monospace",
    fontSize: 8,
  },

  actor: {
    fontSize: 9,
    color: "#9eabc0",
  },

  action: {
    fontSize: 9,
    fontWeight: 700,
  },

  liveText: {
    color: "#4dd4a8",
    fontSize: 8,
    fontWeight: 900,
  },

  severityBadge: {
    border: "1px solid",
    padding: "5px 7px",
    borderRadius: 6,
    fontSize: 8,
    fontWeight: 900,
  },

  eventId: {
    color: "#42d9ff",
    fontFamily: "monospace",
    fontSize: 9,
    marginBottom: 12,
  },

  detail: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    padding: "9px 0",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
    fontSize: 9,
  },

  description: {
    marginTop: 14,
    padding: 11,
    borderRadius: 8,
    background:
      "rgba(255,255,255,0.025)",
  },

  descriptionP: {
    color: "#758399",
    fontSize: 9,
    lineHeight: 1.5,
  },

  riskBox: {
    marginTop: 15,
    padding: 12,
    borderRadius: 9,
    background:
      "rgba(66,217,255,0.04)",
    border:
      "1px solid rgba(66,217,255,0.1)",
  },

  riskBoxDiv: {
    display: "flex",
    justifyContent: "space-between",
  },

  riskBar: {
    height: 5,
    marginTop: 8,
    borderRadius: 20,
    overflow: "hidden",
    background:
      "rgba(255,255,255,0.07)",
  },

  threeGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3,minmax(0,1fr))",
    gap: 15,
  },

  signal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "11px 0",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
  },

  signalDiv: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  integrity: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "11px 0",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
    fontSize: 9,
  },

  integrityName: {
    display: "flex",
    alignItems: "center",
    gap: 7,
  },

  integrityNameI: {
    width: 6,
    height: 6,
    borderRadius: "50%",
  },

  updated: {
    color: "#536176",
    fontSize: 9,
  },

  timeline: {
    display: "flex",
    flexDirection: "column",
  },

  timelineItem: {
    display: "grid",
    gridTemplateColumns:
      "10px 75px 1fr",
    alignItems: "center",
    gap: 12,
    padding: "12px 0",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
  },

  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
  },

  timelineTime: {
    color: "#536176",
    fontFamily: "monospace",
    fontSize: 8,
  },

  alert: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 15,
    borderRadius: 12,
    border:
      "1px solid rgba(255,140,61,0.18)",
    background:
      "rgba(255,140,61,0.045)",
  },

  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    background:
      "rgba(255,140,61,0.12)",
    color: "#ff8a3d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },

  investigate: {
    marginLeft: "auto",
    padding: "8px 12px",
    borderRadius: 7,
    border:
      "1px solid rgba(255,140,61,0.2)",
    background:
      "rgba(255,140,61,0.08)",
    color: "#ff8a3d",
    fontSize: 9,
    fontWeight: 800,
  },

  footer: {
    textAlign: "center",
    color: "#3e4a5e",
    fontSize: 8,
    marginTop: 22,
  },
};