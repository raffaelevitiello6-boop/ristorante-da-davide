#!/usr/bin/env python3
"""SFTP-Deploy nach IONOS: legt das Zielverzeichnis an und lädt rekursiv hoch."""
import os
import sys
import paramiko

HOST = os.environ["SFTP_HOST"]
USER = os.environ["SFTP_USER"]
PASS = os.environ["SFTP_PASS"]
PORT = int(os.environ.get("SFTP_PORT", "22"))
REMOTE_BASE = os.environ.get("REMOTE_BASE", "/public").rstrip("/") or "/"
LOCAL_DIR = os.environ.get("LOCAL_DIR", ".")
EXCLUDE = {".git", ".github"}

transport = paramiko.Transport((HOST, PORT))
transport.connect(username=USER, password=PASS)
sftp = paramiko.SFTPClient.from_transport(transport)

# --- Diagnose: echte Struktur des SFTP-Zugangs zeigen ---
try:
    print("getcwd:", sftp.getcwd())
except Exception as e:
    print("getcwd failed:", e)
for probe in ("/", ".", REMOTE_BASE):
    try:
        print(f"listdir {probe!r}:", sorted(sftp.listdir(probe)))
    except Exception as e:
        print(f"listdir {probe!r} failed: {e}")


def ensure_dir(path):
    parts = [p for p in path.split("/") if p]
    cur = ""
    for p in parts:
        cur += "/" + p
        try:
            sftp.stat(cur)
        except IOError:
            sftp.mkdir(cur)
            print("mkdir", cur)


ensure_dir(REMOTE_BASE)

count = 0
for root, dirs, files in os.walk(LOCAL_DIR):
    dirs[:] = [d for d in dirs if d not in EXCLUDE]
    rel = os.path.relpath(root, LOCAL_DIR)
    remote_root = REMOTE_BASE if rel == "." else REMOTE_BASE + "/" + rel.replace(os.sep, "/")
    ensure_dir(remote_root)
    for f in files:
        local_path = os.path.join(root, f)
        remote_path = remote_root + "/" + f
        sftp.put(local_path, remote_path)
        count += 1

print(f"Uploaded {count} files to {REMOTE_BASE}")
sftp.close()
transport.close()
