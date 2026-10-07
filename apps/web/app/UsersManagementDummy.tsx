"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

type Role =
  | "SUPER ADMIN"
  | "SECURITY ADMIN"
  | "SOC ANALYST"
  | "THREAT HUNTER"
  | "VIEWER";

type UserStatus = "ONLINE" | "OFFLINE" | "SUSPENDED";

type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  department: string;
  location: string;
  device: string;
  status: UserStatus;
  risk: number;
  mfa: boolean;
  privileged: boolean;
  lastLogin: string;
  sessions: number;
  anomaly: boolean;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "Darshan S",
    email: "admin@aegisdrp.local",
    role: "SUPER ADMIN",
    department: "Security Operations",
    location: "India",
    device: "Windows Admin",
    status: "ONLINE",
    risk: 12,
    mfa: true,
    privileged: true,
    lastLogin: "Just now",
    sessions: 2,
    anomaly: false,
  },
  {
    id: 2,
    name: "Arun Kumar",
    email: "arun@aegisdrp.local",
    role: "SECURITY ADMIN",
    department: "SOC",
    location: "Chennai",
    device: "SOC Workstation",
    status: "ONLINE",
    risk: 18,
    mfa: true,
    privileged: true,
    lastLogin: "2 min ago",
    sessions: 1,
    anomaly: false,
  },
  {
    id: 3,
    name: "Priya N",
    email: "priya@aegisdrp.local",
    role: "SOC ANALYST",
    department: "Threat Monitoring",
    location: "Coimbatore",
    device: "Windows Laptop",
    status: "ONLINE",
    risk: 27,
    mfa: true,
    privileged: false,
    lastLogin: "4 min ago",
    sessions: 1,
    anomaly: false,
  },
  {
    id: 4,
    name: "Rahul Dev",
    email: "rahul@aegisdrp.local",
    role: "THREAT HUNTER",
    department: "Threat Intelligence",
    location: "Bengaluru",
    device: "Linux Workstation",
    status: "OFFLINE",
    risk: 43,
    mfa: true,
    privileged: false,
    lastLogin: "32 min ago",
    sessions: 0,
    anomaly: true,
  },
  {
    id: 5,
    name: "Meena Raj",
    email: "meena@aegisdrp.local",
    role: "SOC ANALYST",
    department: "Incident Response",
    location: "Salem",
    device: "MacBook",
    status: "ONLINE",
    risk: 21,
    mfa: true,
    privileged: false,
    lastLogin: "8 min ago",
    sessions: 1,
    anomaly: false,
  },
  {
    id: 6,
    name: "Karthik S",
    email: "karthik@aegisdrp.local",
    role: "VIEWER",
    department: "Management",
    location: "Madurai",
    device: "Android Device",
    status: "OFFLINE",
    risk: 34,
    mfa: false,
    privileged: false,
    lastLogin: "1 hour ago",
    sessions: 0,
    anomaly: false,
  },
  {
    id: 7,
    name: "System Service",
    email: "service@aegisdrp.local",
    role: "SECURITY ADMIN",
    department: "Automation",
    location: "Internal",
    device: "API Service",
    status: "ONLINE",
    risk: 8,
    mfa: true,
    privileged: true,
    lastLogin: "Running",
    sessions: 3,
    anomaly: false,
  },
  {
    id: 8,
    name: "Unknown Account",
    email: "unknown@aegisdrp.local",
    role: "VIEWER",
    department: "Unassigned",
    location: "Unknown",
    device: "Unknown",
    status: "SUSPENDED",
    risk: 91,
    mfa: false,
    privileged: false,
    lastLogin: "Yesterday",
    sessions: 0,
    anomaly: true,
  },
];

const roleColor = (role: Role) => {
  if (role === "SUPER ADMIN") return "#ff4f70";
  if (role === "SECURITY ADMIN") return "#ff9d42";
  if (role === "THREAT HUNTER") return "#9b7cff";
  if (role === "SOC ANALYST") return "#42d9ff";
  return "#7f8ca3";
};

const riskColor = (risk: number) => {
  if (risk >= 70) return "#ff3b5c";
  if (risk >= 40) return "#ff9d42";
  if (risk >= 25) return "#ffc857";
  return "#4dd4a8";
};

export default function UsersManagementDummy() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User>(
    initialUsers[0]
  );

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date());

      setUsers((current) =>
        current.map((user) => ({
          ...user,
          risk: Math.max(
            1,
            Math.min(
              100,
              user.risk + Math.floor(Math.random() * 7) - 3
            )
          ),
        }))
      );
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.department
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (u) => u.status !== "SUSPENDED"
  ).length;

  const onlineUsers = users.filter(
    (u) => u.status === "ONLINE"
  ).length;

  const admins = users.filter(
    (u) =>
      u.role === "SUPER ADMIN" ||
      u.role === "SECURITY ADMIN"
  ).length;

  const highRiskUsers = users.filter(
    (u) => u.risk >= 70
  ).length;

  const mfaCoverage = Math.round(
    (users.filter((u) => u.mfa).length / users.length) *
      100
  );

  return (
    <div style={styles.page}>
      {/* HEADER */}

      <div style={styles.header}>
        <div>
          <div style={styles.breadcrumb}>
            AEGISDRP / MANAGEMENT / IDENTITY
          </div>

          <h1 style={styles.title}>
            User & Access Management
          </h1>

          <p style={styles.subtitle}>
            Identity security, RBAC, privileged access and
            user activity monitoring
          </p>
        </div>

        <div style={styles.liveBadge}>
          <span style={styles.liveDot} />
          IDENTITY ENGINE ACTIVE
        </div>
      </div>

      {/* KPI */}

      <div style={styles.kpiGrid}>
        <Kpi
          label="TOTAL USERS"
          value={totalUsers}
          detail="registered identities"
          icon="◎"
        />

        <Kpi
          label="ACTIVE USERS"
          value={activeUsers}
          detail="enabled accounts"
          icon="✓"
          success
        />

        <Kpi
          label="ONLINE NOW"
          value={onlineUsers}
          detail="active sessions"
          icon="●"
        />

        <Kpi
          label="PRIVILEGED USERS"
          value={admins}
          detail="elevated identities"
          icon="◆"
          warning
        />

        <Kpi
          label="HIGH RISK USERS"
          value={highRiskUsers}
          detail="risk score ≥ 70"
          icon="!"
          danger
        />

        <Kpi
          label="MFA COVERAGE"
          value={`${mfaCoverage}%`}
          detail="identity protection"
          icon="⌁"
          success
        />
      </div>

      {/* SECURITY POSTURE */}

      <div style={styles.postureGrid}>
        <PostureCard
          title="Identity Security"
          value="92"
          label="Security Score"
          description="Strong identity posture"
          color="#4dd4a8"
        />

        <PostureCard
          title="Privileged Access"
          value="88"
          label="Access Hygiene"
          description="2 accounts require review"
          color="#42d9ff"
        />

        <PostureCard
          title="Authentication"
          value={`${mfaCoverage}`}
          label="MFA Adoption"
          description="Administrator MFA protected"
          color="#9b7cff"
        />

        <PostureCard
          title="Session Security"
          value="96"
          label="Session Health"
          description="No abnormal session surge"
          color="#ffc857"
        />
      </div>

      {/* USER DIRECTORY */}

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>
              Identity Directory
            </h2>

            <p style={styles.panelSubtitle}>
              Monitor users, privileges, sessions and
              security posture
            </p>
          </div>

          <div style={styles.updated}>
            Updated {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* FILTERS */}

        <div style={styles.filters}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users, email or department..."
            style={styles.search}
          />

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER ADMIN">Super Admin</option>
            <option value="SECURITY ADMIN">
              Security Admin
            </option>
            <option value="SOC ANALYST">
              SOC Analyst
            </option>
            <option value="THREAT HUNTER">
              Threat Hunter
            </option>
            <option value="VIEWER">Viewer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="ALL">All Status</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="SUSPENDED">
              Suspended
            </option>
          </select>

          <button style={styles.addButton}>
            + Add User
          </button>
        </div>

        {/* TABLE */}

        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>IDENTITY</span>
            <span>ROLE</span>
            <span>STATUS</span>
            <span>RISK</span>
            <span>MFA</span>
            <span>LAST LOGIN</span>
          </div>

          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              style={{
                ...styles.userRow,
                background:
                  selectedUser.id === user.id
                    ? "rgba(66,217,255,0.06)"
                    : "transparent",
              }}
            >
              <div style={styles.identity}>
                <div style={styles.avatar}>
                  {user.name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>
                  <strong>{user.name}</strong>

                  <span>{user.email}</span>

                  <small>
                    {user.department}
                  </small>
                </div>
              </div>

              <div>
                <span
                  style={{
                    ...styles.role,
                    color: roleColor(user.role),
                    borderColor:
                      roleColor(user.role),
                  }}
                >
                  {user.role}
                </span>
              </div>

              <div>
                <span style={styles.status}>
                  <i
                    style={{
                      ...styles.statusDot,
                      background:
                        user.status === "ONLINE"
                          ? "#4dd4a8"
                          : user.status ===
                            "SUSPENDED"
                          ? "#ff3b5c"
                          : "#66758a",
                    }}
                  />
                  {user.status}
                </span>
              </div>

              <div>
                <strong
                  style={{
                    color: riskColor(user.risk),
                  }}
                >
                  {user.risk}
                </strong>

                <div style={styles.miniBar}>
                  <div
                    style={{
                      ...styles.miniBarFill,
                      width: `${user.risk}%`,
                      background:
                        riskColor(user.risk),
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  color: user.mfa
                    ? "#4dd4a8"
                    : "#ff3b5c",
                  fontWeight: 800,
                  fontSize: 10,
                }}
              >
                {user.mfa
                  ? "PROTECTED"
                  : "NOT ENABLED"}
              </div>

              <div style={styles.login}>
                {user.lastLogin}

                {user.anomaly && (
                  <span style={styles.anomaly}>
                    ANOMALY
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* USER DETAILS */}

      <div style={styles.twoColumn}>
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Identity Profile
              </h2>

              <p style={styles.panelSubtitle}>
                Detailed security posture
              </p>
            </div>

            <span
              style={{
                ...styles.role,
                color: roleColor(
                  selectedUser.role
                ),
                borderColor: roleColor(
                  selectedUser.role
                ),
              }}
            >
              {selectedUser.role}
            </span>
          </div>

          <div style={styles.profile}>
            <div style={styles.largeAvatar}>
              {selectedUser.name
                .split(" ")
                .map((x) => x[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div>
              <h2 style={styles.profileName}>
                {selectedUser.name}
              </h2>

              <p style={styles.profileEmail}>
                {selectedUser.email}
              </p>

              <span
                style={{
                  color:
                    selectedUser.status === "ONLINE"
                      ? "#4dd4a8"
                      : "#7d899d",
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                ● {selectedUser.status}
              </span>
            </div>
          </div>

          <div style={styles.detailGrid}>
            <Detail
              label="Department"
              value={selectedUser.department}
            />

            <Detail
              label="Location"
              value={selectedUser.location}
            />

            <Detail
              label="Device"
              value={selectedUser.device}
            />

            <Detail
              label="Active Sessions"
              value={String(
                selectedUser.sessions
              )}
            />

            <Detail
              label="MFA"
              value={
                selectedUser.mfa
                  ? "Enabled"
                  : "Disabled"
              }
            />

            <Detail
              label="Privileged"
              value={
                selectedUser.privileged
                  ? "Yes"
                  : "No"
              }
            />
          </div>
        </section>

        {/* ACCESS CONTROL */}

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Access Control
              </h2>

              <p style={styles.panelSubtitle}>
                Effective permissions
              </p>
            </div>
          </div>

          <Permission
            name="Threat Monitoring"
            level="FULL ACCESS"
            enabled
          />

          <Permission
            name="Security Events"
            level="FULL ACCESS"
            enabled
          />

          <Permission
            name="Response Center"
            level={
              selectedUser.privileged
                ? "FULL ACCESS"
                : "LIMITED"
            }
            enabled
          />

          <Permission
            name="System Management"
            level={
              selectedUser.privileged
                ? "ADMIN"
                : "READ ONLY"
            }
            enabled
          />

          <Permission
            name="User Management"
            level={
              selectedUser.role ===
                "SUPER ADMIN" ||
              selectedUser.role ===
                "SECURITY ADMIN"
                ? "ADMIN"
                : "DENIED"
            }
            enabled={
              selectedUser.role ===
                "SUPER ADMIN" ||
              selectedUser.role ===
                "SECURITY ADMIN"
            }
          />

          <Permission
            name="Audit Logs"
            level="READ ACCESS"
            enabled
          />
        </section>
      </div>

      {/* SESSIONS + LOGIN INTELLIGENCE */}

      <div style={styles.threeColumn}>
        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>
            Active Sessions
          </h2>

          <p style={styles.panelSubtitle}>
            Current authenticated sessions
          </p>

          <Session
            user="Darshan S"
            device="Windows Admin"
            location="India"
            time="00:12:44"
            secure
          />

          <Session
            user="Arun Kumar"
            device="SOC Workstation"
            location="Chennai"
            time="00:28:19"
            secure
          />

          <Session
            user="Priya N"
            device="Windows Laptop"
            location="Coimbatore"
            time="01:04:22"
            secure
          />

          <Session
            user="System Service"
            device="API Service"
            location="Internal"
            time="03:42:08"
            secure
          />
        </section>

        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>
            Authentication Intelligence
          </h2>

          <p style={styles.panelSubtitle}>
            Recent identity security signals
          </p>

          <Signal
            title="Successful logins"
            value="1,284"
            status="NORMAL"
          />

          <Signal
            title="Failed logins"
            value="37"
            status="MONITORED"
          />

          <Signal
            title="MFA challenges"
            value="184"
            status="NORMAL"
          />

          <Signal
            title="Anomalous logins"
            value="3"
            status="INVESTIGATE"
            danger
          />
        </section>

        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>
            Privileged Access
          </h2>

          <p style={styles.panelSubtitle}>
            Elevated identity monitoring
          </p>

          <Privileged
            name="Darshan S"
            role="SUPER ADMIN"
            risk={12}
          />

          <Privileged
            name="Arun Kumar"
            role="SECURITY ADMIN"
            risk={18}
          />

          <Privileged
            name="System Service"
            role="SECURITY ADMIN"
            risk={8}
          />

          <div style={styles.review}>
            2 access reviews pending
          </div>
        </section>
      </div>

      {/* SECURITY EVENTS */}

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>
              Identity Security Events
            </h2>

            <p style={styles.panelSubtitle}>
              Recent authentication and access-control
              activity
            </p>
          </div>

          <span style={styles.liveText}>
            LIVE TELEMETRY
          </span>
        </div>

        <div style={styles.eventList}>
          <Event
            time="10:43:21"
            event="MFA authentication successful"
            user="Darshan S"
            severity="LOW"
          />

          <Event
            time="10:42:58"
            event="Privileged session created"
            user="Arun Kumar"
            severity="MEDIUM"
          />

          <Event
            time="10:41:44"
            event="Failed login attempt"
            user="unknown@aegisdrp.local"
            severity="HIGH"
          />

          <Event
            time="10:40:19"
            event="Role permission reviewed"
            user="Security Admin"
            severity="LOW"
          />

          <Event
            time="10:38:42"
            event="Suspicious login location detected"
            user="Rahul Dev"
            severity="HIGH"
          />
        </div>
      </section>

      {/* SECURITY RECOMMENDATIONS */}

      <section style={styles.recommendation}>
        <div style={styles.recommendationIcon}>
          !
        </div>

        <div>
          <strong>
            Identity Security Recommendations
          </strong>

          <p>
            One suspended high-risk account requires
            investigation. One user has MFA disabled.
            Two privileged-access reviews are pending.
          </p>
        </div>

        <button style={styles.reviewButton}>
          Review Security
        </button>
      </section>

      <div style={styles.footer}>
        AEGISDRP Identity & Access Security Engine
        • RBAC • MFA • Session Intelligence •
        Privileged Access Monitoring
      </div>
    </div>
  );
}

/* COMPONENTS */

function Kpi({
  label,
  value,
  detail,
  icon,
  success,
  warning,
  danger,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: string;
  success?: boolean;
  warning?: boolean;
  danger?: boolean;
}) {
  const color = danger
    ? "#ff3b5c"
    : warning
    ? "#ffc857"
    : success
    ? "#4dd4a8"
    : "#42d9ff";

  return (
    <div style={styles.kpi}>
      <div style={styles.kpiTop}>
        <span style={styles.kpiLabel}>
          {label}
        </span>

        <span
          style={{
            color,
            fontWeight: 900,
          }}
        >
          {icon}
        </span>
      </div>

      <strong style={styles.kpiValue}>
        {value}
      </strong>

      <span style={styles.kpiDetail}>
        {detail}
      </span>
    </div>
  );
}

function PostureCard({
  title,
  value,
  label,
  description,
  color,
}: {
  title: string;
  value: string;
  label: string;
  description: string;
  color: string;
}) {
  return (
    <div style={styles.posture}>
      <span style={styles.postureTitle}>
        {title}
      </span>

      <div style={styles.postureMain}>
        <strong
          style={{
            color,
            fontSize: 27,
          }}
        >
          {value}
        </strong>

        <span>/100</span>
      </div>

      <span style={styles.postureLabel}>
        {label}
      </span>

      <span style={styles.postureDescription}>
        {description}
      </span>
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

function Permission({
  name,
  level,
  enabled,
}: {
  name: string;
  level: string;
  enabled: boolean;
}) {
  return (
    <div style={styles.permission}>
      <div>
        <strong>{name}</strong>
        <span>{level}</span>
      </div>

      <span
        style={{
          ...styles.permissionDot,
          background: enabled
            ? "#4dd4a8"
            : "#ff3b5c",
        }}
      />
    </div>
  );
}

function Session({
  user,
  device,
  location,
  time,
  secure,
}: {
  user: string;
  device: string;
  location: string;
  time: string;
  secure: boolean;
}) {
  return (
    <div style={styles.session}>
      <div style={styles.sessionIcon}>●</div>

      <div style={styles.sessionInfo}>
        <strong>{user}</strong>
        <span>
          {device} • {location}
        </span>
      </div>

      <div style={styles.sessionTime}>
        {time}
        <small
          style={{
            color: secure
              ? "#4dd4a8"
              : "#ff3b5c",
          }}
        >
          SECURE
        </small>
      </div>
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

function Privileged({
  name,
  role,
  risk,
}: {
  name: string;
  role: string;
  risk: number;
}) {
  return (
    <div style={styles.privileged}>
      <div>
        <strong>{name}</strong>
        <span>{role}</span>
      </div>

      <b style={{ color: riskColor(risk) }}>
        {risk}
      </b>
    </div>
  );
}

function Event({
  time,
  event,
  user,
  severity,
}: {
  time: string;
  event: string;
  user: string;
  severity: Severity;
}) {
  return (
    <div style={styles.event}>
      <span style={styles.eventTime}>
        {time}
      </span>

      <span
        style={{
          ...styles.eventSeverity,
          color: riskColor(
            severity === "HIGH"
              ? 80
              : severity === "MEDIUM"
              ? 45
              : 10
          ),
        }}
      >
        {severity}
      </span>

      <div style={styles.eventContent}>
        <strong>{event}</strong>
        <span>{user}</span>
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

  kpiTop: {
    display: "flex",
    justifyContent: "space-between",
  },

  kpiLabel: {
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
  },

  postureTitle: {
    display: "block",
    color: "#718096",
    fontSize: 9,
    fontWeight: 800,
  },

  postureMain: {
    display: "flex",
    alignItems: "baseline",
    gap: 3,
    marginTop: 7,
  },

  postureLabel: {
    display: "block",
    fontSize: 9,
    color: "#a0acc0",
  },

  postureDescription: {
    display: "block",
    color: "#59677c",
    fontSize: 9,
    marginTop: 4,
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

  updated: {
    color: "#4e5c71",
    fontSize: 9,
  },

  filters: {
    display: "flex",
    gap: 9,
    marginBottom: 13,
  },

  search: {
    flex: 1,
    minWidth: 200,
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

  addButton: {
    padding: "9px 13px",
    borderRadius: 8,
    border: "none",
    background:
      "linear-gradient(135deg,#22b9ff,#1685ff)",
    color: "#fff",
    fontWeight: 800,
    fontSize: 10,
    cursor: "pointer",
  },

  table: {
    width: "100%",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1.3fr 1fr 0.8fr 1fr 1fr",
    gap: 10,
    padding: "10px 12px",
    color: "#536176",
    fontSize: 8,
    fontWeight: 900,
    letterSpacing: 1,
  },

  userRow: {
    width: "100%",
    display: "grid",
    gridTemplateColumns:
      "2fr 1.3fr 1fr 0.8fr 1fr 1fr",
    gap: 10,
    alignItems: "center",
    textAlign: "left",
    color: "#dce8f8",
    border: "none",
    borderTop:
      "1px solid rgba(255,255,255,0.045)",
    padding: "12px",
    cursor: "pointer",
  },

  identity: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 9,
    background:
      "linear-gradient(135deg,#168fff,#765cff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 9,
    fontWeight: 900,
    flexShrink: 0,
  },

  identityStrong: {
    fontSize: 10,
  },

  role: {
    display: "inline-block",
    border: "1px solid",
    padding: "4px 6px",
    borderRadius: 5,
    fontSize: 7,
    fontWeight: 900,
  },

  status: {
    fontSize: 8,
    fontWeight: 800,
    color: "#9aa7ba",
  },

  statusDot: {
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    marginRight: 5,
  },

  miniBar: {
    width: 50,
    height: 3,
    background:
      "rgba(255,255,255,0.08)",
    borderRadius: 5,
    marginTop: 4,
  },

  miniBarFill: {
    height: "100%",
    borderRadius: 5,
  },

  login: {
    color: "#7e8ba0",
    fontSize: 9,
  },

  anomaly: {
    display: "block",
    color: "#ff3b5c",
    fontSize: 7,
    fontWeight: 900,
    marginTop: 3,
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 15,
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    marginBottom: 18,
  },

  largeAvatar: {
    width: 55,
    height: 55,
    borderRadius: 14,
    background:
      "linear-gradient(135deg,#168fff,#765cff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: 15,
  },

  profileName: {
    margin: 0,
    fontSize: 17,
  },

  profileEmail: {
    margin: "4px 0 6px",
    color: "#68768a",
    fontSize: 10,
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2,1fr)",
    gap: 8,
  },

  detail: {
    display: "flex",
    justifyContent: "space-between",
    padding: "9px 10px",
    borderRadius: 8,
    background:
      "rgba(255,255,255,0.025)",
    fontSize: 9,
  },

  detailSpan: {
    color: "#66758a",
  },

  permission: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "11px 0",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
  },

  permissionDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
  },

  threeColumn: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3,minmax(0,1fr))",
    gap: 15,
  },

  session: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "10px 0",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
  },

  sessionIcon: {
    color: "#4dd4a8",
    fontSize: 8,
  },

  sessionInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    flex: 1,
    fontSize: 9,
  },

  sessionTime: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    color: "#68768a",
    fontSize: 8,
  },

  signal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
  },

  signalDiv: {
    display: "flex",
    flexDirection: "column",
  },

  privileged: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "11px 0",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
  },

  review: {
    marginTop: 12,
    padding: 9,
    borderRadius: 7,
    background:
      "rgba(255,200,87,0.06)",
    border:
      "1px solid rgba(255,200,87,0.15)",
    color: "#ffc857",
    fontSize: 9,
    fontWeight: 800,
  },

  eventList: {
    display: "flex",
    flexDirection: "column",
  },

  event: {
    display: "grid",
    gridTemplateColumns:
      "80px 70px 1fr",
    alignItems: "center",
    gap: 12,
    padding: "11px 0",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
  },

  eventTime: {
    color: "#526076",
    fontFamily: "monospace",
    fontSize: 9,
  },

  eventSeverity: {
    fontSize: 8,
    fontWeight: 900,
  },

  eventContent: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    fontSize: 10,
  },

  liveText: {
    color: "#42d9ff",
    fontSize: 8,
    fontWeight: 900,
  },

  recommendation: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 15,
    borderRadius: 12,
    border:
      "1px solid rgba(255,200,87,0.16)",
    background:
      "rgba(255,200,87,0.045)",
    marginBottom: 15,
  },

  recommendationIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    background:
      "rgba(255,200,87,0.12)",
    color: "#ffc857",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },

  reviewButton: {
    marginLeft: "auto",
    padding: "8px 12px",
    borderRadius: 7,
    border:
      "1px solid rgba(255,200,87,0.25)",
    background:
      "rgba(255,200,87,0.08)",
    color: "#ffc857",
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