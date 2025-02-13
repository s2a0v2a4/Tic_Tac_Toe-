/*

Elemente aus dem DOM auslesen
Event-Listener (  forEach()...  )
clicked felder
Spielerwechsel nach jedem Zug
Gewinnprüfen
Unentschieden
Statusanzeige
Spiel zurücksetzen (Neustart-Button)
Hover-Effekt korrekt anzeigen
Spieldaten LC speichern
LC laden

*/

const spielfelder = document.querySelectorAll<HTMLButtonElement>(".feld");
const statusAnzeige = document.querySelector<HTMLHeadingElement>("#status");
const neustartButton = document.querySelector<HTMLButtonElement>("#neustartBtn");

const gewinnMuster = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]

];

let spielStand: string[] = ["", "", "", "", "", "", "", "", ""];
let aktuellerSpielerName: string = "X"; //// Math.random() < 0.5 ? "X" : "0"
let spielLaueft: boolean = true;

function spielstandSpeichern() {
    const spielDaten = {
        board: spielStand,
        aktuellerSpieler: aktuellerSpielerName,
        spielLaueft

    };
    localStorage.setItem("tik-tak-toe", JSON.stringify(spielDaten)); ///speicheert
}

/*
const nameInput = document.querySelector<HTMLInputElement>("#nameInput");
const speichernBtn = document.querySelector<HTMLButtonElement>("#speichernBtn");
const loeschenBtn = document.querySelector<HTMLButtonElement>("#loeschenBtn");
const anzeigeName = document.querySelector<HTMLSpanElement>("#anzeigeName");

function speicherName() {
    if (nameInput && nameInput.value) {
        localStorage.setItem("benutzername", nameInput.value);
        aktualisiereAnzeige();
    }
}

function ladeName() {
    const gespeicherterName = localStorage.getItem("benutzername") || "Gast";
    if (anzeigeName) anzeigeName.textContent = gespeicherterName;
}

function loescheName() {
    localStorage.removeItem("benutzername");
    aktualisiereAnzeige();
}

function aktualisiereAnzeige() {
    if (anzeigeName) anzeigeName.textContent = localStorage.getItem("benutzername") || "Gast";
    if (nameInput) nameInput.value = "";
}

speichernBtn?.addEventListener("click", speicherName);
loeschenBtn?.addEventListener("click", loescheName);

ladeName();



 */
////lokal laden
function spielstandLaden() {
    const gespeicherteDaten = localStorage.getItem("tik-tak-toe");
    if (gespeicherteDaten) { ////fall züge existieren werden sie geladen
        const spielDaten = JSON.parse(gespeicherteDaten);
        spielStand = spielDaten.board;
        aktuellerSpielerName = spielDaten.aktuellerSpieler;
        spielLaueft = spielDaten.spielLaueft;

        spielfelder.forEach((feld, index) => {////für jedes feld im index
            feld.textContent = spielStand[index]; //// Xe Os in den index
        });

        if (statusAnzeige) {
            statusAnzeige.textContent = spielLaueft
                ? `Spieler ${aktuellerSpielerName} ist am Zug`
                : "Diese Runde ist beendet";
        }
    }
}

function spielStarten() {
    if (!statusAnzeige || !neustartButton) {
        console.error("Ein HTML-Element wurde nicht gefunden!");
        return;
    }

    spielstandLaden();
    spielfelder.forEach((feld, index) => {
        feld.setAttribute("data-index", index.toString());
        feld.addEventListener("click", feldGeklickt);
        feld.addEventListener("mouseenter", hoverEffekt);
        feld.addEventListener("mouseleave", hoverEntfernen);
    });

    neustartButton.addEventListener("click", spielZuruecksetzen);
}

/*
*/
function feldGeklickt(this: HTMLButtonElement) {
    const feldIndex = parseInt(this.getAttribute("data-index") || "-1");

    if (spielStand[feldIndex] !== "" || !spielLaueft) {
        return;
    }
    ///

    feldMarkieren(this, feldIndex);
    gewinnCheck();
}

function feldMarkieren(feld: HTMLButtonElement, index: number) {
    spielStand[index] = aktuellerSpielerName;

    feld.textContent = aktuellerSpielerName;
    feld.classList.remove("vorschauX", "vorschauO");
    spielstandSpeichern();
}

function spielerWechseln() {
    if (!statusAnzeige) return;
    aktuellerSpielerName = aktuellerSpielerName === "X" ? "O" : "X";
    statusAnzeige.textContent = `Spieler ${aktuellerSpielerName} ist am Zug`;
}

function gewinnCheck() {
    let siegGefunden = false;

    for (const muster of gewinnMuster) {
        const [m, n, c] = muster;
        if (spielStand[m] && spielStand[m] === spielStand[n] && spielStand[m] === spielStand[c]) {
            siegGefunden = true;
            break;
        }
    }

    if (statusAnzeige) {
        if (siegGefunden) {
            statusAnzeige.textContent = `Spieler ${aktuellerSpielerName} hat gewonnen!`;
            spielLaueft = false;
        } else
        if (!spielStand.some(feld => feld === "")) {
            statusAnzeige.textContent = "Unentschieden!";
            spielLaueft = false;
        } else {
            spielerWechseln();
        }
    }
    spielstandSpeichern();
}

function spielZuruecksetzen() {
    if (!statusAnzeige) return; ////return funktion wenn statusAnzeige nicht existiert

    spielStand.fill("");
    spielfelder.forEach(feld => {
        feld.textContent = "";
        feld.classList.remove("vorschauX", "vorschauO");
    });

    aktuellerSpielerName = "X";
    spielLaueft = true;
    statusAnzeige.textContent = `Spieler ${aktuellerSpielerName} ist am Zug`;

    localStorage.removeItem("tik-tak-toe");
}

function hoverEffekt(this: HTMLButtonElement) {
    if (!spielLaueft) return;

    const feldIndex = parseInt(this.getAttribute("data-index") || "-1");
    if (spielStand[feldIndex] === "") {
        this.classList.add(aktuellerSpielerName === "X" ? "vorschauX" : "vorschauO");
    }
}

function hoverEntfernen(this: HTMLButtonElement) {
    if (!spielLaueft) return;

    this.classList.remove("vorschauX", "vorschauO");
}

spielStarten();
