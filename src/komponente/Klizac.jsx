import { useEffect, useRef } from "react";

const Klizac = ({ sirina, def, setter, menu, indeks }) => {
  // *** Klizac - Komponenta koja podesava vrijednosti prilikom uredjivanja ***

  // elemenat useRef hook - Koristi se za dohvatanje dimenzija elemenata nakon rendera
  const elemenat = useRef();

  // Deklaracija svih nadalje potrebnih varijabli (kasnije objasnjeno)
  let klizacEl, barEl, dimenzije, maxPozicija, misPozicija, klizac;

  // Varijabla koja omogucava pomjeranje klizaca
  let pomjeranje = false;

  // Sljedeci useEffect hook pronalazi potrebne elemente za svaki filter posebno u DOM-u i postavlja podrazumjevane
  // vrijednosti zadatog klizaca
  useEffect(() => {
    klizac = def / 2;
    if (!klizacEl) klizacEl = document.querySelectorAll(".klizac")[indeks];
    if (!barEl) barEl = klizacEl.nextElementSibling;
    klizacEl.style.transform = `translate(${klizac * (sirina / 16)}rem, -8px)`;
    barEl.style.width = klizac * (sirina / 16) + "rem";
  }, []);

  // Funkcija koja se poziva iz handleKlizac
  const pomjeranjeEv = (event) => {
    if (!pomjeranje) return;
    // 1. Postavi se pozicija miša koja predstavlja najmanju vrijednost na skali
    if (event.clientX) {
      misPozicija = event.clientX - dimenzije.x;
    } else {
      misPozicija = event.touches[0].clientX - dimenzije.x;
    }
    // 2. Iduca vrijednost se zaokružuje na dvije decimale
    klizac = Math.round((misPozicija / maxPozicija) * 100) / 100;
    // 3. Granice klizaca
    if (klizac < 0 || klizac > 1) return;
    // 4. Nova vrijednost se renderuje zajedno sa 'zelenim barom'
    // console.log(`translate(${klizac * (sirina / 16)}rem, -8px)`);
    klizacEl.style.transform = `translate(${klizac * (sirina / 16)}rem, -8px)`;
    barEl.style.width = misPozicija + "px";
    // 5. Vrijednost koja se renderovala se sačuva i primjenjuje se filter pomnožen sa vrijednoscu od 0.00 do 1.00
    setter(klizac * 2, menu, indeks);
  };

  // Sljedeca funkcija koja se poziva na dogadjaj "onClick" pomjera miš na sljedeci nacin
  const handleKlizac = (event) => {
    // 1. Varijabla 'pomjeranje' postaje pozitivna pa će se klizač pomjerati prilikom klika miša
    pomjeranje = true;
    // 2. Odredjuju se dimenzije elementa
    if (!dimenzije) dimenzije = elemenat.current.getBoundingClientRect();
    // 3. Odredjuje se maksimalna pozicija misa
    if (!maxPozicija) maxPozicija = dimenzije.width;
    // 4. Poziva se funkcija pomjeranja
    pomjeranjeEv(event);
  };

  // Dodavanje EventListenera za klik miša, pomjeranje i na kraju za puštanje miša
  document.addEventListener("mousemove", (event) => pomjeranjeEv(event));
  document.addEventListener("touchmove", (event) => pomjeranjeEv(event));

  document.addEventListener("mouseup", () => (pomjeranje = false));
  document.addEventListener("touchend", () => (pomjeranje = false));

  // Vizualcizacija
  return (
    <span className="block relative bg-white h-2 w-[300px] z-10" ref={elemenat}>
      <div
        className="klizac absolute -left-3 translate-x-[150px] -translate-y-[33%] h-6 w-6 rounded-full bg-green-600 cursor-pointer z-30"
        onTouchStart={handleKlizac}
        onMouseDown={handleKlizac}
      ></div>
      <div className="bar absolute h-2 w-[150px] bg-green-400 z-20"></div>
    </span>
  );
};

export default Klizac;
