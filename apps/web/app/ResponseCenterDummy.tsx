"use client";

import { useEffect, useMemo, useState } from "react";

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

type Incident = {
  id: string;
  threat: string;
  severity: Severity;
  system: string;
  sourceIp: string;
  status: string;
  action: string;
  risk: number;
  time: string;
};

type ActionLog = {
  id: number;
  time: string;
  action: string;
  target: string;
  result: "SUCCESS" | "RUNNING" | "FAILED";
};

const initialIncidents: Incident[] = [
  {
    id: "INC-1048",
    threat: "Brute Force Authentication",
    severity: "CRITICAL",
    system: "WEB-SRV-03",
    sourceIp: "185.220.101.42",
    status: "CONTAINING",
    action: "Isolate System",
    risk: 94,
    time: "10:42:18",
  },
  {
    id: "INC-1047",
    threat: "Suspicious Network Scan",
    severity: "HIGH",
    system: "API-NODE-02",
    sourceIp: "45.148.10.21",
    status: "INVESTIGATING",
    action: "Block Source",
    risk: 78,
    time: "10:41:52",
  },
  {
    id: "INC-1046",
    threat: "Credential Abuse",
    severity: "HIGH",
    system: "AUTH-SRV-01",
    sourceIp: "91.214.124.18",
    status: "CONTAINED",
    action: "Disable Account",
    risk: 71,
    time: "10:40:33",
  },
  {
    id: "INC-1045",
    threat: "Port Scanning Activity",
    severity: "MEDIUM",
    system: "DB-SRV-04",
    sourceIp: "103.76.120.11",
    status: "RESOLVED",
    action: "Block Source",
    risk: 46,
    time: "10:38:09",
  },
];

const initialActions: ActionLog[] = [
  {
    id: 1,
    time: "10:42:19",
    action: "System isolation initiated",
    target: "WEB-SRV-03",
    result: "RUNNING",
  },
  {
    id: 2,
    time: "10:42:07",
    action: "Threat intelligence lookup",
    target: "185.220.101.42",
    result: "SUCCESS",
  },
  {
    id: 3,
    time: "10:41:41",
    action: "Source IP blocked",
    target: "91.214.124.18",
    result: "SUCCESS",
  },
  {
    id: 4,
    time: "10:40:51",
    action: "Account disabled",
    target: "svc-api",
    result: "SUCCESS",
  },
  {
    id: 5,
    time: "10:39:44",
    action: "Evidence collection",
    target: "DB-SRV-04",
    result: "SUCCESS",
  },
];

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function severityColor(severity: Severity) {
  switch (severity) {
    case "CRITICAL":
      return "#ff3b5c";
    case "HIGH":
      return "#ff8a3d";
    case "MEDIUM":
      return "#ffc857";
    default:
      return "#4dd4a8";
  }
}

function resultColor(result: ActionLog["result"]) {
  if (result === "SUCCESS") return "#4dd4a8";
  if (result === "RUNNING") return "#42d9ff";
  return "#ff3b5c";
}

export default function ResponseCenterDummy() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [actions, setActions] = useState<ActionLog[]>(initialActions);
  const [selectedIncident, setSelectedIncident] =
    useState<Incident>(initialIncidents[0]);

  const [executing, setExecuting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());

      setIncidents((current) =>
        current.map((incident, index) => {
          if (index > 2) return incident;

          const change = randomBetween(-3, 3);

          return {
            ...incident,
            risk: Math.max(10, Math.min(100, incident.risk + change)),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const activeIncidents = useMemo(
    () =>
      incidents.filter(
        (item) =>
          item.status !== "RESOLVED" && item.status !== "CLOSED"
      ).length,
    [incidents]
  );

  const criticalThreats = useMemo(
    () =>
      incidents.filter(
        (item) =>
          item.severity === "CRITICAL" &&
          item.status !== "RESOLVED"
      ).length,
    [incidents]
  );

  const containedSystems = useMemo(
    () =>
      incidents.filter(
        (item) =>
          item.status === "CONTAINED" ||
          item.status === "RESOLVED"
      ).length,
    [incidents]
  );

  const responseSuccess = useMemo(() => {
    const successful = actions.filter(
      (item) => item.result === "SUCCESS"
    ).length;

    return Math.round((successful / actions.length) * 100);
  }, [actions]);

  const executeAction = (action: string) => {
    if (executing) return;

    setExecuting(true);

    const now = new Date();

    const newAction: ActionLog = {
      id: Date.now(),
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      action: `${action} initiated`,
      target: selectedIncident.system,
      result: "RUNNING",
    };

    setActions((current) => [newAction, ...current]);

    setTimeout(() => {
      setActions((current) =>
        current.map((item) =>
          item.id === newAction.id
            ? {
                ...item,
                result: "SUCCESS",
                action: `${action} completed`,
              }
            : item
        )
      );

      setIncidents((current) =>
        current.map((item) =>
          item.id === selectedIncident.id
            ? {
                ...item,
                status:
                  action === "Isolate System"
                    ? "CONTAINED"
                    : action === "Restore System"
                    ? "RESOLVED"
                    : "CONTAINING",
              }
            : item
        )
      );

      setSelectedIncident((current) => ({
        ...current,
        status:
          action === "Isolate System"
            ? "CONTAINED"
            : action === "Restore System"
            ? "RESOLVED"
            : "CONTAINING",
      }));

      setExecuting(false);
    }, 1800);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.breadcrumb}>
            AEGISDRP / RESPONSE CENTER
          </div>

          <h1 style={styles.title}>Automated Response Center</h1>

          <p style={styles.subtitle}>
            Security response, containment and recovery orchestration
          </p>
        </div>

        <div style={styles.liveBox}>
          <span style={styles.liveDot} />
          RESPONSE ENGINE ACTIVE
        </div>
      </div>

      {/* KPI CARDS */}
      <div style={styles.kpiGrid}>
        <Kpi
          label="ACTIVE INCIDENTS"
          value={activeIncidents}
          detail="requiring attention"
          icon="◉"
        />

        <Kpi
          label="CRITICAL THREATS"
          value={criticalThreats}
          detail="high-priority incidents"
          icon="!"
          danger
        />

        <Kpi
          label="SYSTEMS CONTAINED"
          value={containedSystems}
          detail="successfully contained"
          icon="◆"
          success
        />

        <Kpi
          label="RESPONSE SUCCESS"
          value={`${responseSuccess}%`}
          detail="automated actions"
          icon="✓"
          success
        />

        <Kpi
          label="ACTIONS EXECUTED"
          value={actions.length}
          detail="response operations"
          icon="⚡"
        />

        <Kpi
          label="AVG RESPONSE"
          value="1.8s"
          detail="mean containment time"
          icon="◷"
        />
      </div>

      {/* INCIDENT QUEUE */}
      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>Active Incident Queue</h2>
            <p style={styles.panelSubtitle}>
              Real-time incidents requiring automated or analyst response
            </p>
          </div>

          <div style={styles.liveBadge}>
            LIVE
          </div>
        </div>

        <div style={styles.incidentGrid}>
          {incidents.map((incident) => (
            <button
              key={incident.id}
              onClick={() => setSelectedIncident(incident)}
              style={{
                ...styles.incidentCard,
                border:
                  selectedIncident.id === incident.id
                    ? "1px solid #42d9ff"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={styles.incidentTop}>
                <span style={styles.incidentId}>
                  {incident.id}
                </span>

                <span
                  style={{
                    ...styles.severityBadge,
                    color: severityColor(incident.severity),
                    borderColor: severityColor(incident.severity),
                  }}
                >
                  {incident.severity}
                </span>
              </div>

              <h3 style={styles.incidentThreat}>
                {incident.threat}
              </h3>

              <div style={styles.incidentInfo}>
                <span>{incident.system}</span>
                <span>{incident.sourceIp}</span>
              </div>

              <div style={styles.riskRow}>
                <span>Risk Score</span>

                <strong
                  style={{
                    color: severityColor(incident.severity),
                  }}
                >
                  {incident.risk}/100
                </strong>
              </div>

              <div style={styles.progressBackground}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${incident.risk}%`,
                    background:
                      severityColor(incident.severity),
                  }}
                />
              </div>

              <div style={styles.incidentBottom}>
                <span>{incident.status}</span>
                <span>{incident.time}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* RESPONSE + PLAYBOOKS */}
      <div style={styles.twoColumn}>
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Automated Response Playbooks
              </h2>

              <p style={styles.panelSubtitle}>
                Execute containment and recovery actions
              </p>
            </div>
          </div>

          <div style={styles.playbookGrid}>
            <Playbook
              icon="⛨"
              title="Isolate System"
              description="Temporarily isolate a compromised endpoint"
              color="#ff3b5c"
              onClick={() => executeAction("Isolate System")}
              disabled={executing}
            />

            <Playbook
              icon="⊘"
              title="Block Source"
              description="Block malicious source IP address"
              color="#ff8a3d"
              onClick={() => executeAction("Block Source")}
              disabled={executing}
            />

            <Playbook
              icon="♙"
              title="Disable Account"
              description="Disable suspected compromised account"
              color="#ffc857"
              onClick={() => executeAction("Disable Account")}
              disabled={executing}
            />

            <Playbook
              icon="⌁"
              title="Collect Evidence"
              description="Collect forensic evidence from target"
              color="#42d9ff"
              onClick={() => executeAction("Collect Evidence")}
              disabled={executing}
            />

            <Playbook
              icon="◆"
              title="Threat Intelligence"
              description="Enrich indicator with threat intelligence"
              color="#9b7cff"
              onClick={() => executeAction("Threat Intelligence")}
              disabled={executing}
            />

            <Playbook
              icon="↻"
              title="Restore System"
              description="Return contained system to active state"
              color="#4dd4a8"
              onClick={() => executeAction("Restore System")}
              disabled={executing}
            />
          </div>
        </section>

        {/* SELECTED INCIDENT */}
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Response Target
              </h2>

              <p style={styles.panelSubtitle}>
                Currently selected incident
              </p>
            </div>

            <span
              style={{
                ...styles.severityBadge,
                color: severityColor(
                  selectedIncident.severity
                ),
                borderColor: severityColor(
                  selectedIncident.severity
                ),
              }}
            >
              {selectedIncident.severity}
            </span>
          </div>

          <div style={styles.targetBox}>
            <div style={styles.targetRow}>
              <span>Incident</span>
              <strong>{selectedIncident.id}</strong>
            </div>

            <div style={styles.targetRow}>
              <span>Threat</span>
              <strong>{selectedIncident.threat}</strong>
            </div>

            <div style={styles.targetRow}>
              <span>System</span>
              <strong>{selectedIncident.system}</strong>
            </div>

            <div style={styles.targetRow}>
              <span>Source IP</span>
              <strong>{selectedIncident.sourceIp}</strong>
            </div>

            <div style={styles.targetRow}>
              <span>Risk Score</span>
              <strong
                style={{
                  color: severityColor(
                    selectedIncident.severity
                  ),
                }}
              >
                {selectedIncident.risk}/100
              </strong>
            </div>

            <div style={styles.targetRow}>
              <span>Status</span>
              <strong>{selectedIncident.status}</strong>
            </div>
          </div>

          <div style={styles.containmentBox}>
            <div style={styles.containmentHeader}>
              <span>Response Progress</span>
              <strong>
                {selectedIncident.status === "RESOLVED"
                  ? "100%"
                  : selectedIncident.status === "CONTAINED"
                  ? "82%"
                  : "46%"}
              </strong>
            </div>

            <div style={styles.progressBackground}>
              <div
                style={{
                  ...styles.progressFill,
                  width:
                    selectedIncident.status === "RESOLVED"
                      ? "100%"
                      : selectedIncident.status ===
                        "CONTAINED"
                      ? "82%"
                      : "46%",
                  background: "#42d9ff",
                }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* RESPONSE LIFECYCLE */}
      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>
              Incident Response Lifecycle
            </h2>

            <p style={styles.panelSubtitle}>
              Automated security response workflow
            </p>
          </div>
        </div>

        <div style={styles.lifecycle}>
          <LifecycleStep
            number="01"
            title="Detection"
            description="Threat identified"
            active
          />

          <div style={styles.connector} />

          <LifecycleStep
            number="02"
            title="Investigation"
            description="Risk evaluated"
            active
          />

          <div style={styles.connector} />

          <LifecycleStep
            number="03"
            title="Containment"
            description="Threat isolated"
            active
          />

          <div style={styles.connector} />

          <LifecycleStep
            number="04"
            title="Recovery"
            description="System restored"
          />

          <div style={styles.connector} />

          <LifecycleStep
            number="05"
            title="Resolved"
            description="Incident closed"
          />
        </div>
      </section>

      {/* LIVE ACTION TIMELINE */}
      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>
              Live Response Activity
            </h2>

            <p style={styles.panelSubtitle}>
              Latest automated security actions
            </p>
          </div>

          <span style={styles.updatedText}>
            Updated {lastUpdate.toLocaleTimeString()}
          </span>
        </div>

        <div style={styles.timeline}>
          {actions.slice(0, 7).map((action) => (
            <div key={action.id} style={styles.timelineItem}>
              <div style={styles.timelineDot} />

              <div style={styles.timelineTime}>
                {action.time}
              </div>

              <div style={styles.timelineContent}>
                <strong>{action.action}</strong>
                <span>Target: {action.target}</span>
              </div>

              <div
                style={{
                  ...styles.resultBadge,
                  color: resultColor(action.result),
                  borderColor: resultColor(action.result),
                }}
              >
                {action.result}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ANALYTICS */}
      <div style={styles.analyticsGrid}>
        <AnalyticsCard
          title="Containment Rate"
          value="94.7%"
          change="+3.8%"
          description="vs previous 24 hours"
        />

        <AnalyticsCard
          title="Mean Time To Respond"
          value="1.8s"
          change="-21.4%"
          description="response efficiency improved"
        />

        <AnalyticsCard
          title="Automated Actions"
          value={`${actions.length}`}
          change="+12"
          description="executed this session"
        />

        <AnalyticsCard
          title="Threats Neutralized"
          value="87"
          change="+14.2%"
          description="successful mitigations"
        />
      </div>

      <div style={styles.footer}>
        AEGISDRP Response Orchestration Engine • Autonomous Digital Risk Protection
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Kpi({
  label,
  value,
  detail,
  icon,
  danger,
  success,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: string;
  danger?: boolean;
  success?: boolean;
}) {
  return (
    <div style={styles.kpi}>
      <div style={styles.kpiTop}>
        <span style={styles.kpiLabel}>{label}</span>

        <span
          style={{
            ...styles.kpiIcon,
            color: danger
              ? "#ff3b5c"
              : success
              ? "#4dd4a8"
              : "#42d9ff",
          }}
        >
          {icon}
        </span>
      </div>

      <div style={styles.kpiValue}>{value}</div>

      <div style={styles.kpiDetail}>{detail}</div>
    </div>
  );
}

function Playbook({
  icon,
  title,
  description,
  color,
  onClick,
  disabled,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.playbook,
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <div
        style={{
          ...styles.playbookIcon,
          color,
          borderColor: color,
        }}
      >
        {icon}
      </div>

      <div style={styles.playbookText}>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <span style={styles.playbookArrow}>→</span>
    </button>
  );
}

function LifecycleStep({
  number,
  title,
  description,
  active,
}: {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      style={{
        ...styles.lifecycleStep,
        opacity: active ? 1 : 0.45,
      }}
    >
      <div
        style={{
          ...styles.lifecycleNumber,
          borderColor: active
            ? "#42d9ff"
            : "rgba(255,255,255,0.15)",
          color: active ? "#42d9ff" : "#8d98aa",
        }}
      >
        {number}
      </div>

      <strong>{title}</strong>

      <span>{description}</span>
    </div>
  );
}

function AnalyticsCard({
  title,
  value,
  change,
  description,
}: {
  title: string;
  value: string;
  change: string;
  description: string;
}) {
  return (
    <div style={styles.analyticsCard}>
      <span style={styles.analyticsTitle}>{title}</span>

      <strong style={styles.analyticsValue}>
        {value}
      </strong>

      <span style={styles.analyticsChange}>
        {change}
      </span>

      <span style={styles.analyticsDescription}>
        {description}
      </span>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles: {
  [key: string]: React.CSSProperties;
} = {
  page: {
    width: "100%",
    color: "#eaf3ff",
    padding: "4px 4px 50px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  breadcrumb: {
    fontSize: 10,
    letterSpacing: 2,
    color: "#64748b",
    marginBottom: 8,
    fontWeight: 700,
  },

  title: {
    margin: 0,
    fontSize: 30,
    fontWeight: 800,
    letterSpacing: -0.8,
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#7f8ca3",
    fontSize: 13,
  },

  liveBox: {
    padding: "9px 14px",
    borderRadius: 10,
    border: "1px solid rgba(77,212,168,0.28)",
    background: "rgba(77,212,168,0.07)",
    color: "#4dd4a8",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1,
  },

  liveDot: {
    display: "inline-block",
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#4dd4a8",
    marginRight: 7,
    boxShadow: "0 0 10px rgba(77,212,168,0.8)",
  },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(6, minmax(130px, 1fr))",
    gap: 12,
    marginBottom: 16,
  },

  kpi: {
    minHeight: 118,
    padding: 16,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(145deg, rgba(24,31,48,0.95), rgba(12,17,29,0.95))",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.18)",
  },

  kpiTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  kpiLabel: {
    color: "#738198",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 1,
  },

  kpiIcon: {
    fontSize: 17,
    fontWeight: 900,
  },

  kpiValue: {
    fontSize: 29,
    fontWeight: 800,
    marginTop: 12,
  },

  kpiDetail: {
    color: "#68758a",
    fontSize: 10,
    marginTop: 4,
  },

  panel: {
    padding: 18,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(145deg, rgba(19,25,40,0.96), rgba(10,15,26,0.96))",
    marginBottom: 16,
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.15)",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  panelTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
  },

  panelSubtitle: {
    margin: "5px 0 0",
    color: "#6f7d93",
    fontSize: 11,
  },

  liveBadge: {
    color: "#4dd4a8",
    fontSize: 9,
    fontWeight: 900,
    padding: "5px 9px",
    borderRadius: 6,
    background: "rgba(77,212,168,0.08)",
    border: "1px solid rgba(77,212,168,0.2)",
  },

  incidentGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 12,
  },

  incidentCard: {
    textAlign: "left",
    color: "#eaf3ff",
    padding: 15,
    borderRadius: 12,
    background: "rgba(9,14,25,0.7)",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  incidentTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  incidentId: {
    color: "#66758b",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 0.8,
  },

  severityBadge: {
    border: "1px solid",
    borderRadius: 6,
    padding: "4px 6px",
    fontSize: 8,
    fontWeight: 900,
    letterSpacing: 0.5,
  },

  incidentThreat: {
    fontSize: 13,
    margin: "14px 0 10px",
    lineHeight: 1.4,
  },

  incidentInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    color: "#7b879a",
    fontSize: 10,
  },

  riskRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 15,
    fontSize: 10,
    color: "#7d899d",
  },

  progressBackground: {
    width: "100%",
    height: 5,
    background: "rgba(255,255,255,0.07)",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 7,
  },

  progressFill: {
    height: "100%",
    borderRadius: 20,
    transition: "width 0.5s ease",
  },

  incidentBottom: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 12,
    fontSize: 9,
    color: "#66758a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns: "1.35fr 0.65fr",
    gap: 16,
  },

  playbookGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },

  playbook: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    textAlign: "left",
    color: "#eaf3ff",
    padding: 12,
    borderRadius: 11,
    border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(7,12,22,0.55)",
    cursor: "pointer",
  },

  playbookIcon: {
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    border: "1px solid",
    fontSize: 17,
    flexShrink: 0,
  },

  playbookText: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },

  playbookTextStrong: {
    fontSize: 11,
  },

  playbookTextSpan: {
    fontSize: 9,
    color: "#68768a",
  },

  playbookArrow: {
    color: "#536176",
    fontSize: 17,
  },

  targetBox: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    borderRadius: 11,
    border: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
  },

  targetRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 15,
    padding: "10px 12px",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
    fontSize: 10,
  },

  targetRowSpan: {
    color: "#66758a",
  },

  targetRowStrong: {
    color: "#dce8f8",
    textAlign: "right",
  },

  containmentBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    background: "rgba(66,217,255,0.04)",
    border: "1px solid rgba(66,217,255,0.1)",
  },

  containmentHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 10,
    color: "#78869b",
  },

  lifecycle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  lifecycleStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    minWidth: 90,
  },

  lifecycleNumber: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 900,
    marginBottom: 7,
  },

  connector: {
    height: 1,
    flex: 1,
    background:
      "linear-gradient(90deg, #42d9ff, rgba(255,255,255,0.08))",
  },

  timeline: {
    display: "flex",
    flexDirection: "column",
  },

  timelineItem: {
    display: "grid",
    gridTemplateColumns:
      "12px 80px 1fr 90px",
    alignItems: "center",
    gap: 12,
    minHeight: 55,
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
  },

  timelineDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#42d9ff",
    boxShadow:
      "0 0 10px rgba(66,217,255,0.8)",
  },

  timelineTime: {
    color: "#65738a",
    fontSize: 10,
    fontFamily: "monospace",
  },

  timelineContent: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  timelineContentStrong: {
    fontSize: 11,
  },

  timelineContentSpan: {
    color: "#68768a",
    fontSize: 9,
  },

  resultBadge: {
    justifySelf: "end",
    border: "1px solid",
    borderRadius: 6,
    padding: "5px 7px",
    fontSize: 8,
    fontWeight: 900,
  },

  updatedText: {
    color: "#56647a",
    fontSize: 9,
  },

  analyticsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 12,
  },

  analyticsCard: {
    padding: 16,
    borderRadius: 13,
    border: "1px solid rgba(255,255,255,0.07)",
    background:
      "linear-gradient(145deg, rgba(20,27,43,0.9), rgba(9,14,25,0.9))",
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },

  analyticsTitle: {
    color: "#748196",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 0.7,
  },

  analyticsValue: {
    fontSize: 25,
    marginTop: 5,
  },

  analyticsChange: {
    color: "#4dd4a8",
    fontSize: 10,
    fontWeight: 800,
  },

  analyticsDescription: {
    color: "#5d6b80",
    fontSize: 9,
  },

  footer: {
    textAlign: "center",
    color: "#3e4b5e",
    fontSize: 9,
    marginTop: 24,
    letterSpacing: 0.5,
  },
};