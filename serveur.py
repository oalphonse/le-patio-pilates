#!/usr/bin/env python3
"""Serveur local du site Le Patio.

- Sert les pages du site (comme un hébergement classique).
- /api/interet-samedi et /api/interet-dimanche : comptent les personnes intéressées
  par des cours ce jour-là (un fichier par jour dans donnees/).
    POST -> enregistre un clic (1 seul par adresse IP et par jour), renvoie {"ok", "deja", "total"}
    GET  -> renvoie {"total"}
Les adresses IP ne sont jamais stockées en clair : seule une empreinte salée
(SHA-256) est gardée, suffisante pour ne compter chaque personne qu'une fois.

Lancement :
  sur le poste :            python3 serveur.py                (http://localhost:8765)
  sur le serveur de dev :   python3 serveur.py --port 8790    (port réservé au Patio)
  Options : --port N (ou variable PORT), --hote ADRESSE (ou variable HOTE).
  Par défaut le serveur n'écoute qu'en local (127.0.0.1) : sur le VPS on y accède
  par un tunnel SSH, sans ouvrir de port sur internet. --hote 0.0.0.0 l'ouvre à tous.
"""
import argparse
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
JOURS_INTERET = ("samedi", "dimanche")
FICHIER_SEL = os.path.join(DONNEES, "sel.txt")
PORT = int(os.environ.get("PORT", "8765"))
HOTE = os.environ.get("HOTE", "127.0.0.1")
VERROU = threading.Lock()


def sel():
    os.makedirs(DONNEES, exist_ok=True)
    if not os.path.exists(FICHIER_SEL):
        with open(FICHIER_SEL, "w") as f:
            f.write(secrets.token_hex(32))
    with open(FICHIER_SEL) as f:
        return f.read().strip()


def fichier_votes(jour):
    return os.path.join(DONNEES, f"interet-{jour}.json")


def jour_api(chemin):
    """« /api/interet-samedi » -> « samedi » ; None si ce n'est pas une adresse de compteur."""
    for jour in JOURS_INTERET:
        if chemin.rstrip("/") == f"/api/interet-{jour}":
            return jour
    return None


def lire_votes(jour):
    try:
        with open(fichier_votes(jour), encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"votes": {}}


def ecrire_votes(jour, data):
    tmp = fichier_votes(jour) + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    os.replace(tmp, fichier_votes(jour))


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
        jour = jour_api(p)
        if jour:
            with VERROU:
                total = len(lire_votes(jour)["votes"])
            return self.repondre_json(200, {"total": total})
        if p.startswith(self.PRIVE):
            return self.send_error(404)
        return super().do_GET()

    def do_HEAD(self):
        if self.chemin().startswith(self.PRIVE):
            return self.send_error(404)
        return super().do_HEAD()

    def do_POST(self):
        jour = jour_api(self.chemin())
        if not jour:
            return self.send_error(404)
        empreinte = hashlib.sha256((SEL + self.ip_client()).encode("utf-8")).hexdigest()
        with VERROU:
            data = lire_votes(jour)
            deja = empreinte in data["votes"]
            if not deja:
                data["votes"][empreinte] = datetime.now(timezone.utc).isoformat(timespec="seconds")
                ecrire_votes(jour, data)
            total = len(data["votes"])
        self.repondre_json(200, {"ok": True, "deja": deja, "total": total})

    def end_headers(self):
        # En local, toujours revalider les fichiers : une modification se voit dès le rechargement.
        if not any(h.lower().startswith(b"cache-control") for h in getattr(self, "_headers_buffer", [])):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # pas d'IP dans les journaux


if __name__ == "__main__":
    arguments = argparse.ArgumentParser(description="Serveur du site Le Patio")
    arguments.add_argument("--port", type=int, default=PORT, help="port d'écoute (8765 sur le poste, 8790 sur le serveur de dev)")
    arguments.add_argument("--hote", default=HOTE, help="adresse d'écoute (127.0.0.1 par défaut ; 0.0.0.0 = ouvert à tous)")
    options = arguments.parse_args()
    SEL = sel()
    serveur = ThreadingHTTPServer((options.hote, options.port), partial(Gestionnaire, directory=RACINE))
    print(f"Le Patio : http://localhost:{options.port}  (écoute sur {options.hote}, Ctrl+C pour arrêter)")
    serveur.serve_forever()
