"use client";
import Link from "next/link";
import { useState } from "react";
import Alert from "../Alert";
import Dodaj from "../ikone/Dodaj";
import Covjek from "../ikone/Covjek";

const Footer = () => {
  // State hookovi - služe za prikazivanje sekcije za uredjivanje s prijateljima
  const [uredjivanjeSPrijateljima, setUredjivanjeSPrijateljima] =
    useState(false);
  const [kreiranjeKoda, setKreiranjeKoda] = useState(false);

  // Handle funkcije - služe za interakciju dugmica za uredjivanje s prijateljima
  const handleUrediSPrijateljem = () => {
    setUredjivanjeSPrijateljima(true);
  };
  const handleKreirajKod = () => {
    setKreiranjeKoda(true);
  };
  // Vizualizacija
  return (
    <div className="fixed right-[-22vw] sm:right-[-32vw] md:translate-x-[0vw] bottom-[4vh] flex gap-4 justify-center align-middle w-full h-20">
      {/* Dugmici koji se podrazumjevano prikazuju */}
      {!uredjivanjeSPrijateljima && (
        <div className="bg-green-100 p-6 md:4 lg:p-6 font-bold rounded-full md:rounded-2xl flex justify-center items-center shadow-xl">
          <Covjek velicina={512} klase={`w-8 md:mr-2 lg:mr-4`} />
          <button
            className="text-sm hidden md:block lg:text-md "
            onClick={handleUrediSPrijateljem}
          >
            Uredi s prijateljem
          </button>
        </div>
      )}
      {!uredjivanjeSPrijateljima && (
        <Link
          href="/nova-slika"
          className="bg-green-300 p-6 md:4 lg:p-6 font-bold rounded-full md:rounded-2xl flex justify-center items-center shadow-xl"
        >
          <Dodaj velicina={512} klase={`w-8 md:mr-2 lg:mr-4 `} />
          <button className="text-sm hidden md:block lg:text-md ">
            Novi projekat
          </button>
        </Link>
      )}

      {/* Dugmici koji se prikazuju prilikom uredjivanja s prijateljima*/}
      {uredjivanjeSPrijateljima && (
        <>
          <input
            className="w-64 p-4 text-xl my-auto bg-transparent border-b-2 focus:outline-none text-white"
            placeholder="Unesi kod"
          ></input>
          <button
            className=" bg-green-300 p-6 font-bold rounded-2xl"
            onClick={handleUrediSPrijateljem}
          >
            Pridruzi se
          </button>
          <button
            className=" bg-green-100 p-6 font-bold rounded-2xl"
            onClick={handleKreirajKod}
          >
            Kreiraj kod
          </button>
        </>
      )}
      {kreiranjeKoda && (
        <Alert
          poruka={"jr9p4g"}
          setter={() => {
            setKreiranjeKoda(false);
          }}
        />
      )}
    </div>
  );
};

export default Footer;
