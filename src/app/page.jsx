"use client";
import Confirm from "@/komponente/Confirm";
import Kartica from "@/komponente/Kartica";
import sistemPretrage from "@/komponente/funkcije/sistemPretrage";
import sistemSortiranja from "@/komponente/funkcije/sistemSortiranja";
import Strelica from "@/komponente/ikone/Strelica";
import Footer from "@/komponente/navbar/Footer";
import Navbar from "@/komponente/navbar/Navbar";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Pocetna = () => {
  // 1. useState hookovi
  const [učitavanje, setUčitavanje] = useState(true);
  const [idKorisnika, setIdKorisnika] = useState(-1);
  const [ime, setIme] = useState("");
  const [projekti, setProjekti] = useState([]);

  const [pretraga, setPretraga] = useState([]);
  const [pretrazivanje, setPretrazivanje] = useState(false);

  // 2. Dohvatanje niza projekata odredjenog korisnika
  const dohvatiProjekte = async (id) => {
    const url = await fetch("http://localhost:3001/projekti/dohvatiProjekte", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Za cookije!
      body: JSON.stringify({
        idKorisnika: id,
      }),
    });
    const res = await url.json();
    let projektiTemp = [];

    // 3. Postavljanje projekata u projekti hook za prikazivanje na ekranu
    res.data.forEach((element) => {
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
  const [provjera, setProvjera] = useState(true);
  const navigate = useRouter();

  useEffect(() => {
    (async () => {
      const req = await fetch("http://localhost:3001/korisnik/jelUlogovan", {
        method: "GET",
        redirect: "follow",
        credentials: "include", // Za cookije!
      });

      const res = await req.json();

      if (res.status == "Uspješno") {
        console.log(res);
        setIdKorisnika(res.data.id);
        setIme(res.data.ime);
        setProvjera(false);
        dohvatiProjekte(res.data.id);
      } else {
        navigate.replace("/login");
      }
    })();
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

  // 6. Funkcija za odjavljivanje
  const [potvrda, setPotvrda] = useState(false);
  const handleOdjava = async () => {
    const req = await fetch("http://localhost:3001/korisnik/odjava", {
      method: "GET",
      redirect: "follow",
      credentials: "include", // Za cookije!
    });

    const res = await req.json();
    if (res.status == "Uspješno") {
      navigate.replace("/login");
    }
    setPotvrda(false);
  };

  return (
    <>
      {potvrda && (
        <Confirm
          poruka={`Da li želite da se odjavite?`}
          setter={setPotvrda}
          cb={handleOdjava}
        ></Confirm>
      )}
      {!provjera && (
        <div className="overflow-x-scroll sm:overflow-x-hidden h-[100vh]">
          <Navbar imePrezime={ime} cb={() => setPotvrda(true)} />
          <main className="flex flex-col gap-12 text-white h-[100vh]">
            {/* Dobrodošlica */}
            <h1 className="text-md sm:text-xl absolute left-6 top-[7rem] sm:left-12 sm:top-[8rem]">
              Dobrodošao/la, {ime}
            </h1>

            {/* Pretraga i sortiranje */}
            <div className="text-sm sm:text-md flex px-6 sm:px-10 w-[100vw] md:w-[640px] lg:w-[768px] gap-8 absolute top-[10rem] sm:top-[12rem]">
              <button
                className="flex flex-col justify-items-center items-center w-8 lg:w-10 "
                onClick={sortiranje}
              >
                {!poredak && <Strelica klase={"w-8 rotate-180"} />}
                {poredak && <Strelica klase={"w-8 rotate-0"} />}
                {opcijaSortiranja}
              </button>
              <input
                placeholder="Pretrazite slike"
                className="w-[85%] p-4 bg-white h-12 rounded-xl text-black"
                onChange={pretragaCB.bind(Event)}
              ></input>
            </div>
            {/* Projekti */}
            <div className="flex justify-start px-6 sm:px-10 mt-[16rem] sm:mt-[18rem] gap-6 flex-none w-max sm:flex-wrap sm:w-auto sm:overflow-hidden ">
              {učitavanje && (
                <div className=" text-white text-3xl">Učitavanje...</div>
              )}
              {!učitavanje &&
                !pretrazivanje &&
                projekti.map((item) => (
                  <Kartica
                    key={item.id}
                    id={item.id}
                    idKorisnika={idKorisnika}
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
                    idKorisnika={idKorisnika}
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
      )}
    </>
  );
};

export default Pocetna;
