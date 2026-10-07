from fastapi import FastAPI
from pydantic import BaseModel, Field
import httpx


app = FastAPI(
    title="AEGISDRP Detection Service",
    version="0.4.0",
    description="Threat detection engine for the AEGISDRP platform",
)


# ============================================================
# SECURITY API
# ============================================================

SECURITY_API_URL = "http://127.0.0.1:8000/security/"


# ============================================================
# REQUEST MODEL
# ============================================================

class DetectionRequest(BaseModel):
    system_id: int = Field(..., ge=1)
    source_ip: str
    destination_port: int = Field(..., ge=1, le=65535)
    request_count: int = Field(..., ge=0)
    failed_requests: int = Field(..., ge=0)


# ============================================================
# RESPONSE MODEL
# ============================================================

class DetectionResponse(BaseModel):
    threat_detected: bool
    risk_score: int
    severity: str
    reason: str
    security_event_created: bool


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "detection",
    }


# ============================================================
# DETECTION ENGINE
# ============================================================

@app.post("/detect", response_model=DetectionResponse)
async def detect(request: DetectionRequest):

    # --------------------------------------------------------
    # Calculate failed-request ratio
    # --------------------------------------------------------

    if request.request_count == 0:
        failure_ratio = 0
    else:
        failure_ratio = (
            request.failed_requests / request.request_count
        )

    # --------------------------------------------------------
    # Initialize risk calculation
    # --------------------------------------------------------

    risk_score = 0
    reasons = []

    # --------------------------------------------------------
    # RULE 1: High request volume
    # --------------------------------------------------------

    if request.request_count >= 100:
        risk_score += 30
        reasons.append("High request volume")

    # --------------------------------------------------------
    # RULE 2: High failed-request ratio
    # --------------------------------------------------------

    if failure_ratio >= 0.50:
        risk_score += 40
        reasons.append("High failed-request ratio")

    elif failure_ratio >= 0.25:
        risk_score += 20
        reasons.append("Elevated failed-request ratio")

    # --------------------------------------------------------
    # RULE 3: Suspicious destination ports
    # --------------------------------------------------------

    suspicious_ports = {
        21,
        22,
        23,
        445,
        3389,
    }

    if request.destination_port in suspicious_ports:
        risk_score += 20
        reasons.append("Suspicious destination port")

    # --------------------------------------------------------
    # Keep score between 0 and 100
    # --------------------------------------------------------

    risk_score = min(risk_score, 100)

    # --------------------------------------------------------
    # Determine severity
    # --------------------------------------------------------

    if risk_score >= 70:
        severity = "high"
        threat_detected = True

    elif risk_score >= 40:
        severity = "medium"
        threat_detected = True

    else:
        severity = "low"
        threat_detected = False

    # --------------------------------------------------------
    # Build reason
    # --------------------------------------------------------

    if reasons:
        reason = ", ".join(reasons)
    else:
        reason = "No significant threat indicators detected"

    # --------------------------------------------------------
    # Security event creation
    # --------------------------------------------------------

    security_event_created = False

    if threat_detected:

        security_payload = {
            "system_id": request.system_id,
            "event_type": "Automated Threat Detection",
            "severity": severity.upper(),
            "source_ip": request.source_ip,
            "destination_ip": None,
            "description": (
                f"Risk Score: {risk_score}. "
                f"Destination Port: {request.destination_port}. "
                f"Reason: {reason}"
            ),
            "status": "OPEN",
        }

        try:

            async with httpx.AsyncClient(timeout=10.0) as client:

                response = await client.post(
                    SECURITY_API_URL,
                    json=security_payload,
                )

                # ------------------------------------------------
                # Accept any successful 2xx response
                # ------------------------------------------------

                if 200 <= response.status_code < 300:

                    security_event_created = True

                    print(
                        "SECURITY EVENT CREATED SUCCESSFULLY"
                    )

                    print(
                        f"Security API Status: {response.status_code}"
                    )

                else:

                    print(
                        "WARNING: Security API rejected event"
                    )

                    print(
                        f"Status Code: {response.status_code}"
                    )

                    print(
                        f"Response: {response.text}"
                    )

        except httpx.HTTPError as error:

            print(
                "WARNING: Could not connect to Security API"
            )

            print(
                f"Error: {error}"
            )

        except Exception as error:

            print(
                "ERROR: Unexpected Security API error"
            )

            print(
                f"Error: {error}"
            )

    # --------------------------------------------------------
    # Return detection result
    # --------------------------------------------------------

    return {
        "threat_detected": threat_detected,
        "risk_score": risk_score,
        "severity": severity,
        "reason": reason,
        "security_event_created": security_event_created,
    }