"use client";
import Kartica from "@/komponente/Kartica";
import sistemPretrage from "@/komponente/funkcije/sistemPretrage";
import sistemSortiranja from "@/komponente/funkcije/sistemSortiranja";
import Strelica from "@/komponente/ikone/Strelica";
import Footer from "@/komponente/navbar/Footer";
import Navbar from "@/komponente/navbar/Navbar";
import { useEffect, useState } from "react";

const Pocetna = () => {
  // 1. useState hookovi
  const [učitavanje, setUčitavanje] = useState(true);
  const [projekti, setProjekti] = useState([]);
  const idKorisnika = 27;

  const [pretraga, setPretraga] = useState([]);
  const [pretrazivanje, setPretrazivanje] = useState(false);

  // 2. Dohvatanje niza projekata odredjenog korisnika
  const dohvatiProjekte = async () => {
    const url = await fetch("http://localhost:3001/projekti/dohvatiProjekte", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idKorisnika: idKorisnika,
      }),
    });
    const res = await url.json();
    let projektiTemp = [];
    // 3. Postavljanje projekata u projekti hook za prikazivanje na ekranu
    res.projekti.forEach((element) => {
      projektiTemp.push({
        id: element.id,
        imeProjekta: element.ime_projekta,
        slika: element.slika,
        datumKreiranja: element.datum_kreiranja,
      });
    });
    setProjekti(projektiTemp);
    setUčitavanje(false);
  };
  // 4. useEffect za dohvatanje projekata na inicijalnom ucitavanju stranice
  useEffect(() => {
    dohvatiProjekte();
  }, []);
  // 5. Sortiranje pretraga
  const [opcijaSortiranja, setOpcijaSortiranja] = useState("Datum");
  const [poredak, setPoredak] = useState(true);
  const sortiranje = () => {
    sistemSortiranja(projekti, opcijaSortiranja, poredak);
    if (poredak) setPoredak(false);
    else {
      opcijaSortiranja === "Datum"
        ? setOpcijaSortiranja("Abc")
        : setOpcijaSortiranja("Datum");
      setPoredak(true);
    }
  };
  const pretragaCB = (e) => {
    e.target.value !== "" ? setPretrazivanje(true) : setPretrazivanje(false);
    const pretraga = e.target.value;
    const pretrazeniProjekti = projekti.filter((item) =>
      sistemPretrage(pretraga, item.imeProjekta)
    );

    setPretraga(pretrazeniProjekti);
  };
  return (
    <div className="overflow-x-scroll sm:overflow-x-hidden h-[100vh]">
      <Navbar />
      <main className="flex flex-col gap-12 text-white h-[100vh]">
        {/* Dobrodošlica */}
        <h1 className="text-md sm:text-xl absolute left-6 top-[7rem] sm:left-12 sm:top-[8rem]">
          Dobrodošao/la, Marko
        </h1>

        {/* Pretraga i sortiranje */}
        <div className="text-sm sm:text-md flex px-6 sm:px-10 w-[100vw] md:w-[640px] lg:w-[768px] gap-8 absolute top-[10rem] sm:top-[12rem]">
          <button
            className="flex flex-col justify-items-center items-center w-10"
            onClick={sortiranje}
          >
            {!poredak && <Strelica velicina={"h-6 w-6"} klase={"rotate-180"} />}
            {poredak && <Strelica velicina={"h-6 w-6"} klase={"rotate-0"} />}
            {opcijaSortiranja}
          </button>
          <input
            placeholder="Pretrazite slike"
            className="w-[85%] p-4 bg-white h-12 rounded-xl text-black"
            onChange={pretragaCB.bind(Event)}
          ></input>
        </div>
        {/* Projekti */}
        <div className="flex justify-start px-6 sm:px-10 mt-[16rem] sm:mt-[18rem] gap-6 flex-none w-max overflow-scroll sm:flex-wrap sm:w-auto sm:overflow-hidden ">
          {učitavanje && (
            <div className=" text-white text-3xl">Učitavanje...</div>
          )}
          {!učitavanje &&
            !pretrazivanje &&
            projekti.map((item) => (
              <Kartica
                key={item.id}
                id={item.id}
                naziv={item.imeProjekta}
                slika={item.slika}
                datum={item.datumKreiranja}
              />
            ))}
          {!učitavanje &&
            pretrazivanje &&
            pretraga.map((item) => (
              <Kartica
                key={item.id}
                id={item.id}
                naziv={item.imeProjekta}
                slika={item.slika}
                datum={item.datumKreiranja}
              />
            ))}
        </div>
      </main>
      {/* Podnozje sa dugmicima zapocinjanja projekta */}
      <Footer />
    </div>
  );
};

export default Pocetna;
