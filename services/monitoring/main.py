import asyncio
import os
import time

import httpx
import psutil


API_URL = os.getenv(
    "AEGIS_API_URL",
    "http://127.0.0.1:8000",
)

SYSTEM_ID = int(
    os.getenv(
        "AEGIS_SYSTEM_ID",
        "1",
    )
)

HEARTBEAT_INTERVAL = int(
    os.getenv(
        "AEGIS_HEARTBEAT_INTERVAL",
        "10",
    )
)


# ============================================================
# SYSTEM METRICS
# ============================================================


def get_cpu_usage() -> float:
    return round(
        psutil.cpu_percent(
            interval=1
        ),
        2,
    )


def get_memory_usage() -> float:
    memory = psutil.virtual_memory()

    return round(
        memory.percent,
        2,
    )


def get_disk_usage() -> float:
    disk = psutil.disk_usage(
        os.path.abspath(
            os.sep
        )
    )

    return round(
        disk.percent,
        2,
    )


def get_network_usage() -> tuple[float, float]:
    network = psutil.net_io_counters()

    network_in_mb = round(
        network.bytes_recv / (
            1024 * 1024
        ),
        2,
    )

    network_out_mb = round(
        network.bytes_sent / (
            1024 * 1024
        ),
        2,
    )

    return (
        network_in_mb,
        network_out_mb,
    )


def get_uptime_seconds() -> int:
    boot_time = psutil.boot_time()

    uptime = (
        time.time() - boot_time
    )

    return max(
        0,
        int(uptime),
    )


# ============================================================
# COLLECT ALL METRICS
# ============================================================


def collect_metrics():
    network_in, network_out = (
        get_network_usage()
    )

    return {
        "cpu_usage": get_cpu_usage(),

        "memory_usage": get_memory_usage(),

        "disk_usage": get_disk_usage(),

        "network_in": network_in,

        "network_out": network_out,

        "uptime_seconds":
            get_uptime_seconds(),
    }


# ============================================================
# SEND HEARTBEAT
# ============================================================


async def send_heartbeat():
    metrics = collect_metrics()

    url = (
        f"{API_URL}/systems/"
        f"{SYSTEM_ID}/heartbeat"
    )

    try:
        async with httpx.AsyncClient(
            timeout=10.0
        ) as client:

            response = await client.post(
                url,
                json=metrics,
            )

            if response.is_success:

                print(
                    "HEARTBEAT SENT | "
                    f"CPU: {metrics['cpu_usage']}% | "
                    f"RAM: {metrics['memory_usage']}% | "
                    f"DISK: {metrics['disk_usage']}% | "
                    f"NET IN: {metrics['network_in']} MB | "
                    f"NET OUT: {metrics['network_out']} MB"
                )

            else:

                print(
                    "HEARTBEAT FAILED | "
                    f"HTTP {response.status_code} | "
                    f"{response.text}"
                )

    except httpx.HTTPError as error:

        print(
            "API CONNECTION ERROR | "
            f"{error}"
        )


# ============================================================
# MONITORING LOOP
# ============================================================


async def monitoring_loop():

    print(
        "========================================"
    )

    print(
        "AEGISDRP SYSTEM MONITORING AGENT"
    )

    print(
        "========================================"
    )

    print(
        f"API URL    : {API_URL}"
    )

    print(
        f"SYSTEM ID  : {SYSTEM_ID}"
    )

    print(
        f"INTERVAL   : {HEARTBEAT_INTERVAL} seconds"
    )

    print(
        "========================================"
    )

    while True:

        await send_heartbeat()

        await asyncio.sleep(
            HEARTBEAT_INTERVAL
        )


# ============================================================
# START
# ============================================================


if __name__ == "__main__":

    try:

        asyncio.run(
            monitoring_loop()
        )

    except KeyboardInterrupt:

        print(
            "\nAEGISDRP monitoring agent stopped."
        )