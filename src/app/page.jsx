"use client";
import Kartica from "@/komponente/Kartica";
import Strelica from "@/komponente/ikone/Strelica";
import Footer from "@/komponente/navbar/Footer";
import Navbar from "@/komponente/navbar/Navbar";
import { useEffect, useState } from "react";

const Pocetna = () => {
  // 1. useState hookovi
  const [projekti, setProjekti] = useState([]);
  const idKorisnika = 27;
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
  };
  // 4. useEffect za dohvatanje projekata na inicijalnom ucitavanju stranice
  useEffect(() => {
    dohvatiProjekte();
  });
  return (
    <>
      <Navbar />
      <main className="flex flex-col gap-12 text-white">
        {/* Dobrodošlica */}
        <h1 className="ml-12 text-xl">Dobrodošao/la, Marko</h1>
        {/* Pretraga i sortiranje */}
        <div className="flex px-10 w-[596px] md:w-[640px] lg:w-[768px] gap-8 ">
          <button className="flex flex-col justify-items-center align-middle">
            <Strelica klase={`w-8 h-8`} />
            <h2>Datum</h2>
          </button>
          <input
            placeholder="Pretrazite slike"
            className="w-[85%] p-4 bg-white h-12 rounded-xl text-black"
          ></input>
        </div>
        {/* Projekti */}
        <div className="flex px-10 gap-6">
          {projekti.map((item) => (
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
    </>
  );
};

export default Pocetna;
