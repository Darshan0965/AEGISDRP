"use client";

import { useEffect, useMemo, useState } from "react";

type RiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

type RiskEntity = {
  name: string;
  type: string;
  score: number;
  change: number;
  events: number;
  status: string;
};

type ThreatPoint = {
  label: string;
  value: number;
};

const attackVectors = [
  "Brute Force",
  "DDoS",
  "Port Scan",
  "Credential Attack",
  "Malware",
  "API Abuse",
];

const systems = [
  "Production Server",
  "Web Server",
  "Database Server",
  "API Gateway",
  "File Server",
  "Authentication Server",
];

const countries = [
  ["India", 34],
  ["United States", 21],
  ["Germany", 14],
  ["Singapore", 11],
  ["Russia", 9],
  ["United Kingdom", 7],
  ["Other", 4],
];

function randomBetween(
  min: number,
  max: number
) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  );
}

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

function getRiskLevel(
  score: number
): RiskLevel {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

function riskColor(
  level: RiskLevel
) {
  switch (level) {
    case "CRITICAL":
      return "#ef4444";

    case "HIGH":
      return "#f97316";

    case "MEDIUM":
      return "#eab308";

    default:
      return "#22c55e";
  }
}

export default function RiskAnalyticsDummy() {
  const [tick, setTick] =
    useState(0);

  const [riskScore, setRiskScore] =
    useState(64);

  const [eventsPerMinute, setEventsPerMinute] =
    useState(17);

  const [anomalyIndex, setAnomalyIndex] =
    useState(42);

  const [attackPressure, setAttackPressure] =
    useState(58);

  const [activeEntities, setActiveEntities] =
    useState(27);

  const [resolvedEvents, setResolvedEvents] =
    useState(68);

  const [threatVelocity, setThreatVelocity] =
    useState(12);

  const [forecastRisk, setForecastRisk] =
    useState(71);

  const [riskHistory, setRiskHistory] =
    useState<number[]>(
      [31, 35, 39, 36, 44, 48, 46, 52, 55, 51, 58, 62, 59, 64]
    );

  const [threatHistory, setThreatHistory] =
    useState<number[]>(
      [8, 11, 9, 14, 12, 18, 16, 21, 17, 23, 19, 24, 21, 27]
    );

  const [entities, setEntities] =
    useState<RiskEntity[]>([
      {
        name: "Production Server",
        type: "HOST",
        score: 87,
        change: 14,
        events: 31,
        status: "CRITICAL",
      },
      {
        name: "Web Server",
        type: "HOST",
        score: 72,
        change: 8,
        events: 24,
        status: "HIGH",
      },
      {
        name: "Database Server",
        type: "HOST",
        score: 61,
        change: -3,
        events: 17,
        status: "HIGH",
      },
      {
        name: "API Gateway",
        type: "SERVICE",
        score: 49,
        change: 6,
        events: 13,
        status: "MEDIUM",
      },
      {
        name: "Authentication Server",
        type: "HOST",
        score: 38,
        change: -5,
        events: 9,
        status: "MEDIUM",
      },
    ]);

  const [vectorValues, setVectorValues] =
    useState<number[]>([
      82,
      69,
      55,
      48,
      37,
      31,
    ]);

  const [systemRisk, setSystemRisk] =
    useState<number[]>([
      86,
      72,
      61,
      49,
      38,
      32,
    ]);

  /* =====================================================
     REAL-TIME SIMULATION
  ===================================================== */

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        setTick(
          (previous) =>
            previous + 1
        );

        setRiskScore(
          (previous) =>
            clamp(
              previous +
                randomBetween(-4, 5),
              18,
              96
            )
        );

        setEventsPerMinute(
          randomBetween(8, 34)
        );

        setAnomalyIndex(
          randomBetween(18, 88)
        );

        setAttackPressure(
          randomBetween(25, 94)
        );

        setActiveEntities(
          randomBetween(18, 43)
        );

        setResolvedEvents(
          (previous) =>
            clamp(
              previous +
                randomBetween(-2, 3),
              42,
              96
            )
        );

        setThreatVelocity(
          randomBetween(4, 29)
        );

        setForecastRisk(
          randomBetween(35, 91)
        );

        setRiskHistory(
          (previous) => [
            ...previous.slice(1),
            clamp(
              previous[
                previous.length - 1
              ] +
                randomBetween(-5, 6),
              10,
              100
            ),
          ]
        );

        setThreatHistory(
          (previous) => [
            ...previous.slice(1),
            randomBetween(5, 32),
          ]
        );

        setVectorValues(
          attackVectors.map(
            () =>
              randomBetween(20, 95)
          )
        );

        setSystemRisk(
          systems.map(
            () =>
              randomBetween(15, 94)
          )
        );

        setEntities(
          (previous) =>
            previous.map(
              (entity) => {
                const newScore =
                  clamp(
                    entity.score +
                      randomBetween(
                        -5,
                        6
                      ),
                    10,
                    98
                  );

                return {
                  ...entity,
                  score: newScore,
                  change:
                    randomBetween(
                      -12,
                      18
                    ),
                  events:
                    Math.max(
                      1,
                      entity.events +
                        randomBetween(
                          -2,
                          4
                        )
                    ),
                  status:
                    getRiskLevel(
                      newScore
                    ),
                };
              }
            )
        );
      }, 3000);

    return () =>
      window.clearInterval(
        interval
      );
  }, []);

  const riskLevel =
    getRiskLevel(riskScore);

  const riskColorValue =
    riskColor(riskLevel);

  const averageRisk =
    Math.round(
      entities.reduce(
        (sum, entity) =>
          sum + entity.score,
        0
      ) / entities.length
    );

  const highestEntity =
    [...entities].sort(
      (a, b) =>
        b.score - a.score
    )[0];

  const anomalyCount =
    Math.round(
      anomalyIndex * 0.42
    );

  const riskTrend =
    riskHistory[
      riskHistory.length - 1
    ] -
    riskHistory[
      riskHistory.length - 2
    ];

  const threatTrend =
    threatHistory[
      threatHistory.length - 1
    ] -
    threatHistory[
      threatHistory.length - 2
    ];

  const responseEfficiency =
    clamp(
      resolvedEvents -
        anomalyIndex * 0.12,
      20,
      98
    );

  const estimatedMTTR =
    clamp(
      Math.round(
        42 -
          responseEfficiency *
            0.25 +
          randomBetween(
            0,
            4
          )
      ),
      8,
      45
    );

  const confidence =
    clamp(
      92 -
        Math.abs(
          forecastRisk -
            riskScore
        ),
      61,
      96
    );

  /* =====================================================
     RISK FACTORS
  ===================================================== */

  const riskFactors = [
    {
      name: "Threat Volume",
      value: eventsPerMinute,
      weight: 25,
      description:
        "Security events per minute",
    },
    {
      name: "Anomaly Activity",
      value: anomalyIndex,
      weight: 22,
      description:
        "Behavioral deviation index",
    },
    {
      name: "Attack Pressure",
      value: attackPressure,
      weight: 20,
      description:
        "Current attack intensity",
    },
    {
      name: "Entity Exposure",
      value: Math.round(
        (activeEntities /
          50) *
          100
      ),
      weight: 18,
      description:
        "High-risk entities exposed",
    },
    {
      name: "Response Load",
      value: Math.round(
        100 -
          responseEfficiency
      ),
      weight: 15,
      description:
        "Unresolved response workload",
    },
  ];

  /* =====================================================
     CHART POINTS
  ===================================================== */

  const riskChartPoints =
    useMemo(() => {
      const width = 760;
      const height = 210;

      return riskHistory
        .map(
          (value, index) => {
            const x =
              (index /
                (riskHistory.length -
                  1)) *
              width;

            const y =
              height -
              (value / 100) *
                height;

            return `${x},${y}`;
          }
        )
        .join(" ");
    }, [riskHistory]);

  const threatChartPoints =
    useMemo(() => {
      const width = 760;
      const height = 180;

      const max =
        Math.max(
          ...threatHistory,
          1
        );

      return threatHistory
        .map(
          (value, index) => {
            const x =
              (index /
                (threatHistory.length -
                  1)) *
              width;

            const y =
              height -
              (value / max) *
                height;

            return `${x},${y}`;
          }
        )
        .join(" ");
    }, [threatHistory]);

  return (
    <main style={styles.page}>

      {/* =================================================
          HEADER
      ================================================= */}

      <header style={styles.header}>

        <div>

          <div style={styles.breadcrumb}>
            AEGISDRP / ANALYTICS
          </div>

          <h1 style={styles.title}>
            Risk Analytics
          </h1>

          <p style={styles.subtitle}>
            Real-time security intelligence,
            behavioral analytics and
            predictive risk analysis
          </p>

        </div>

        <div style={styles.headerRight}>

          <div style={styles.liveStatus}>
            <span
              style={styles.liveDot}
            />
            LIVE ANALYTICS
          </div>

          <div style={styles.updated}>
            Update cycle #{tick}
          </div>

        </div>

      </header>


      {/* =================================================
          TOP KPI CARDS
      ================================================= */}

      <section style={styles.kpiGrid}>

        <KpiCard
          title="GLOBAL RISK"
          value={`${riskScore}/100`}
          description={`${riskLevel} environment`}
          color={riskColorValue}
          icon="◈"
          trend={riskTrend}
        />

        <KpiCard
          title="THREAT VELOCITY"
          value={`${threatVelocity}/min`}
          description="Current threat generation"
          color="#ef4444"
          icon="⚡"
          trend={threatTrend}
        />

        <KpiCard
          title="ANOMALY INDEX"
          value={`${anomalyIndex}`}
          description={`${anomalyCount} anomalous signals`}
          color="#a855f7"
          icon="⌁"
          trend={anomalyIndex > 60 ? 9 : -4}
        />

        <KpiCard
          title="24H FORECAST"
          value={`${forecastRisk}`}
          description={`${confidence}% confidence`}
          color="#eab308"
          icon="◒"
          trend={
            forecastRisk -
            riskScore
          }
        />

      </section>


      {/* =================================================
          LIVE RISK TREND + RISK GAUGE
      ================================================= */}

      <section
        style={styles.twoColumn}
      >

        <div style={styles.panel}>

          <PanelHeader
            title="Risk Trend Intelligence"
            subtitle="Live environment risk trajectory"
            badge="REAL-TIME"
          />

          <div
            style={
              styles.chartContainer
            }
          >

            <div
              style={
                styles.chartLegend
              }
            >

              <span>
                <i
                  style={{
                    ...styles.legendDot,
                    background:
                      riskColorValue,
                  }}
                />
                Risk Score
              </span>

              <span>
                Current{" "}
                <strong>
                  {riskScore}
                </strong>
              </span>

            </div>

            <svg
              viewBox="0 0 760 210"
              preserveAspectRatio="none"
              style={
                styles.svgChart
              }
            >

              {[0, 25, 50, 75, 100].map(
                (value) => (
                  <line
                    key={value}
                    x1="0"
                    x2="760"
                    y1={
                      210 -
                      (value / 100) *
                        210
                    }
                    y2={
                      210 -
                      (value / 100) *
                        210
                    }
                    stroke="rgba(148,163,184,.10)"
                    strokeWidth="1"
                  />
                )
              )}

              <polyline
                points={
                  riskChartPoints
                }
                fill="none"
                stroke={
                  riskColorValue
                }
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

            </svg>

            <div
              style={
                styles.chartLabels
              }
            >
              <span>-42m</span>
              <span>-36m</span>
              <span>-30m</span>
              <span>-24m</span>
              <span>-18m</span>
              <span>-12m</span>
              <span>-6m</span>
              <span>NOW</span>
            </div>

          </div>

        </div>


        <div style={styles.panel}>

          <PanelHeader
            title="Risk Posture"
            subtitle="Current security posture"
          />

          <div
            style={
              styles.gaugeArea
            }
          >

            <div
              style={{
                ...styles.gauge,
                background:
                  `conic-gradient(${riskColorValue} ${riskScore * 3.6}deg, rgba(255,255,255,.06) 0deg)`,
              }}
            >

              <div
                style={
                  styles.gaugeInner
                }
              >

                <strong>
                  {riskScore}
                </strong>

                <span>
                  / 100
                </span>

                <small
                  style={{
                    color:
                      riskColorValue,
                  }}
                >
                  {riskLevel}
                </small>

              </div>

            </div>

            <div
              style={
                styles.postureStats
              }
            >

              <PostureItem
                label="Avg Entity Risk"
                value={`${averageRisk}`}
              />

              <PostureItem
                label="Highest Entity"
                value={
                  highestEntity.score
                }
              />

              <PostureItem
                label="Active Entities"
                value={
                  activeEntities
                }
              />

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          THREAT VELOCITY
      ================================================= */}

      <section style={styles.panel}>

        <PanelHeader
          title="Threat Activity Intelligence"
          subtitle="Event velocity and attack pressure over time"
          badge="STREAMING"
        />

        <div
          style={
            styles.threatAnalytics
          }
        >

          <div
            style={
              styles.threatChart
            }
          >

            <svg
              viewBox="0 0 760 180"
              preserveAspectRatio="none"
              style={
                styles.svgChart
              }
            >

              {[0, 1, 2, 3, 4].map(
                (value) => (
                  <line
                    key={value}
                    x1="0"
                    x2="760"
                    y1={
                      value * 45
                    }
                    y2={
                      value * 45
                    }
                    stroke="rgba(148,163,184,.08)"
                  />
                )
              )}

              <polyline
                points={
                  threatChartPoints
                }
                fill="none"
                stroke="#60a5fa"
                strokeWidth="4"
                strokeLinecap="round"
              />

            </svg>

          </div>

          <div
            style={
              styles.activityMetrics
            }
          >

            <MetricBlock
              label="EVENTS / MIN"
              value={
                eventsPerMinute
              }
              suffix=""
              color="#60a5fa"
            />

            <MetricBlock
              label="ATTACK PRESSURE"
              value={
                attackPressure
              }
              suffix="%"
              color="#ef4444"
            />

            <MetricBlock
              label="ANOMALY INDEX"
              value={
                anomalyIndex
              }
              suffix="/100"
              color="#a855f7"
            />

          </div>

        </div>

      </section>


      {/* =================================================
          RISK FACTORS
      ================================================= */}

      <section style={styles.panel}>

        <PanelHeader
          title="Risk Factor Analysis"
          subtitle="Weighted contributors to current environment risk"
        />

        <div
          style={
            styles.factorGrid
          }
        >

          {riskFactors.map(
            (factor) => {

              const color =
                factor.value >= 75
                  ? "#ef4444"
                  : factor.value >=
                      50
                  ? "#eab308"
                  : "#22c55e";

              return (
                <div
                  key={factor.name}
                  style={
                    styles.factorCard
                  }
                >

                  <div
                    style={
                      styles.factorTop
                    }
                  >

                    <div>

                      <strong>
                        {factor.name}
                      </strong>

                      <span>
                        {factor.description}
                      </span>

                    </div>

                    <b
                      style={{
                        color,
                      }}
                    >
                      {factor.value}
                    </b>

                  </div>

                  <div
                    style={
                      styles.progressTrack
                    }
                  >

                    <div
                      style={{
                        ...styles.progressFill,
                        width:
                          `${clamp(
                            factor.value,
                            0,
                            100
                          )}%`,
                        background:
                          color,
                      }}
                    />

                  </div>

                  <div
                    style={
                      styles.factorFooter
                    }
                  >
                    <span>
                      Weight
                    </span>

                    <strong>
                      {factor.weight}%
                    </strong>
                  </div>

                </div>
              );
            }
          )}

        </div>

      </section>


      {/* =================================================
          TOP ENTITIES + ATTACK VECTORS
      ================================================= */}

      <section
        style={styles.twoColumn}
      >

        <div style={styles.panel}>

          <PanelHeader
            title="Highest Risk Entities"
            subtitle="Systems and services ranked by risk"
          />

          <div
            style={
              styles.entityList
            }
          >

            {entities.map(
              (entity, index) => {

                const color =
                  riskColor(
                    getRiskLevel(
                      entity.score
                    )
                  );

                return (
                  <div
                    key={entity.name}
                    style={
                      styles.entityRow
                    }
                  >

                    <div
                      style={
                        styles.rank
                      }
                    >
                      {index + 1}
                    </div>

                    <div
                      style={
                        styles.entityInfo
                      }
                    >

                      <strong>
                        {entity.name}
                      </strong>

                      <span>
                        {entity.type} ·{" "}
                        {entity.events} events
                      </span>

                    </div>

                    <div
                      style={
                        styles.entityChange
                      }
                    >

                      <span
                        style={{
                          color:
                            entity.change >=
                            0
                              ? "#ef4444"
                              : "#22c55e",
                        }}
                      >
                        {entity.change >=
                        0
                          ? "↑"
                          : "↓"}{" "}
                        {Math.abs(
                          entity.change
                        )}
                        %
                      </span>

                    </div>

                    <div
                      style={
                        styles.entityScore
                      }
                    >

                      <strong
                        style={{
                          color,
                        }}
                      >
                        {entity.score}
                      </strong>

                      <small>
                        {entity.status}
                      </small>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>


        <div style={styles.panel}>

          <PanelHeader
            title="Attack Vector Intelligence"
            subtitle="Current threat pressure by vector"
          />

          <div
            style={
              styles.vectorList
            }
          >

            {attackVectors.map(
              (vector, index) => {

                const value =
                  vectorValues[index];

                const color =
                  value >= 75
                    ? "#ef4444"
                    : value >= 50
                    ? "#eab308"
                    : "#22c55e";

                return (
                  <div
                    key={vector}
                    style={
                      styles.vectorRow
                    }
                  >

                    <div
                      style={
                        styles.vectorHeader
                      }>

                      <span>
                        {vector}
                      </span>

                      <strong
                        style={{
                          color,
                        }}
                      >
                        {value}%
                      </strong>

                    </div>

                    <div
                      style={
                        styles.progressTrack
                      }
                    >

                      <div
                        style={{
                          ...styles.progressFill,
                          width:
                            `${value}%`,
                          background:
                            color,
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </section>


      {/* =================================================
          SYSTEM RISK HEATMAP
      ================================================= */}

      <section style={styles.panel}>

        <PanelHeader
          title="Infrastructure Risk Matrix"
          subtitle="Real-time risk exposure across protected systems"
          badge="LIVE"
        />

        <div
          style={
            styles.systemGrid
          }
        >

          {systems.map(
            (system, index) => {

              const score =
                systemRisk[index];

              const level =
                getRiskLevel(
                  score
                );

              const color =
                riskColor(level);

              return (
                <div
                  key={system}
                  style={{
                    ...styles.systemCard,
                    borderColor:
                      `${color}40`,
                  }}
                >

                  <div
                    style={
                      styles.systemHeader
                    }>

                    <span>
                      {system}
                    </span>

                    <b
                      style={{
                        color,
                      }}
                    >
                      {score}
                    </b>

                  </div>

                  <div
                    style={
                      styles.systemLevel
                    }
                  >
                    {level} RISK
                  </div>

                  <div
                    style={
                      styles.progressTrack
                    }
                  >

                    <div
                      style={{
                        ...styles.progressFill,
                        width:
                          `${score}%`,
                        background:
                          color,
                      }}
                    />

                  </div>

                  <div
                    style={
                      styles.systemMeta
                    }>

                    <span>
                      Exposure
                    </span>

                    <span>
                      {randomBetween(
                        12,
                        96
                      )}
                      %
                    </span>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </section>


      {/* =================================================
          GEOGRAPHIC + PREDICTIVE ANALYTICS
      ================================================= */}

      <section
        style={styles.twoColumn}
      >

        <div style={styles.panel}>

          <PanelHeader
            title="Threat Origin Distribution"
            subtitle="Simulated source intelligence"
          />

          <div
            style={
              styles.countryList
            }
          >

            {countries.map(
              ([country, value]) => (

                <div
                  key={country}
                  style={
                    styles.countryRow
                  }
                >

                  <span>
                    {country}
                  </span>

                  <div
                    style={
                      styles.countryBar
                    }
                  >

                    <div
                      style={{
                        ...styles.countryFill,
                        width:
                          `${value}%`,
                      }}
                    />

                  </div>

                  <strong>
                    {value}%
                  </strong>

                </div>
              )
            )}

          </div>

        </div>


        <div style={styles.panel}>

          <PanelHeader
            title="Predictive Risk Intelligence"
            subtitle="Estimated near-term security posture"
            badge="FORECAST"
          />

          <div
            style={
              styles.forecast
            }
          >

            <div
              style={
                styles.forecastScore
              }
            >

              <span>
                24H PREDICTED RISK
              </span>

              <strong
                style={{
                  color:
                    riskColor(
                      getRiskLevel(
                        forecastRisk
                      )
                    ),
                }}
              >
                {forecastRisk}
              </strong>

              <small>
                / 100
              </small>

            </div>

            <div
              style={
                styles.forecastDetails
              }
            >

              <div>
                <span>
                  Confidence
                </span>

                <strong>
                  {confidence}%
                </strong>
              </div>

              <div>
                <span>
                  Expected MTTR
                </span>

                <strong>
                  {estimatedMTTR} min
                </strong>
              </div>

              <div>
                <span>
                  Response efficiency
                </span>

                <strong>
                  {Math.round(
                    responseEfficiency
                  )}
                  %
                </strong>
              </div>

            </div>

            <div
              style={
                styles.forecastMessage
              }
            >

              {forecastRisk >
              riskScore ? (
                <>
                  ▲ Risk pressure is
                  projected to increase.
                  Prioritize high-risk
                  entities and active
                  anomalies.
                </>
              ) : (
                <>
                  ▼ Risk pressure is
                  projected to decrease.
                  Current response activity
                  is reducing exposure.
                </>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          LIVE ANALYTICS FOOTER
      ================================================= */}

      <div
        style={
          styles.footer
        }
      >

        <span>
          AEGISDRP Risk Intelligence Engine
        </span>

        <span>
          Synthetic real-time telemetry ·
          Refreshing every 3 seconds
        </span>

        <span
          style={{
            color: "#22c55e",
          }}
        >
          ● ANALYTICS ONLINE
        </span>

      </div>

    </main>
  );
}


/* =====================================================
   KPI CARD
===================================================== */

function KpiCard({
  title,
  value,
  description,
  color,
  icon,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  color: string;
  icon: string;
  trend: number;
}) {
  return (
    <div
      style={{
        ...styles.kpiCard,
        borderTop:
          `2px solid ${color}`,
      }}
    >

      <div
        style={
          styles.kpiTop
        }>

        <span>
          {title}
        </span>

        <div
          style={{
            ...styles.kpiIcon,
            color,
            background:
              `${color}15`,
          }}
        >
          {icon}
        </div>

      </div>

      <strong
        style={{
          color,
        }}
      >
        {value}
      </strong>

      <div
        style={
          styles.kpiBottom
        }>

        <span>
          {description}
        </span>

        <b
          style={{
            color:
              trend >= 0
                ? "#ef4444"
                : "#22c55e",
          }}
        >
          {trend >= 0
            ? "↑"
            : "↓"}{" "}
          {Math.abs(trend)}%
        </b>

      </div>

    </div>
  );
}


/* =====================================================
   PANEL HEADER
===================================================== */

function PanelHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <div
      style={
        styles.panelHeader
      }
    >

      <div>

        <h2>
          {title}
        </h2>

        <p>
          {subtitle}
        </p>

      </div>

      {badge && (
        <span
          style={
            styles.panelBadge
          }
        >
          ● {badge}
        </span>
      )}

    </div>
  );
}


/* =====================================================
   POSTURE ITEM
===================================================== */

function PostureItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      style={
        styles.postureItem
      }
    >

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}


/* =====================================================
   METRIC BLOCK
===================================================== */

function MetricBlock({
  label,
  value,
  suffix,
  color,
}: {
  label: string;
  value: number;
  suffix: string;
  color: string;
}) {
  return (
    <div
      style={
        styles.metricBlock
      }
    >

      <span>
        {label}
      </span>

      <strong
        style={{
          color,
        }}
      >
        {value}
        {suffix}
      </strong>

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
    padding: "26px",
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg,#060b14,#0b1220,#070c15)",
    color: "#f8fafc",
    fontFamily:
      "Inter,Arial,Helvetica,sans-serif",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "20px",
  },

  breadcrumb: {
    color: "#60738b",
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: ".14em",
    marginBottom: "5px",
  },

  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 800,
  },

  subtitle: {
    margin:
      "5px 0 0",
    color: "#8195ad",
    fontSize: "10px",
  },

  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "7px",
  },

  liveStatus: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding:
      "7px 11px",
    borderRadius: "999px",
    color: "#22c55e",
    background:
      "rgba(34,197,94,.08)",
    border:
      "1px solid rgba(34,197,94,.18)",
    fontSize: "8px",
    fontWeight: 800,
  },

  liveDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow:
      "0 0 12px #22c55e",
  },

  updated: {
    color: "#53677e",
    fontSize: "8px",
  },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4,minmax(0,1fr))",
    gap: "12px",
    marginBottom: "14px",
  },

  kpiCard: {
    background:
      "linear-gradient(145deg,rgba(18,27,43,.97),rgba(10,17,29,.97))",
    border:
      "1px solid rgba(148,163,184,.13)",
    borderRadius: "13px",
    padding: "15px",
    minHeight: "112px",
    boxSizing: "border-box",
  },

  kpiTop: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    color: "#8b9db4",
    fontSize: "8px",
    fontWeight: 800,
  },

  kpiIcon: {
    width: "27px",
    height: "27px",
    display: "grid",
    placeItems: "center",
    borderRadius: "7px",
    fontSize: "12px",
  },

  kpiCardStrong: {},

  kpiBottom: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
    color: "#637890",
    fontSize: "8px",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0,1.65fr) minmax(330px,1fr)",
    gap: "14px",
    marginBottom: "14px",
  },

  panel: {
    background:
      "linear-gradient(145deg,rgba(17,25,40,.97),rgba(9,16,28,.97))",
    border:
      "1px solid rgba(148,163,184,.14)",
    borderRadius: "14px",
    overflow: "hidden",
    marginBottom: "14px",
    boxShadow:
      "0 15px 40px rgba(0,0,0,.18)",
  },

  panelHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding:
      "15px 17px",
    borderBottom:
      "1px solid rgba(148,163,184,.08)",
  },

  panelHeaderH2: {},

  chartContainer: {
    padding:
      "14px 17px 12px",
  },

  chartLegend: {
    display: "flex",
    justifyContent:
      "space-between",
    color: "#71859d",
    fontSize: "9px",
    marginBottom: "10px",
  },

  legendDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: "5px",
  },

  svgChart: {
    width: "100%",
    height: "210px",
    display: "block",
  },

  chartLabels: {
    display: "flex",
    justifyContent:
      "space-between",
    color: "#4d6178",
    fontSize: "7px",
    marginTop: "5px",
  },

  gaugeArea: {
    padding:
      "20px",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-around",
    gap: "20px",
  },

  gauge: {
    width: "165px",
    height: "165px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
  },

  gaugeInner: {
    width: "132px",
    height: "132px",
    borderRadius: "50%",
    background:
      "#0c1523",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent:
      "center",
  },

  postureStats: {
    display: "flex",
    flexDirection: "column",
    gap: "13px",
  },

  postureItem: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  threatAnalytics: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0,1fr) 230px",
    gap: "10px",
    padding: "14px 17px",
  },

  threatChart: {
    minWidth: 0,
  },

  activityMetrics: {
    display: "grid",
    gridTemplateColumns:
      "1fr",
    gap: "8px",
  },

  metricBlock: {
    padding:
      "12px",
    border:
      "1px solid rgba(148,163,184,.09)",
    borderRadius: "9px",
    background:
      "rgba(255,255,255,.025)",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  factorGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(5,minmax(0,1fr))",
    gap: "10px",
    padding: "14px 17px",
  },

  factorCard: {
    padding: "12px",
    border:
      "1px solid rgba(148,163,184,.09)",
    borderRadius: "10px",
    background:
      "rgba(255,255,255,.018)",
  },

  factorTop: {
    display: "flex",
    justifyContent:
      "space-between",
    gap: "8px",
  },

  factorFooter: {
    display: "flex",
    justifyContent:
      "space-between",
    color: "#596d84",
    fontSize: "7px",
    marginTop: "7px",
  },

  progressTrack: {
    height: "5px",
    borderRadius: "999px",
    background:
      "rgba(255,255,255,.07)",
    overflow: "hidden",
    marginTop: "10px",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    transition:
      "width .5s ease",
  },

  entityList: {
    padding: "4px 17px 10px",
  },

  entityRow: {
    display: "grid",
    gridTemplateColumns:
      "28px minmax(0,1fr) 70px 55px",
    gap: "9px",
    alignItems: "center",
    padding:
      "10px 0",
    borderBottom:
      "1px solid rgba(148,163,184,.07)",
  },

  rank: {
    color: "#52677f",
    fontSize: "9px",
    fontWeight: 800,
  },

  entityInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  entityChange: {
    fontSize: "8px",
  },

  entityScore: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "2px",
  },

  vectorList: {
    padding:
      "13px 17px 15px",
  },

  vectorRow: {
    marginBottom: "13px",
  },

  vectorHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    fontSize: "9px",
    color: "#9aacc0",
  },

  systemGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3,minmax(0,1fr))",
    gap: "10px",
    padding:
      "14px 17px 17px",
  },

  systemCard: {
    padding: "12px",
    border:
      "1px solid rgba(148,163,184,.12)",
    borderRadius: "10px",
    background:
      "rgba(255,255,255,.018)",
  },

  systemHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    gap: "8px",
    fontSize: "9px",
    color: "#d6e1ed",
  },

  systemLevel: {
    marginTop: "5px",
    color: "#657990",
    fontSize: "7px",
    fontWeight: 800,
  },

  systemMeta: {
    display: "flex",
    justifyContent:
      "space-between",
    marginTop: "7px",
    color: "#586d84",
    fontSize: "7px",
  },

  countryList: {
    padding:
      "15px 17px",
  },

  countryRow: {
    display: "grid",
    gridTemplateColumns:
      "110px minmax(0,1fr) 35px",
    gap: "9px",
    alignItems: "center",
    marginBottom: "11px",
    color: "#8fa3bb",
    fontSize: "8px",
  },

  countryBar: {
    height: "6px",
    borderRadius: "999px",
    background:
      "rgba(255,255,255,.06)",
    overflow: "hidden",
  },

  countryFill: {
    height: "100%",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg,#2563eb,#60a5fa)",
  },

  forecast: {
    padding: "17px",
  },

  forecastScore: {
    display: "flex",
    alignItems: "baseline",
    gap: "5px",
  },

  forecastDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3,1fr)",
    gap: "8px",
    marginTop: "18px",
  },

  forecastMessage: {
    marginTop: "17px",
    padding: "10px",
    borderRadius: "8px",
    background:
      "rgba(234,179,8,.06)",
    border:
      "1px solid rgba(234,179,8,.12)",
    color: "#9aaabd",
    fontSize: "8px",
    lineHeight: 1.5,
  },

  panelBadge: {
    padding:
      "5px 8px",
    borderRadius: "999px",
    color: "#22c55e",
    background:
      "rgba(34,197,94,.08)",
    border:
      "1px solid rgba(34,197,94,.14)",
    fontSize: "7px",
    fontWeight: 800,
  },

  footer: {
    display: "flex",
    justifyContent:
      "space-between",
    gap: "10px",
    padding:
      "5px 2px 15px",
    color: "#4f637a",
    fontSize: "7px",
  },
};