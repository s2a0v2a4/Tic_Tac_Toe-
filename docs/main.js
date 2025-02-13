const spielfelder = document.querySelectorAll(".feld");
const statusAnzeige = document.querySelector("#status");
const neustartButton = document.querySelector("#neustartBtn");
const gewinnMuster = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
let spielStand = ["", "", "", "", "", "", "", "", ""];
let aktuellerSpielerName = "X";
let spielLaueft = true;
function spielstandSpeichern() {
  const spielDaten = {
    board: spielStand,
    aktuellerSpieler: aktuellerSpielerName,
    spielLaueft
  };
  localStorage.setItem("tik-tak-toe", JSON.stringify(spielDaten));
}
function spielstandLaden() {
  const gespeicherteDaten = localStorage.getItem("tik-tak-toe");
  if (gespeicherteDaten) {
    const spielDaten = JSON.parse(gespeicherteDaten);
    spielStand = spielDaten.board;
    aktuellerSpielerName = spielDaten.aktuellerSpieler;
    spielLaueft = spielDaten.spielLaueft;
    spielfelder.forEach((feld, index) => {
      feld.textContent = spielStand[index];
    });
    if (statusAnzeige) {
      statusAnzeige.textContent = spielLaueft ? `Spieler ${aktuellerSpielerName} ist am Zug` : "Diese Runde ist beendet";
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
function feldGeklickt() {
  const feldIndex = parseInt(this.getAttribute("data-index") || "-1");
  if (spielStand[feldIndex] !== "" || !spielLaueft) {
    return;
  }
  feldMarkieren(this, feldIndex);
  gewinnCheck();
}
function feldMarkieren(feld, index) {
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
    } else if (!spielStand.some((feld) => feld === "")) {
      statusAnzeige.textContent = "Unentschieden!";
      spielLaueft = false;
    } else {
      spielerWechseln();
    }
  }
  spielstandSpeichern();
}
function spielZuruecksetzen() {
  if (!statusAnzeige) return;
  spielStand.fill("");
  spielfelder.forEach((feld) => {
    feld.textContent = "";
    feld.classList.remove("vorschauX", "vorschauO");
  });
  aktuellerSpielerName = "X";
  spielLaueft = true;
  statusAnzeige.textContent = `Spieler ${aktuellerSpielerName} ist am Zug`;
  localStorage.removeItem("tik-tak-toe");
}
function hoverEffekt() {
  if (!spielLaueft) return;
  const feldIndex = parseInt(this.getAttribute("data-index") || "-1");
  if (spielStand[feldIndex] === "") {
    this.classList.add(aktuellerSpielerName === "X" ? "vorschauX" : "vorschauO");
  }
}
function hoverEntfernen() {
  if (!spielLaueft) return;
  this.classList.remove("vorschauX", "vorschauO");
}
spielStarten();
//# sourceMappingURL=main.js.map
