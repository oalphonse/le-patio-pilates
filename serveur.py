#!/usr/bin/env python3
"""Serveur local du site Le Patio.

- Sert les pages du site (comme un hébergement classique).
- /api/interet-samedi : compte les personnes intéressées par des cours le samedi.
    POST -> enregistre un clic (1 seul par adresse IP), renvoie {"ok", "deja", "total"}
    GET  -> renvoie {"total"}
Les adresses IP ne sont jamais stockées en clair : seule une empreinte salée
(SHA-256) est gardée, suffisante pour ne compter chaque personne qu'une fois.

Lancement :  python3 serveur.py   (puis http://localhost:8765)
"""
import hashlib
import json
import os
import secrets
import threading
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial

RACINE = os.path.dirname(os.path.abspath(__file__))
DONNEES = os.path.join(RACINE, "donnees")
FICHIER_VOTES = os.path.join(DONNEES, "interet-samedi.json")
FICHIER_SEL = os.path.join(DONNEES, "sel.txt")
PORT = int(os.environ.get("PORT", "8765"))
VERROU = threading.Lock()


def sel():
    os.makedirs(DONNEES, exist_ok=True)
    if not os.path.exists(FICHIER_SEL):
        with open(FICHIER_SEL, "w") as f:
            f.write(secrets.token_hex(32))
    with open(FICHIER_SEL) as f:
        return f.read().strip()


def lire_votes():
    try:
        with open(FICHIER_VOTES, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"votes": {}}


def ecrire_votes(data):
    tmp = FICHIER_VOTES + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    os.replace(tmp, FICHIER_VOTES)


class Gestionnaire(SimpleHTTPRequestHandler):
    PRIVE = ("/donnees", "/serveur.py", "/.git", "/.claude")

    def ip_client(self):
        # Derrière un hébergeur ou un proxy, la vraie IP est dans X-Forwarded-For.
        fwd = self.headers.get("X-Forwarded-For", "")
        return fwd.split(",")[0].strip() if fwd else self.client_address[0]

    def repondre_json(self, code, obj):
        corps = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(corps)))
        self.end_headers()
        self.wfile.write(corps)

    def chemin(self):
        return self.path.split("?", 1)[0].split("#", 1)[0]

    def do_GET(self):
        p = self.chemin()
        if p.rstrip("/") == "/api/interet-samedi":
            with VERROU:
                total = len(lire_votes()["votes"])
            return self.repondre_json(200, {"total": total})
        if p.startswith(self.PRIVE):
            return self.send_error(404)
        return super().do_GET()

    def do_HEAD(self):
        if self.chemin().startswith(self.PRIVE):
            return self.send_error(404)
        return super().do_HEAD()

    def do_POST(self):
        if self.chemin().rstrip("/") != "/api/interet-samedi":
            return self.send_error(404)
        empreinte = hashlib.sha256((SEL + self.ip_client()).encode("utf-8")).hexdigest()
        with VERROU:
            data = lire_votes()
            deja = empreinte in data["votes"]
            if not deja:
                data["votes"][empreinte] = datetime.now(timezone.utc).isoformat(timespec="seconds")
                ecrire_votes(data)
            total = len(data["votes"])
        self.repondre_json(200, {"ok": True, "deja": deja, "total": total})

    def log_message(self, fmt, *args):
        pass  # pas d'IP dans les journaux


if __name__ == "__main__":
    SEL = sel()
    serveur = ThreadingHTTPServer(("127.0.0.1", PORT), partial(Gestionnaire, directory=RACINE))
    print(f"Le Patio : http://localhost:{PORT}  (Ctrl+C pour arrêter)")
    serveur.serve_forever()
