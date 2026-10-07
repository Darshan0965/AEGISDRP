"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Tab =
  | "overview"
  | "general"
  | "security"
  | "detection"
  | "response"
  | "notifications"
  | "integrations"
  | "logging"
  | "backup"
  | "advanced";

type SettingsState = {
  platformName: string;
  environment: string;
  timezone: string;
  organization: string;
  region: string;

  mfa: boolean;
  sessionProtection: boolean;
  privilegedMonitoring: boolean;
  bruteForceProtection: boolean;
  passwordProtection: boolean;
  suspiciousLoginDetection: boolean;
  ipReputation: boolean;

  anomalyDetection: boolean;
  behavioralAnalysis: boolean;
  portIntelligence: boolean;
  automaticScoring: boolean;
  trafficAnalysis: boolean;
  threatCorrelation: boolean;
  zeroDayDetection: boolean;
  modelMonitoring: boolean;

  autoContainment: boolean;
  isolateCritical: boolean;
  autoResolveLow: boolean;
  responseApproval: boolean;
  quarantineFiles: boolean;
  blockMaliciousIp: boolean;
  disableCompromisedAccount: boolean;

  emailAlerts: boolean;
  criticalAlerts: boolean;
  highAlerts: boolean;
  dailyDigest: boolean;
  webhookAlerts: boolean;
  systemHealthAlerts: boolean;

  threatIntel: boolean;
  apiMonitoring: boolean;
  externalSIEM: boolean;
  webhookIntegration: boolean;
  ticketingIntegration: boolean;

  auditLogging: boolean;
  immutableLogs: boolean;
  extendedRetention: boolean;
  adminActivityLogging: boolean;
  authenticationLogging: boolean;

  backupEnabled: boolean;
  encryptedBackup: boolean;
  automaticBackup: boolean;
};

const initialSettings: SettingsState = {
  platformName: "AEGISDRP",
  environment: "Production",
  timezone: "Asia/Kolkata",
  organization: "AEGISDRP Security Operations",
  region: "India / APAC",

  mfa: true,
  sessionProtection: true,
  privilegedMonitoring: true,
  bruteForceProtection: true,
  passwordProtection: true,
  suspiciousLoginDetection: true,
  ipReputation: true,

  anomalyDetection: true,
  behavioralAnalysis: true,
  portIntelligence: true,
  automaticScoring: true,
  trafficAnalysis: true,
  threatCorrelation: true,
  zeroDayDetection: true,
  modelMonitoring: true,

  autoContainment: true,
  isolateCritical: true,
  autoResolveLow: false,
  responseApproval: true,
  quarantineFiles: true,
  blockMaliciousIp: true,
  disableCompromisedAccount: false,

  emailAlerts: true,
  criticalAlerts: true,
  highAlerts: true,
  dailyDigest: true,
  webhookAlerts: false,
  systemHealthAlerts: true,

  threatIntel: true,
  apiMonitoring: true,
  externalSIEM: false,
  webhookIntegration: false,
  ticketingIntegration: false,

  auditLogging: true,
  immutableLogs: true,
  extendedRetention: true,
  adminActivityLogging: true,
  authenticationLogging: true,

  backupEnabled: true,
  encryptedBackup: true,
  automaticBackup: true,
};

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-label="Toggle setting"
      style={{
        width: 48,
        height: 25,
        padding: 3,
        border: "none",
        borderRadius: 30,
        cursor: "pointer",
        background: enabled
          ? "linear-gradient(90deg,#0284c7,#38bdf8)"
          : "#263244",
        display: "flex",
        alignItems: "center",
        justifyContent: enabled ? "flex-end" : "flex-start",
        transition: "all .2s ease",
        boxShadow: enabled
          ? "0 0 15px rgba(56,189,248,.18)"
          : "none",
      }}
    >
      <span
        style={{
          width: 19,
          height: 19,
          borderRadius: "50%",
          background: "#ffffff",
          boxShadow: "0 2px 6px rgba(0,0,0,.35)",
        }}
      />
    </button>
  );
}

function StatusBadge({
  text,
  color = "#4ade80",
}: {
  text: string;
  color?: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 9px",
        borderRadius: 7,
        background: `${color}12`,
        border: `1px solid ${color}30`,
        color,
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: ".04em",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      {text}
    </span>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(145deg,#151b2b 0%,#101621 100%)",
        border: "1px solid rgba(148,163,184,.12)",
        borderRadius: 16,
        padding: 21,
        marginBottom: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,.12)",
      }}
    >
      <div
        style={{
          marginBottom: 15,
        }}
      >
        <div
          style={{
            color: "#eef4fc",
            fontSize: 15,
            fontWeight: 800,
            marginBottom: 5,
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: "#68778d",
            fontSize: 10,
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>

      {children}
    </div>
  );
}

function SettingRow({
  title,
  description,
  children,
  last = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        padding: "15px 0",
        borderBottom: last
          ? "none"
          : "1px solid rgba(148,163,184,.065)",
      }}
    >
      <div
        style={{
          minWidth: 0,
        }}
      >
        <div
          style={{
            color: "#dce5f3",
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: "#69778d",
            fontSize: 10,
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function InputField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: 200,
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "#0b111c",
        border: "1px solid rgba(148,163,184,.15)",
        borderRadius: 8,
        padding: "9px 11px",
        color: "#e7eef8",
        fontSize: 11,
        outline: "none",
      }}
    />
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: 200,
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "#0b111c",
        border: "1px solid rgba(148,163,184,.15)",
        borderRadius: 8,
        padding: "9px 11px",
        color: "#e7eef8",
        fontSize: 11,
        outline: "none",
      }}
    >
      {options.map((option) => (
        <option
          key={option}
          value={option}
          style={{
            background: "#0b111c",
          }}
        >
          {option}
        </option>
      ))}
    </select>
  );
}

function Progress({
  value,
  color = "#38bdf8",
}: {
  value: number;
  color?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: 6,
        background: "#1c2737",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: color,
          borderRadius: 20,
          boxShadow: `0 0 10px ${color}55`,
        }}
      />
    </div>
  );
}

export default function SettingsControlCenterDummy() {
  const [tab, setTab] = useState<Tab>("overview");
  const [settings, setSettings] =
    useState<SettingsState>(initialSettings);

  const [saved, setSaved] = useState(false);

  const update = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  };

  const saveConfiguration = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const resetConfiguration = () => {
    setSettings(initialSettings);
    setSaved(false);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "general", label: "General" },
    { id: "security", label: "Identity & Security" },
    { id: "detection", label: "Detection Engine" },
    { id: "response", label: "Response Policies" },
    { id: "notifications", label: "Notifications" },
    { id: "integrations", label: "Integrations" },
    { id: "logging", label: "Logging & Retention" },
    { id: "backup", label: "Backup & Recovery" },
    { id: "advanced", label: "Advanced" },
  ];

  return (
    <div
      style={{
        width: "100%",
        color: "#e8eef8",
        paddingBottom: 35,
      }}
    >
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 22,
        }}
      >
        <div>
          <div
            style={{
              color: "#68768c",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".14em",
              marginBottom: 7,
            }}
          >
            AEGISDRP / CONTROL CENTER
          </div>

          <h1
            style={{
              margin: 0,
              color: "#f4f7fc",
              fontSize: 29,
              fontWeight: 900,
            }}
          >
            Platform Settings
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#718097",
              fontSize: 12,
            }}
          >
            Autonomous digital risk monitoring and protection
            configuration
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            flexWrap: "wrap",
          }}
        >
          <StatusBadge text="PLATFORM HEALTHY" />

          <button
            type="button"
            onClick={resetConfiguration}
            style={{
              border: "1px solid rgba(148,163,184,.15)",
              background: "#121a27",
              color: "#9aa8bb",
              borderRadius: 8,
              padding: "10px 13px",
              cursor: "pointer",
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            RESET
          </button>

          <button
            type="button"
            onClick={saveConfiguration}
            style={{
              border: "none",
              background:
                "linear-gradient(135deg,#0284c7,#38bdf8)",
              color: "#ffffff",
              borderRadius: 8,
              padding: "10px 15px",
              cursor: "pointer",
              fontSize: 10,
              fontWeight: 900,
              boxShadow:
                "0 8px 22px rgba(14,165,233,.20)",
            }}
          >
            {saved
              ? "✓ CONFIGURATION SAVED"
              : "SAVE CONFIGURATION"}
          </button>
        </div>
      </div>

      {/* ====================================================== */}
      {/* TOP SECURITY POSTURE */}
      {/* ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(240px,1.4fr) repeat(4,minmax(150px,1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {/* POSTURE */}

        <div
          style={{
            background:
              "linear-gradient(145deg,rgba(14,165,233,.12),#111827)",
            border:
              "1px solid rgba(56,189,248,.20)",
            borderRadius: 15,
            padding: 18,
          }}
        >
          <div
            style={{
              color: "#728198",
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: ".08em",
            }}
          >
            SECURITY POSTURE
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 7,
              marginTop: 7,
            }}
          >
            <span
              style={{
                color: "#38bdf8",
                fontSize: 34,
                fontWeight: 900,
              }}
            >
              94
            </span>

            <span
              style={{
                color: "#6f7d92",
                fontSize: 11,
              }}
            >
              / 100
            </span>
          </div>

          <Progress
            value={94}
            color="#38bdf8"
          />

          <div
            style={{
              color: "#4ade80",
              fontSize: 9,
              fontWeight: 800,
              marginTop: 8,
            }}
          >
            EXCELLENT SECURITY POSTURE
          </div>
        </div>

        {[
          ["DETECTION", "ONLINE", "#4ade80"],
          ["RESPONSE", "ACTIVE", "#38bdf8"],
          ["DATABASE", "CONNECTED", "#a78bfa"],
          ["AUDIT", "99.9%", "#facc15"],
        ].map(([title, value, color]) => (
          <div
            key={title}
            style={{
              background:
                "linear-gradient(145deg,#151b2b,#101621)",
              border:
                "1px solid rgba(148,163,184,.12)",
              borderRadius: 15,
              padding: 18,
            }}
          >
            <div
              style={{
                color: "#68768b",
                fontSize: 9,
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              {title}
            </div>

            <div
              style={{
                color,
                fontSize: 16,
                fontWeight: 900,
              }}
            >
              ● {value}
            </div>
          </div>
        ))}
      </div>

      {/* ====================================================== */}
      {/* TABS */}
      {/* ====================================================== */}

      <div
        style={{
          display: "flex",
          gap: 4,
          overflowX: "auto",
          padding: 5,
          background: "#0b111b",
          border:
            "1px solid rgba(148,163,184,.10)",
          borderRadius: 11,
          marginBottom: 18,
        }}
      >
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            style={{
              flexShrink: 0,
              border: "none",
              borderRadius: 8,
              padding: "10px 13px",
              cursor: "pointer",
              background:
                tab === item.id
                  ? "rgba(14,165,233,.15)"
                  : "transparent",
              color:
                tab === item.id
                  ? "#38bdf8"
                  : "#718096",
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ====================================================== */}
      {/* OVERVIEW */}
      {/* ====================================================== */}

      {tab === "overview" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(210px,1fr))",
              gap: 13,
              marginBottom: 16,
            }}
          >
            {[
              {
                title: "Security Controls",
                value: "27 / 29",
                percent: 93,
                color: "#38bdf8",
              },
              {
                title: "Detection Coverage",
                value: "97%",
                percent: 97,
                color: "#4ade80",
              },
              {
                title: "Policy Compliance",
                value: "98%",
                percent: 98,
                color: "#a78bfa",
              },
              {
                title: "Audit Coverage",
                value: "99.9%",
                percent: 99.9,
                color: "#facc15",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background:
                    "linear-gradient(145deg,#151b2b,#101621)",
                  border:
                    "1px solid rgba(148,163,184,.12)",
                  borderRadius: 15,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    color: "#748198",
                    fontSize: 10,
                    fontWeight: 800,
                    marginBottom: 10,
                  }}
                >
                  {item.title.toUpperCase()}
                </div>

                <div
                  style={{
                    color: "#f1f5fb",
                    fontSize: 25,
                    fontWeight: 900,
                    marginBottom: 12,
                  }}
                >
                  {item.value}
                </div>

                <Progress
                  value={item.percent}
                  color={item.color}
                />
              </div>
            ))}
          </div>

          <SectionCard
            title="Security Control Center"
            description="High-level state of the major AEGISDRP protection layers."
          >
            <SettingRow
              title="Identity Protection"
              description="Authentication, MFA and privileged access controls."
            >
              <StatusBadge text="PROTECTED" />
            </SettingRow>

            <SettingRow
              title="Threat Detection"
              description="Behavioral, anomaly and traffic intelligence."
            >
              <StatusBadge text="ACTIVE" />
            </SettingRow>

            <SettingRow
              title="Automated Response"
              description="Threat containment and system isolation policies."
            >
              <StatusBadge
                text="ENABLED"
                color="#38bdf8"
              />
            </SettingRow>

            <SettingRow
              title="Audit & Compliance"
              description="Security events and administrative activity."
            >
              <StatusBadge
                text="MONITORED"
                color="#a78bfa"
              />
            </SettingRow>

            <SettingRow
              title="Backup Protection"
              description="Encrypted platform configuration backups."
              last
            >
              <StatusBadge
                text="PROTECTED"
                color="#facc15"
              />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Configuration Intelligence"
            description="Current configuration recommendations."
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: 12,
              }}
            >
              {[
                [
                  "MFA Coverage",
                  "100%",
                  "All privileged accounts protected",
                  "#4ade80",
                ],
                [
                  "Detection Models",
                  "8 ACTIVE",
                  "All primary models operational",
                  "#38bdf8",
                ],
                [
                  "Retention",
                  "180 DAYS",
                  "Extended investigation window",
                  "#a78bfa",
                ],
                [
                  "Backup Status",
                  "HEALTHY",
                  "Latest encrypted backup verified",
                  "#facc15",
                ],
              ].map(([title, value, desc, color]) => (
                <div
                  key={title}
                  style={{
                    padding: 15,
                    borderRadius: 11,
                    background:
                      "rgba(255,255,255,.018)",
                    border:
                      "1px solid rgba(148,163,184,.08)",
                  }}
                >
                  <div
                    style={{
                      color: "#718096",
                      fontSize: 9,
                      fontWeight: 800,
                    }}
                  >
                    {title}
                  </div>

                  <div
                    style={{
                      color,
                      fontSize: 16,
                      fontWeight: 900,
                      marginTop: 7,
                    }}
                  >
                    {value}
                  </div>

                  <div
                    style={{
                      color: "#647289",
                      fontSize: 9,
                      marginTop: 6,
                    }}
                  >
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {/* ====================================================== */}
      {/* GENERAL */}
      {/* ====================================================== */}

      {tab === "general" && (
        <>
          <SectionCard
            title="Platform Configuration"
            description="Core identity and deployment configuration."
          >
            <SettingRow
              title="Platform Name"
              description="Display name used throughout the security console."
            >
              <InputField
                value={settings.platformName}
                onChange={(value) =>
                  update("platformName", value)
                }
              />
            </SettingRow>

            <SettingRow
              title="Organization"
              description="Organization or security operations group."
            >
              <InputField
                value={settings.organization}
                onChange={(value) =>
                  update("organization", value)
                }
              />
            </SettingRow>

            <SettingRow
              title="Environment"
              description="Current deployment environment."
            >
              <SelectField
                value={settings.environment}
                onChange={(value) =>
                  update("environment", value)
                }
                options={[
                  "Development",
                  "Staging",
                  "Production",
                ]}
              />
            </SettingRow>

            <SettingRow
              title="Region"
              description="Primary operational region."
            >
              <InputField
                value={settings.region}
                onChange={(value) =>
                  update("region", value)
                }
              />
            </SettingRow>

            <SettingRow
              title="Timezone"
              description="Timezone used for security events and audit records."
              last
            >
              <SelectField
                value={settings.timezone}
                onChange={(value) =>
                  update("timezone", value)
                }
                options={[
                  "Asia/Kolkata",
                  "UTC",
                  "Asia/Singapore",
                  "Europe/London",
                  "America/New_York",
                ]}
              />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Platform Services"
            description="Health state of core AEGISDRP services."
          >
            <SettingRow
              title="FastAPI Gateway"
              description="Primary REST API service on port 8000."
            >
              <StatusBadge text="ONLINE" />
            </SettingRow>

            <SettingRow
              title="PostgreSQL"
              description="Primary security and system data store."
            >
              <StatusBadge
                text="CONNECTED"
                color="#a78bfa"
              />
            </SettingRow>

            <SettingRow
              title="Detection Engine"
              description="Automated threat detection microservice on port 8001."
            >
              <StatusBadge
                text="ONLINE"
                color="#38bdf8"
              />
            </SettingRow>

            <SettingRow
              title="Audit Pipeline"
              description="Security event and administrative activity logging."
              last
            >
              <StatusBadge
                text="HEALTHY"
                color="#facc15"
              />
            </SettingRow>
          </SectionCard>
        </>
      )}

      {/* ====================================================== */}
      {/* SECURITY */}
      {/* ====================================================== */}

      {tab === "security" && (
        <>
          <SectionCard
            title="Identity & Access Protection"
            description="Authentication and account security controls."
          >
            <SettingRow
              title="Multi-Factor Authentication"
              description="Require an additional authentication factor for privileged access."
            >
              <Toggle
                enabled={settings.mfa}
                onChange={() =>
                  update("mfa", !settings.mfa)
                }
              />
            </SettingRow>

            <SettingRow
              title="Session Protection"
              description="Detect abnormal and potentially hijacked sessions."
            >
              <Toggle
                enabled={settings.sessionProtection}
                onChange={() =>
                  update(
                    "sessionProtection",
                    !settings.sessionProtection
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Privileged Activity Monitoring"
              description="Monitor administrator and privileged account actions."
            >
              <Toggle
                enabled={settings.privilegedMonitoring}
                onChange={() =>
                  update(
                    "privilegedMonitoring",
                    !settings.privilegedMonitoring
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Brute Force Protection"
              description="Detect repeated authentication failures and account attacks."
            >
              <Toggle
                enabled={settings.bruteForceProtection}
                onChange={() =>
                  update(
                    "bruteForceProtection",
                    !settings.bruteForceProtection
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Password Protection"
              description="Apply password security and account protection policies."
            >
              <Toggle
                enabled={settings.passwordProtection}
                onChange={() =>
                  update(
                    "passwordProtection",
                    !settings.passwordProtection
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Suspicious Login Detection"
              description="Identify unusual authentication locations and patterns."
            >
              <Toggle
                enabled={settings.suspiciousLoginDetection}
                onChange={() =>
                  update(
                    "suspiciousLoginDetection",
                    !settings.suspiciousLoginDetection
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="IP Reputation Protection"
              description="Evaluate source IP reputation during authentication."
              last
            >
              <Toggle
                enabled={settings.ipReputation}
                onChange={() =>
                  update(
                    "ipReputation",
                    !settings.ipReputation
                  )
                }
              />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Access Security Status"
            description="Current identity protection posture."
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(170px,1fr))",
                gap: 12,
              }}
            >
              {[
                ["MFA Coverage", "100%", "#4ade80"],
                ["Privileged Monitoring", "ACTIVE", "#38bdf8"],
                ["Session Protection", "ACTIVE", "#a78bfa"],
                ["IP Reputation", "ACTIVE", "#facc15"],
              ].map(([title, value, color]) => (
                <div
                  key={title}
                  style={{
                    padding: 15,
                    background:
                      "rgba(255,255,255,.018)",
                    border:
                      "1px solid rgba(148,163,184,.08)",
                    borderRadius: 11,
                  }}
                >
                  <div
                    style={{
                      color: "#718096",
                      fontSize: 9,
                      fontWeight: 800,
                    }}
                  >
                    {title}
                  </div>

                  <div
                    style={{
                      color,
                      fontSize: 15,
                      fontWeight: 900,
                      marginTop: 8,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {/* ====================================================== */}
      {/* DETECTION */}
      {/* ====================================================== */}

      {tab === "detection" && (
        <>
          <SectionCard
            title="Detection Engine Configuration"
            description="Configure AEGISDRP's autonomous threat detection pipeline."
          >
            <SettingRow
              title="Anomaly Detection"
              description="Identify deviations from expected traffic behavior."
            >
              <Toggle
                enabled={settings.anomalyDetection}
                onChange={() =>
                  update(
                    "anomalyDetection",
                    !settings.anomalyDetection
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Behavioral Analysis"
              description="Analyze entity behavior and detect unusual activity."
            >
              <Toggle
                enabled={settings.behavioralAnalysis}
                onChange={() =>
                  update(
                    "behavioralAnalysis",
                    !settings.behavioralAnalysis
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Port Intelligence"
              description="Identify suspicious and commonly abused destination ports."
            >
              <Toggle
                enabled={settings.portIntelligence}
                onChange={() =>
                  update(
                    "portIntelligence",
                    !settings.portIntelligence
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Automatic Risk Scoring"
              description="Calculate a unified risk score from multiple indicators."
            >
              <Toggle
                enabled={settings.automaticScoring}
                onChange={() =>
                  update(
                    "automaticScoring",
                    !settings.automaticScoring
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Network Traffic Analysis"
              description="Analyze network request and traffic telemetry."
            >
              <Toggle
                enabled={settings.trafficAnalysis}
                onChange={() =>
                  update(
                    "trafficAnalysis",
                    !settings.trafficAnalysis
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Threat Correlation"
              description="Correlate multiple indicators into unified incidents."
            >
              <Toggle
                enabled={settings.threatCorrelation}
                onChange={() =>
                  update(
                    "threatCorrelation",
                    !settings.threatCorrelation
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Advanced Threat Detection"
              description="Enable advanced detection for previously unseen patterns."
            >
              <Toggle
                enabled={settings.zeroDayDetection}
                onChange={() =>
                  update(
                    "zeroDayDetection",
                    !settings.zeroDayDetection
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Model Performance Monitoring"
              description="Track detection model confidence and performance."
              last
            >
              <Toggle
                enabled={settings.modelMonitoring}
                onChange={() =>
                  update(
                    "modelMonitoring",
                    !settings.modelMonitoring
                  )
                }
              />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Detection Thresholds"
            description="Current risk scoring thresholds used by the platform."
          >
            <div
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              {[
                ["LOW", "0 – 39", "#4ade80", 39],
                ["MEDIUM", "40 – 59", "#facc15", 59],
                ["HIGH", "60 – 79", "#fb923c", 79],
                ["CRITICAL", "80 – 100", "#ff6472", 100],
              ].map(([name, range, color, value]:
                    [string, string, string, number]) => (
                <div key={name}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        color,
                        fontSize: 10,
                        fontWeight: 800,
                      }}
                    >
                      {name}
                    </span>

                    <span
                      style={{
                        color: "#758298",
                        fontSize: 10,
                      }}
                    >
                      {range}
                    </span>
                  </div>

                  <Progress
                    value={Number(value)}
                    color={String(color)}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {/* ====================================================== */}
      {/* RESPONSE */}
      {/* ====================================================== */}

      {tab === "response" && (
        <>
          <SectionCard
            title="Automated Response Policies"
            description="Configure containment and incident response behavior."
          >
            <SettingRow
              title="Automatic Containment"
              description="Automatically contain high-confidence security threats."
            >
              <Toggle
                enabled={settings.autoContainment}
                onChange={() =>
                  update(
                    "autoContainment",
                    !settings.autoContainment
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Critical System Isolation"
              description="Automatically isolate systems associated with critical threats."
            >
              <Toggle
                enabled={settings.isolateCritical}
                onChange={() =>
                  update(
                    "isolateCritical",
                    !settings.isolateCritical
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Automatic Low-Risk Resolution"
              description="Automatically resolve low-risk events."
            >
              <Toggle
                enabled={settings.autoResolveLow}
                onChange={() =>
                  update(
                    "autoResolveLow",
                    !settings.autoResolveLow
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Approval for Destructive Actions"
              description="Require administrator approval for destructive response actions."
            >
              <Toggle
                enabled={settings.responseApproval}
                onChange={() =>
                  update(
                    "responseApproval",
                    !settings.responseApproval
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="File Quarantine"
              description="Quarantine suspicious files during incident response."
            >
              <Toggle
                enabled={settings.quarantineFiles}
                onChange={() =>
                  update(
                    "quarantineFiles",
                    !settings.quarantineFiles
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Malicious IP Blocking"
              description="Automatically block confirmed malicious source addresses."
            >
              <Toggle
                enabled={settings.blockMaliciousIp}
                onChange={() =>
                  update(
                    "blockMaliciousIp",
                    !settings.blockMaliciousIp
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Compromised Account Disablement"
              description="Disable compromised accounts after confirmed incidents."
              last
            >
              <Toggle
                enabled={settings.disableCompromisedAccount}
                onChange={() =>
                  update(
                    "disableCompromisedAccount",
                    !settings.disableCompromisedAccount
                  )
                }
              />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Response Workflow"
            description="Current automated incident-response chain."
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(150px,1fr))",
                gap: 10,
              }}
            >
              {[
                ["01", "DETECT", "#38bdf8"],
                ["02", "SCORE", "#a78bfa"],
                ["03", "CORRELATE", "#facc15"],
                ["04", "CONTAIN", "#fb923c"],
                ["05", "RECOVER", "#4ade80"],
              ].map(([number, name, color]) => (
                <div
                  key={number}
                  style={{
                    padding: 15,
                    borderRadius: 11,
                    background:
                      "rgba(255,255,255,.018)",
                    border:
                      "1px solid rgba(148,163,184,.08)",
                  }}
                >
                  <div
                    style={{
                      color,
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  >
                    {number}
                  </div>

                  <div
                    style={{
                      color: "#dce5f3",
                      fontSize: 11,
                      fontWeight: 800,
                      marginTop: 8,
                    }}
                  >
                    {name}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {/* ====================================================== */}
      {/* NOTIFICATIONS */}
      {/* ====================================================== */}

      {tab === "notifications" && (
        <>
          <SectionCard
            title="Notification Management"
            description="Configure security alerts and operational notifications."
          >
            <SettingRow
              title="Email Notifications"
              description="Send security notifications through configured email channels."
            >
              <Toggle
                enabled={settings.emailAlerts}
                onChange={() =>
                  update(
                    "emailAlerts",
                    !settings.emailAlerts
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Critical Threat Alerts"
              description="Immediately notify administrators of critical detections."
            >
              <Toggle
                enabled={settings.criticalAlerts}
                onChange={() =>
                  update(
                    "criticalAlerts",
                    !settings.criticalAlerts
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="High Severity Alerts"
              description="Notify operators about high-severity incidents."
            >
              <Toggle
                enabled={settings.highAlerts}
                onChange={() =>
                  update(
                    "highAlerts",
                    !settings.highAlerts
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Daily Security Digest"
              description="Generate a daily summary of platform activity."
            >
              <Toggle
                enabled={settings.dailyDigest}
                onChange={() =>
                  update(
                    "dailyDigest",
                    !settings.dailyDigest
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Webhook Alerts"
              description="Send event notifications to configured webhook endpoints."
            >
              <Toggle
                enabled={settings.webhookAlerts}
                onChange={() =>
                  update(
                    "webhookAlerts",
                    !settings.webhookAlerts
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="System Health Alerts"
              description="Notify administrators when critical platform services degrade."
              last
            >
              <Toggle
                enabled={settings.systemHealthAlerts}
                onChange={() =>
                  update(
                    "systemHealthAlerts",
                    !settings.systemHealthAlerts
                  )
                }
              />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Alert Priority Matrix"
            description="Security notification priority levels."
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(180px,1fr))",
                gap: 10,
              }}
            >
              {[
                ["CRITICAL", "Immediate", "#ff6472"],
                ["HIGH", "Immediate", "#fb923c"],
                ["MEDIUM", "Queued", "#facc15"],
                ["LOW", "Digest", "#4ade80"],
              ].map(([severity, delivery, color]) => (
                <div
                  key={severity}
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    border: `1px solid ${color}22`,
                    background: `${color}08`,
                  }}
                >
                  <div
                    style={{
                      color,
                      fontWeight: 900,
                      fontSize: 10,
                    }}
                  >
                    {severity}
                  </div>

                  <div
                    style={{
                      color: "#78869b",
                      fontSize: 10,
                      marginTop: 7,
                    }}
                  >
                    Delivery: {delivery}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {/* ====================================================== */}
      {/* INTEGRATIONS */}
      {/* ====================================================== */}

      {tab === "integrations" && (
        <>
          <SectionCard
            title="Security Integrations"
            description="External intelligence and monitoring services."
          >
            <SettingRow
              title="Threat Intelligence"
              description="Use external intelligence for indicator enrichment."
            >
              <Toggle
                enabled={settings.threatIntel}
                onChange={() =>
                  update(
                    "threatIntel",
                    !settings.threatIntel
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="API Monitoring"
              description="Monitor API health, errors and suspicious requests."
            >
              <Toggle
                enabled={settings.apiMonitoring}
                onChange={() =>
                  update(
                    "apiMonitoring",
                    !settings.apiMonitoring
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="External SIEM"
              description="Forward security events to an external SIEM."
            >
              <Toggle
                enabled={settings.externalSIEM}
                onChange={() =>
                  update(
                    "externalSIEM",
                    !settings.externalSIEM
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Webhook Integration"
              description="Connect AEGISDRP to external automation services."
            >
              <Toggle
                enabled={settings.webhookIntegration}
                onChange={() =>
                  update(
                    "webhookIntegration",
                    !settings.webhookIntegration
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Ticketing Integration"
              description="Create incidents in an external ticketing platform."
              last
            >
              <Toggle
                enabled={settings.ticketingIntegration}
                onChange={() =>
                  update(
                    "ticketingIntegration",
                    !settings.ticketingIntegration
                  )
                }
              />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Integration Health"
            description="Connectivity state of external security integrations."
          >
            {[
              ["Threat Intelligence", "CONNECTED", "#4ade80"],
              ["API Gateway", "CONNECTED", "#38bdf8"],
              ["PostgreSQL", "CONNECTED", "#a78bfa"],
              ["Detection Service", "CONNECTED", "#facc15"],
              ["Webhook Gateway", "READY", "#718096"],
            ].map(([name, status, color], index, array) => (
              <SettingRow
                key={name}
                title={name}
                description="Integration service status."
                last={index === array.length - 1}
              >
                <StatusBadge
                  text={status}
                  color={color}
                />
              </SettingRow>
            ))}
          </SectionCard>
        </>
      )}

      {/* ====================================================== */}
      {/* LOGGING */}
      {/* ====================================================== */}

      {tab === "logging" && (
        <>
          <SectionCard
            title="Logging & Retention"
            description="Configure security event, audit and administrative logging."
          >
            <SettingRow
              title="Audit Logging"
              description="Record administrator and security operations activity."
            >
              <Toggle
                enabled={settings.auditLogging}
                onChange={() =>
                  update(
                    "auditLogging",
                    !settings.auditLogging
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Immutable Audit Logs"
              description="Protect important audit records against unauthorized changes."
            >
              <Toggle
                enabled={settings.immutableLogs}
                onChange={() =>
                  update(
                    "immutableLogs",
                    !settings.immutableLogs
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Extended Retention"
              description="Maintain logs for extended investigation periods."
            >
              <Toggle
                enabled={settings.extendedRetention}
                onChange={() =>
                  update(
                    "extendedRetention",
                    !settings.extendedRetention
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Administrator Activity Logging"
              description="Record privileged configuration changes."
            >
              <Toggle
                enabled={settings.adminActivityLogging}
                onChange={() =>
                  update(
                    "adminActivityLogging",
                    !settings.adminActivityLogging
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Authentication Logging"
              description="Record authentication success and failure events."
              last
            >
              <Toggle
                enabled={settings.authenticationLogging}
                onChange={() =>
                  update(
                    "authenticationLogging",
                    !settings.authenticationLogging
                  )
                }
              />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Retention Intelligence"
            description="Current logging and audit coverage."
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(200px,1fr))",
                gap: 13,
              }}
            >
              {[
                ["Security Events", "180 DAYS", 92, "#38bdf8"],
                ["Audit Logs", "365 DAYS", 98, "#a78bfa"],
                ["Authentication", "180 DAYS", 95, "#4ade80"],
                ["System Telemetry", "90 DAYS", 87, "#facc15"],
              ].map(([name, days, value, color]:
                    [string, string, number, string]) => (
                <div
                  key={name}
                  style={{
                    padding: 16,
                    background:
                      "rgba(255,255,255,.018)",
                    border:
                      "1px solid rgba(148,163,184,.08)",
                    borderRadius: 11,
                  }}
                >
                  <div
                    style={{
                      color: "#718096",
                      fontSize: 9,
                      fontWeight: 800,
                    }}
                  >
                    {name}
                  </div>

                  <div
                    style={{
                      color,
                      fontSize: 18,
                      fontWeight: 900,
                      margin: "7px 0 10px",
                    }}
                  >
                    {days}
                  </div>

                  <Progress
                    value={Number(value)}
                    color={String(color)}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {/* ====================================================== */}
      {/* BACKUP */}
      {/* ====================================================== */}

      {tab === "backup" && (
        <>
          <SectionCard
            title="Backup & Recovery"
            description="Protect AEGISDRP configuration and security data."
          >
            <SettingRow
              title="Backup Protection"
              description="Enable platform configuration backup."
            >
              <Toggle
                enabled={settings.backupEnabled}
                onChange={() =>
                  update(
                    "backupEnabled",
                    !settings.backupEnabled
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Encrypted Backup"
              description="Encrypt backup data before storage."
            >
              <Toggle
                enabled={settings.encryptedBackup}
                onChange={() =>
                  update(
                    "encryptedBackup",
                    !settings.encryptedBackup
                  )
                }
              />
            </SettingRow>

            <SettingRow
              title="Automatic Backup"
              description="Automatically create scheduled platform backups."
              last
            >
              <Toggle
                enabled={settings.automaticBackup}
                onChange={() =>
                  update(
                    "automaticBackup",
                    !settings.automaticBackup
                  )
                }
              />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Backup Status"
            description="Current recovery protection status."
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(190px,1fr))",
                gap: 12,
              }}
            >
              {[
                ["LAST BACKUP", "Today 01:30", "#38bdf8"],
                ["BACKUP SIZE", "284 MB", "#a78bfa"],
                ["INTEGRITY", "VERIFIED", "#4ade80"],
                ["RECOVERY POINT", "AVAILABLE", "#facc15"],
              ].map(([name, value, color]) => (
                <div
                  key={name}
                  style={{
                    padding: 16,
                    borderRadius: 11,
                    background:
                      "rgba(255,255,255,.018)",
                    border:
                      "1px solid rgba(148,163,184,.08)",
                  }}
                >
                  <div
                    style={{
                      color: "#718096",
                      fontSize: 9,
                      fontWeight: 800,
                    }}
                  >
                    {name}
                  </div>

                  <div
                    style={{
                      color,
                      fontSize: 15,
                      fontWeight: 900,
                      marginTop: 8,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <button
            type="button"
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2500);
            }}
            style={{
              width: "100%",
              padding: 13,
              borderRadius: 9,
              border:
                "1px solid rgba(56,189,248,.20)",
              background:
                "rgba(56,189,248,.07)",
              color: "#38bdf8",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: 10,
            }}
          >
            CREATE MANUAL BACKUP
          </button>
        </>
      )}

      {/* ====================================================== */}
      {/* ADVANCED */}
      {/* ====================================================== */}

      {tab === "advanced" && (
        <>
          <SectionCard
            title="Advanced Platform Controls"
            description="Advanced operational controls for the AEGISDRP security platform."
          >
            <SettingRow
              title="Real-Time Configuration Reload"
              description="Apply configuration changes without restarting the application."
            >
              <StatusBadge
                text="SUPPORTED"
                color="#38bdf8"
              />
            </SettingRow>

            <SettingRow
              title="API Health Monitoring"
              description="Continuously monitor API service health."
            >
              <StatusBadge
                text="ACTIVE"
                color="#4ade80"
              />
            </SettingRow>

            <SettingRow
              title="Database Connectivity Monitoring"
              description="Monitor PostgreSQL connectivity and response health."
            >
              <StatusBadge
                text="ACTIVE"
                color="#a78bfa"
              />
            </SettingRow>

            <SettingRow
              title="Detection Service Monitoring"
              description="Monitor detection engine availability."
            >
              <StatusBadge
                text="ACTIVE"
                color="#facc15"
              />
            </SettingRow>

            <SettingRow
              title="Security Event Integrity"
              description="Validate event records for consistency and integrity."
              last
            >
              <StatusBadge
                text="VERIFIED"
                color="#4ade80"
              />
            </SettingRow>
          </SectionCard>

          <SectionCard
            title="Platform Metrics"
            description="Operational health and performance indicators."
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(180px,1fr))",
                gap: 12,
              }}
            >
              {[
                ["API LATENCY", "24 ms", "#38bdf8"],
                ["DATABASE LATENCY", "8 ms", "#a78bfa"],
                ["DETECTION LATENCY", "41 ms", "#facc15"],
                ["EVENT PROCESSING", "99.8%", "#4ade80"],
                ["UPTIME", "99.97%", "#4ade80"],
                ["QUEUE DEPTH", "12", "#fb923c"],
              ].map(([name, value, color]) => (
                <div
                  key={name}
                  style={{
                    background:
                      "rgba(255,255,255,.018)",
                    border:
                      "1px solid rgba(148,163,184,.08)",
                    borderRadius: 11,
                    padding: 15,
                  }}
                >
                  <div
                    style={{
                      color: "#718096",
                      fontSize: 9,
                      fontWeight: 800,
                    }}
                  >
                    {name}
                  </div>

                  <div
                    style={{
                      color,
                      fontSize: 19,
                      fontWeight: 900,
                      marginTop: 7,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Security Architecture"
            description="Current AEGISDRP platform service topology."
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(170px,1fr))",
                gap: 10,
              }}
            >
              {[
                ["WEB CONSOLE", "PORT 3000", "#38bdf8"],
                ["API GATEWAY", "PORT 8000", "#4ade80"],
                ["DETECTION", "PORT 8001", "#a78bfa"],
                ["POSTGRESQL", "PORT 5432", "#facc15"],
              ].map(([service, port, color]) => (
                <div
                  key={service}
                  style={{
                    position: "relative",
                    padding: 16,
                    background:
                      "rgba(255,255,255,.018)",
                    border:
                      `1px solid ${color}22`,
                    borderRadius: 11,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 10px ${color}`,
                      marginBottom: 11,
                    }}
                  />

                  <div
                    style={{
                      color: "#e0e8f4",
                      fontSize: 11,
                      fontWeight: 900,
                    }}
                  >
                    {service}
                  </div>

                  <div
                    style={{
                      color: "#6d7b91",
                      fontSize: 9,
                      marginTop: 5,
                    }}
                  >
                    {port}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

       <div
         style={{
           marginTop: 18,
           padding: "13px 15px",
           borderRadius: 10,
           background: "rgba(255,255,255,.018)",
           border: "1px solid rgba(148,163,184,.07)",
           display: "flex",
           justifyContent: "space-between",
           alignItems: "center",
           gap: 15,
           flexWrap: "wrap",
  }}
>
      <div
       style={{
          color: "#59677c",
          fontSize: 9,
    }}
  >
      AEGISDRP Security Configuration Center
     </div>

     <div
       style={{
          display: "flex",
          gap: 14,
         color: "#65738a",
         fontSize: 9,
    }}
  >
      <span>Configuration v1.0</span>
      <span>•</span>
      <span>Policy Engine Active</span>
      <span>•</span>
      <span>Audit Enabled</span>
    </div>
   </div>
  </div>
);
}
