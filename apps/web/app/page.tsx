"use client";

import ThreatMonitoringDummy from "./ThreatMonitoringDummy";
import SecurityEventsDummy from "./SecurityEventsDummy";
import RiskAnalyticsDummy from "./RiskAnalyticsDummy";
import DetectionEngineDummy from "./DetectionEngineDummy";
import ResponseCenterDummy from "./ResponseCenterDummy";
import UsersManagementDummy from "./UsersManagementDummy";
import AuditLogsDummy from "./AuditLogsDummy";
import SettingsControlCenterDummy from "./SettingsControlCenterDummy";
import { useEffect, useMemo, useState } from "react";


type View =
  | "dashboard"
  | "threats"
  | "events"
  | "systems"
  | "analytics"
  | "detection"
  | "response"
  | "users"
  | "audit"
  | "settings";

type SecurityEvent = {
  id: number;
  system_id: number;
  event_type: string;
  severity: string;
  source_ip: string | null;
  destination_ip: string | null;
  description: string | null;
  status: string;
  detected_at: string;
  created_at?: string;
};

type SystemRecord = {
  id: number;
  name: string;
  status: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_in: number;
  network_out: number;
  uptime_seconds: number;
  last_heartbeat: string;
  created_at?: string;
  updated_at?: string;
};

const API_URL = "http://127.0.0.1:8000";
const DETECTION_URL = "http://127.0.0.1:8001";

export default function Dashboard() {
  const [activeView, setActiveView] =
    useState<View>("dashboard");

  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [systems, setSystems] =
    useState<SystemRecord[]>([]);

  const [apiStatus, setApiStatus] =
    useState("Checking...");

  const [detectionStatus, setDetectionStatus] =
    useState("Checking...");

  const [loading, setLoading] =
    useState(true);

  const [lastUpdated, setLastUpdated] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [severityFilter, setSeverityFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [detectionResult, setDetectionResult] =
    useState<any>(null);

  const [detecting, setDetecting] =
    useState(false);

  const [detectionForm, setDetectionForm] =
    useState({
      system_id: "3",
      source_ip: "192.168.1.50",
      destination_port: "3389",
      request_count: "150",
      failed_requests: "100",
    });

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkDetectionService();
  }, []);

  async function loadDashboard() {
    try {
      const [
        securityResponse,
        systemsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/security/`, {
          cache: "no-store",
        }),

        fetch(`${API_URL}/systems/`, {
          cache: "no-store",
        }),
      ]);

      if (
        !securityResponse.ok ||
        !systemsResponse.ok
      ) {
        throw new Error(
          "API request failed"
        );
      }

      const securityData: SecurityEvent[] =
        await securityResponse.json();

      const systemsData: SystemRecord[] =
        await systemsResponse.json();

      setEvents(securityData);
      setSystems(systemsData);

      setApiStatus("ONLINE");

      setLastUpdated(
        new Date().toLocaleTimeString()
      );
    } catch (error) {
      console.error(
        "Dashboard API error:",
        error
      );

      setApiStatus("OFFLINE");
    } finally {
      setLoading(false);
    }
  }

  async function checkDetectionService() {
    try {
      const response = await fetch(
        `${DETECTION_URL}/health`,
        {
          cache: "no-store",
        }
      );

      if (response.ok) {
        setDetectionStatus("ONLINE");
      } else {
        setDetectionStatus("OFFLINE");
      }
    } catch {
      setDetectionStatus("OFFLINE");
    }
  }

  async function runDetection() {
    setDetecting(true);
    setDetectionResult(null);

    try {
      const response = await fetch(
        `${DETECTION_URL}/detect`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            system_id: Number(
              detectionForm.system_id
            ),

            source_ip:
              detectionForm.source_ip,

            destination_port: Number(
              detectionForm.destination_port
            ),

            request_count: Number(
              detectionForm.request_count
            ),

            failed_requests: Number(
              detectionForm.failed_requests
            ),
          }),
        }
      );

      const data = await response.json();

      setDetectionResult(data);

      if (response.ok) {
        setDetectionStatus("ONLINE");

        await loadDashboard();
      }
    } catch (error) {
      console.error(
        "Detection error:",
        error
      );

      setDetectionResult({
        error:
          "Detection service is unavailable.",
      });

      setDetectionStatus("OFFLINE");
    } finally {
      setDetecting(false);
    }
  }

  /* ======================================================
     STATISTICS
  ====================================================== */

  const criticalEvents = events.filter(
    (event) =>
      event.severity.toUpperCase() ===
      "HIGH"
  ).length;

  const mediumEvents = events.filter(
    (event) =>
      event.severity.toUpperCase() ===
      "MEDIUM"
  ).length;

  const lowEvents = events.filter(
    (event) =>
      event.severity.toUpperCase() ===
      "LOW"
  ).length;

  const openEvents = events.filter(
    (event) =>
      event.status.toUpperCase() ===
      "OPEN"
  ).length;

  const resolvedEvents = events.filter(
    (event) =>
      event.status.toUpperCase() ===
        "RESOLVED" ||
      event.status.toUpperCase() ===
        "CLOSED"
  ).length;

  const activeSystems = systems.filter(
    (system) =>
      system.status.toLowerCase() ===
      "active"
  ).length;

  /* ======================================================
     RISK SCORE
  ====================================================== */

  const riskScore = useMemo(() => {
    if (events.length === 0) {
      return 0;
    }

    const score =
      criticalEvents * 10 +
      mediumEvents * 5 +
      lowEvents +
      openEvents * 3;

    return Math.min(score, 100);
  }, [
    events.length,
    criticalEvents,
    mediumEvents,
    lowEvents,
    openEvents,
  ]);

  let riskLevel = "LOW";

  if (riskScore >= 70) {
    riskLevel = "CRITICAL";
  } else if (riskScore >= 40) {
    riskLevel = "HIGH";
  } else if (riskScore >= 20) {
    riskLevel = "MEDIUM";
  }

  const riskDegrees =
    riskScore * 3.6;

  const riskClass =
    riskLevel.toLowerCase();

  /* ======================================================
     SYSTEM ANALYTICS
  ====================================================== */

  const averageCPU =
    systems.length > 0
      ? systems.reduce(
          (sum, system) =>
            sum + system.cpu_usage,
          0
        ) / systems.length
      : 0;

  const averageMemory =
    systems.length > 0
      ? systems.reduce(
          (sum, system) =>
            sum + system.memory_usage,
          0
        ) / systems.length
      : 0;

  const averageDisk =
    systems.length > 0
      ? systems.reduce(
          (sum, system) =>
            sum + system.disk_usage,
          0
        ) / systems.length
      : 0;

  /* ======================================================
     THREAT DISTRIBUTION
  ====================================================== */

  const totalThreats =
    events.length;

  const highPercentage =
    totalThreats > 0
      ? Math.round(
          (criticalEvents /
            totalThreats) *
            100
        )
      : 0;

  const mediumPercentage =
    totalThreats > 0
      ? Math.round(
          (mediumEvents /
            totalThreats) *
            100
        )
      : 0;

  const lowPercentage =
    totalThreats > 0
      ? Math.round(
          (lowEvents /
            totalThreats) *
            100
        )
      : 0;

  /* ======================================================
     FILTERED EVENTS
  ====================================================== */

  const filteredEvents =
    events.filter((event) => {
      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        event.event_type
          .toLowerCase()
          .includes(search) ||
        (event.source_ip || "")
          .toLowerCase()
          .includes(search) ||
        String(event.system_id)
          .includes(search);

      const matchesSeverity =
        severityFilter === "ALL" ||
        event.severity.toUpperCase() ===
          severityFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        event.status.toUpperCase() ===
          statusFilter;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus
      );
    });

  /* ======================================================
     24 HOUR ANALYTICS
  ====================================================== */

  const hourlyThreats = useMemo(() => {
    const hours = Array.from(
      { length: 24 },
      (_, index) => ({
        hour: index,
        count: 0,
      })
    );

    const now = Date.now();

    events.forEach((event) => {
      const detectedTime =
        new Date(
          event.detected_at
        ).getTime();

      if (
        Number.isNaN(detectedTime)
      ) {
        return;
      }

      const difference =
        now - detectedTime;

      const hoursAgo =
        difference /
        (1000 * 60 * 60);

      if (
        hoursAgo >= 0 &&
        hoursAgo < 24
      ) {
        const bucket =
          23 -
          Math.floor(hoursAgo);

        if (
          bucket >= 0 &&
          bucket < 24
        ) {
          hours[bucket].count += 1;
        }
      }
    });

    return hours;
  }, [events]);

  const maxHourlyThreats =
    Math.max(
      ...hourlyThreats.map(
        (item) => item.count
      ),
      1
    );

  /* ======================================================
     NAVIGATION
  ====================================================== */

  function navigate(view: View) {
    setActiveView(view);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* ======================================================
     SIDEBAR
  ====================================================== */

  const navigation = (
    <aside className="sidebar">

      <div className="brand">

        <div className="brand-mark">
          A
        </div>

        <div>
          <div className="brand-name">
            AEGISDRP
          </div>

          <div className="brand-subtitle">
            DIGITAL RISK PROTECTION
          </div>
        </div>

      </div>

      <nav className="navigation">

        <div className="nav-section">
          OVERVIEW
        </div>

        <button
          className={`nav-item ${
            activeView === "dashboard"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("dashboard")
          }
        >
          <span>◈</span>
          Dashboard
        </button>

        <button
          className={`nav-item ${
            activeView === "threats"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("threats")
          }
        >
          <span>⚠</span>
          Threat Monitoring
        </button>

        <button
          className={`nav-item ${
            activeView === "events"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("events")
          }
        >
          <span>◉</span>
          Security Events
        </button>

        <button
          className={`nav-item ${
            activeView === "systems"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("systems")
          }
        >
          <span>▣</span>
          Systems
        </button>

        <div className="nav-section">
          ANALYTICS
        </div>

        <button
          className={`nav-item ${
            activeView === "analytics"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("analytics")
          }
        >
          <span>◒</span>
          Risk Analytics
        </button>

        <button
          className={`nav-item ${
            activeView === "detection"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("detection")
          }
        >
          <span>⌁</span>
          Detection Engine
        </button>

        <button
          className={`nav-item ${
            activeView === "response"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("response")
          }
        >
          <span>↯</span>
          Response Center
        </button>

        <div className="nav-section">
          MANAGEMENT
        </div>

        <button
          className={`nav-item ${
            activeView === "users"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("users")
          }
        >
          <span>♙</span>
          Users
        </button>

        <button
          className={`nav-item ${
            activeView === "audit"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("audit")
          }
        >
          <span>▤</span>
          Audit Logs
        </button>

        <button
          className={`nav-item ${
            activeView === "settings"
              ? "active"
              : ""
          }`}
          onClick={() =>
            navigate("settings")
          }
        >
          <span>⚙</span>
          Settings
        </button>

      </nav>

      <div className="sidebar-bottom">

        <div className="security-status">

          <div className="status-dot"></div>

          <div>
            <strong>
              Protection Active
            </strong>

            <span>
              AEGIS security layer
            </span>
          </div>

        </div>

        <div className="user-profile">

          <div className="avatar">
            DS
          </div>

          <div>
            <strong>
              Administrator
            </strong>

            <span>
              Security Operations
            </span>
          </div>

        </div>

      </div>

    </aside>
  );

  /* ======================================================
     TOPBAR
  ====================================================== */

  const topbar = (
    <header className="topbar">

      <div>

        <div className="breadcrumb">
          AEGISDRP /{" "}
          {activeView.toUpperCase()}
        </div>

        <h1>
          {activeView ===
            "dashboard" &&
            "Security Command Center"}

          {activeView ===
            "threats" &&
            "Threat Monitoring"}

          {activeView ===
            "events" &&
            "Security Event Management"}

          {activeView ===
            "systems" &&
            "System Monitoring"}

          {activeView ===
            "analytics" &&
            "Risk Analytics"}

          {activeView ===
            "detection" &&
            "Detection Engine"}

          {activeView ===
            "response" &&
            "Response Center"}

          {activeView ===
            "users" &&
            "User Management"}

          {activeView ===
            "audit" &&
            "Audit Logs"}

          {activeView ===
            "settings" &&
            "Platform Settings"}
        </h1>

        <p>
          Autonomous digital risk monitoring and protection
        </p>

      </div>

      <div className="topbar-actions">

        <div className="system-indicator">

          <span
            className={
              apiStatus === "ONLINE"
                ? "online-dot"
                : "offline-dot"
            }
          ></span>

          API {apiStatus}

        </div>

        <button
          className="refresh-button"
          onClick={loadDashboard}
        >
          ↻ Refresh
        </button>

        <div className="notification">

          ◇

          {openEvents > 0 && (
            <span className="notification-badge">
              {openEvents}
            </span>
          )}

        </div>

      </div>

    </header>
  );

  /* ======================================================
     DASHBOARD VIEW
  ====================================================== */

  function DashboardView() {
    return (
      <>
        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-header">
              <span>
                Total Threats
              </span>

              <div className="stat-icon danger">
                ⚠
              </div>
            </div>

            <div className="stat-value">
              {events.length}
            </div>

            <div className="stat-description">
              Security events detected
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-header">
              <span>
                High Risk
              </span>

              <div className="stat-icon critical">
                !
              </div>
            </div>

            <div className="stat-value critical-text">
              {criticalEvents}
            </div>

            <div className="stat-description">
              Critical security threats
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-header">
              <span>
                Medium Risk
              </span>

              <div className="stat-icon warning">
                ◐
              </div>
            </div>

            <div className="stat-value warning-text">
              {mediumEvents}
            </div>

            <div className="stat-description">
              Requires investigation
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-header">
              <span>
                Protected Systems
              </span>

              <div className="stat-icon success">
                ✓
              </div>
            </div>

            <div className="stat-value success-text">
              {activeSystems}
            </div>

            <div className="stat-description">
              Active protected assets
            </div>

          </div>

        </section>

        <section className="dashboard-grid">

          <div className="panel threat-panel">

            <div className="panel-header">

              <div>
                <h2>
                  Threat Activity
                </h2>

                <p>
                  Real-time security activity · Last 24 hours
                </p>
              </div>

              <div>
                <span className="live-badge">
                  ● LIVE
                </span>

                {lastUpdated && (
                  <div className="last-updated">
                    Updated {lastUpdated}
                  </div>
                )}
              </div>

            </div>

            <div className="threat-chart">

              <div className="chart-grid">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="real-chart-bars">

                {hourlyThreats.map(
                  (item, index) => {

                    const height =
                      item.count === 0
                        ? 4
                        : Math.max(
                            8,
                            (item.count /
                              maxHourlyThreats) *
                              100
                          );

                    return (
                      <div
                        className="chart-bar-wrapper"
                        key={index}
                      >
                        <div
                          className="chart-bar"
                          style={{
                            height:
                              `${height}%`,
                          }}
                          title={`${item.count} threat(s)`}
                        />
                      </div>
                    );
                  }
                )}

              </div>

              <div className="chart-labels">
                <span>-24h</span>
                <span>-20h</span>
                <span>-16h</span>
                <span>-12h</span>
                <span>-8h</span>
                <span>-4h</span>
                <span>NOW</span>
              </div>

            </div>

          </div>

          <div className="panel risk-panel">

            <div className="panel-header">

              <div>
                <h2>
                  Risk Score
                </h2>

                <p>
                  Current environment risk
                </p>
              </div>

            </div>

            <div
              className={`risk-circle ${riskClass}`}
              style={{
                background:
                  `conic-gradient(
                    ${
                      riskLevel ===
                      "CRITICAL"
                        ? "#ef4444"
                        : riskLevel ===
                          "HIGH"
                        ? "#f97316"
                        : riskLevel ===
                          "MEDIUM"
                        ? "#eab308"
                        : "#22c55e"
                    }
                    ${riskDegrees}deg,
                    rgba(255,255,255,0.06)
                    ${riskDegrees}deg
                  )`,
              }}
            >

              <div className="risk-circle-inner">

                <strong>
                  {riskScore}
                </strong>

                <span>
                  / 100
                </span>

                <small>
                  {riskLevel} RISK
                </small>

              </div>

            </div>

            <div className="risk-details">

              <div>
                <span>High</span>
                <strong>
                  {criticalEvents}
                </strong>
              </div>

              <div>
                <span>Medium</span>
                <strong>
                  {mediumEvents}
                </strong>
              </div>

              <div>
                <span>Open</span>
                <strong>
                  {openEvents}
                </strong>
              </div>

            </div>

          </div>

        </section>

        <section className="analytics-strip">

          <div className="analytics-card">

            <div className="analytics-card-header">

              <div>
                <h3>
                  Threat Distribution
                </h3>

                <p>
                  Severity breakdown
                </p>
              </div>

              <strong>
                {totalThreats}
              </strong>

            </div>

            <div className="distribution-bar">

              <div
                className="distribution-high"
                style={{
                  width:
                    `${highPercentage}%`,
                }}
              />

              <div
                className="distribution-medium"
                style={{
                  width:
                    `${mediumPercentage}%`,
                }}
              />

              <div
                className="distribution-low"
                style={{
                  width:
                    `${lowPercentage}%`,
                }}
              />

            </div>

            <div className="distribution-legend">

              <span>
                <i className="legend-high" />
                High {highPercentage}%
              </span>

              <span>
                <i className="legend-medium" />
                Medium {mediumPercentage}%
              </span>

              <span>
                <i className="legend-low" />
                Low {lowPercentage}%
              </span>

            </div>

          </div>

          <div className="analytics-card">

            <div className="analytics-card-header">

              <div>
                <h3>
                  Event Resolution
                </h3>

                <p>
                  Current response state
                </p>
              </div>

              <strong>
                {totalThreats}
              </strong>

            </div>

            <div className="resolution-stats">

              <div>
                <span>Open</span>

                <strong className="critical-text">
                  {openEvents}
                </strong>
              </div>

              <div>
                <span>Resolved</span>

                <strong className="success-text">
                  {resolvedEvents}
                </strong>
              </div>

            </div>

          </div>

        </section>

        <section className="lower-grid">

          <div className="panel events-panel">

            <div className="panel-header">

              <div>
                <h2>
                  Recent Security Events
                </h2>

                <p>
                  Latest detections from the AEGISDRP engine
                </p>
              </div>

              <button
                className="view-button"
                onClick={() =>
                  navigate("events")
                }
              >
                View All →
              </button>

            </div>

            {events.length === 0 ? (

              <div className="empty-state">
                No security events detected.
              </div>

            ) : (

              <div className="events-list">

                {events
                  .slice(0, 6)
                  .map((event) => (

                    <div
                      className="event-row"
                      key={event.id}
                    >

                      <div
                        className={`severity-indicator ${event.severity.toLowerCase()}`}
                      />

                      <div className="event-main">

                        <strong>
                          {event.event_type}
                        </strong>

                        <span>
                          {event.source_ip ||
                            "Unknown source"}
                          {" → "}
                          System #
                          {event.system_id}
                        </span>

                      </div>

                      <div
                        className={`severity-label ${event.severity.toLowerCase()}`}
                      >
                        {event.severity}
                      </div>

                      <div className="event-status">
                        {event.status}
                      </div>

                    </div>

                  ))}

              </div>

            )}

          </div>

          <SystemsPanel />

        </section>
      </>
    );
  }

  /* ======================================================
     SYSTEM PANEL
  ====================================================== */

  function SystemsPanel() {
    return (
      <div className="panel systems-panel">

        <div className="panel-header">

          <div>
            <h2>
              Protected Systems
            </h2>

            <p>
              Connected infrastructure
            </p>
          </div>

          <button
            className="view-button"
            onClick={() =>
              navigate("systems")
            }
          >
            Manage →
          </button>

        </div>

        {systems.length === 0 ? (

          <div className="empty-state small">
            No systems registered.
          </div>

        ) : (

          <div className="systems-list">

            {systems
              .slice(0, 6)
              .map((system) => (

                <div
                  className="system-row"
                  key={system.id}
                >

                  <div className="system-icon">
                    ◉
                  </div>

                  <div className="system-info">

                    <strong>
                      {system.name}
                    </strong>

                    <span>
                      System ID: {system.id}
                    </span>

                  </div>

                  <div className="system-status">

                    <span className="system-dot"></span>

                    {system.status}

                  </div>

                </div>

              ))}

          </div>

        )}

      </div>
    );
  }

  /* ======================================================
     THREAT MONITORING
  ====================================================== */

  function ThreatMonitoring() {
    return <ThreatMonitoringDummy  /> ;

  }

  /* ======================================================
     SECURITY EVENTS
  ====================================================== */

  function SecurityEvents() {
    return <SecurityEventsDummy />;

  }

  /* ======================================================
     SYSTEM MONITORING
  ====================================================== */

  function SystemMonitoring() {
    return (
      <>

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-header">
              <span>
                AVG CPU
              </span>
              <div className="stat-icon success">
                CPU
              </div>
            </div>

            <div className="stat-value">
              {averageCPU.toFixed(1)}%
            </div>

            <div className="stat-description">
              Across protected systems
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span>
                AVG MEMORY
              </span>
              <div className="stat-icon warning">
                RAM
              </div>
            </div>

            <div className="stat-value warning-text">
              {averageMemory.toFixed(1)}%
            </div>

            <div className="stat-description">
              Memory utilization
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span>
                AVG DISK
              </span>
              <div className="stat-icon danger">
                DISK
              </div>
            </div>

            <div className="stat-value critical-text">
              {averageDisk.toFixed(1)}%
            </div>

            <div className="stat-description">
              Storage utilization
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span>
                SYSTEMS
              </span>
              <div className="stat-icon success">
                ✓
              </div>
            </div>

            <div className="stat-value success-text">
              {systems.length}
            </div>

            <div className="stat-description">
              Protected infrastructure
            </div>
          </div>

        </section>

        <section className="panel">

          <div className="panel-header">

            <div>
              <h2>
                System Monitoring
              </h2>

              <p>
                Real-time infrastructure health and resource utilization
              </p>
            </div>

            <span className="live-badge">
              ● LIVE
            </span>

          </div>

          <div className="system-monitor-grid">

            {systems.map((system) => {

              const heartbeat =
                new Date(
                  system.last_heartbeat
                ).getTime();

              const heartbeatAge =
                Date.now() -
                heartbeat;

              const online =
                heartbeatAge <
                30000 &&
                system.status.toLowerCase() ===
                  "active";

              return (
                <div
                  className="monitor-card"
                  key={system.id}
                >

                  <div className="monitor-card-top">

                    <div className="system-icon">
                      ◉
                    </div>

                    <div>
                      <strong>
                        {system.name}
                      </strong>

                      <span>
                        System #{system.id}
                      </span>
                    </div>

                    <span
                      className={
                        online
                          ? "monitor-online"
                          : "monitor-offline"
                      }
                    >
                      ●{" "}
                      {online
                        ? "LIVE"
                        : "OFFLINE"}
                    </span>

                  </div>

                  <div className="metric-line">
                    <span>CPU</span>
                    <strong>
                      {system.cpu_usage.toFixed(1)}%
                    </strong>
                  </div>

                  <div className="metric-progress">
                    <div
                      style={{
                        width:
                          `${Math.min(
                            system.cpu_usage,
                            100
                          )}%`,
                      }}
                    />
                  </div>

                  <div className="metric-line">
                    <span>MEMORY</span>
                    <strong>
                      {system.memory_usage.toFixed(1)}%
                    </strong>
                  </div>

                  <div className="metric-progress">
                    <div
                      style={{
                        width:
                          `${Math.min(
                            system.memory_usage,
                            100
                          )}%`,
                      }}
                    />
                  </div>

                  <div className="metric-line">
                    <span>DISK</span>
                    <strong>
                      {system.disk_usage.toFixed(1)}%
                    </strong>
                  </div>

                  <div className="metric-progress">
                    <div
                      style={{
                        width:
                          `${Math.min(
                            system.disk_usage,
                            100
                          )}%`,
                      }}
                    />
                  </div>

                  <div className="monitor-network">

                    <span>
                      NET IN{" "}
                      {system.network_in.toFixed(2)}
                      {" MB"}
                    </span>

                    <span>
                      NET OUT{" "}
                      {system.network_out.toFixed(2)}
                      {" MB"}
                    </span>

                  </div>

                  <div className="monitor-footer">

                    <span>
                      Uptime{" "}
                      {formatUptime(
                        system.uptime_seconds
                      )}
                    </span>

                    <span>
                      Heartbeat{" "}
                      {online
                        ? "LIVE"
                        : "OFFLINE"}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        </section>

      </>
    );
  }

  /* ======================================================
     RISK ANALYTICS
  ====================================================== */

  function RiskAnalytics() {
    return <RiskAnalyticsDummy />

  }

  /* ======================================================
     DETECTION ENGINE
  ====================================================== */

  function DetectionEngine() {
    return <DetectionEngine />

        
  }

  /* ======================================================
     RESPONSE CENTER
  ====================================================== */

  function ResponseCenter() {
    return <ResponseCenterDummy /> 

  }

  /* ======================================================
     USERS
  ====================================================== */

  function UsersView() {
    return <UsersManagementDummy />
  }

   /* ======================================================
     AuditLogs
  ====================================================== */

  function AuditLogs() {
  return <AuditLogsDummy />;
  }
  
  /* ======================================================
     SETTINGS
  ====================================================== */

  function SettingsView() {
    return 
      <SettingsControlCenterDummy />
  }

  /* ======================================================
     MAIN VIEW
  ====================================================== */

  function renderView() {

    switch (activeView) {

      case "threats":
        return <ThreatMonitoring />;

      case "events":
        return <SecurityEvents />;

      case "systems":
        return <SystemMonitoring />;

      case "analytics":
        return <RiskAnalytics />;

      case "detection":
        return <DetectionEngine />;

      case "response":
        return <ResponseCenter />;

      case "users":
        return <UsersView />;

      case "audit":
        return <AuditLogs />;

      case "settings":
        return <SettingsView />;

      case "dashboard":
      default:
        return <DashboardView />;
    }
  }

  return (
    <main className="dashboard-shell">

      {navigation}

      <section className="main-content">

        {topbar}

        <div className="view-container">
          {renderView()}
        </div>

        <footer className="dashboard-footer">

          <span>
            AEGISDRP v0.1.0
          </span>

          <span>
            Autonomous Digital Risk Protection Platform
          </span>

          <span>
            System Status:{" "}
            <strong>
              {apiStatus}
            </strong>
          </span>

        </footer>

      </section>

    </main>
  );
}

/* ==========================================================
   HELPERS
========================================================== */

function formatUptime(
  seconds: number
) {
  if (!seconds || seconds <= 0) {
    return "0m";
  }

  const days =
    Math.floor(
      seconds / 86400
    );

  const hours =
    Math.floor(
      (seconds % 86400) /
        3600
    );

  const minutes =
    Math.floor(
      (seconds % 3600) /
        60
    );

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}