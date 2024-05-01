"use client";
import Link from "next/link";
import Obriši from "./ikone/Obriši";
import Confirm from "./Confirm";
import { useState } from "react";
import izbrisiAPI from "@/funkcije/izbrisiAPI";

const Kartica = ({ id, idKorisnika, naziv, slika, datum }) => {
  const [potvrda, setPotvrda] = useState(false);
  // Kartica - Predstavlja pojedinacni projekat u aplikaciji
  const formatiranDatum = datum.split("-");
  const povezanDatum = `${formatiranDatum[2].slice(0, 2)}.${
    formatiranDatum[1]
  }.${formatiranDatum[0]}.`;

  const handleIzbriši = async () => {
    const podaci = {
      id,
      idKorisnika,
    };

    const res = await izbrisiAPI(podaci);

    console.log(res);
    if (res.status === "Uspješno") {
      location.reload();
    } else {
      // setPorukaGreske(res.poruka);
    }

    setPotvrda(false);
  };

  return (
    <>
      {potvrda && (
        <Confirm
          poruka={`Da li želite da obrišete projekat "${naziv}" ?`}
          setter={setPotvrda}
          cb={handleIzbriši}
        ></Confirm>
      )}
      <div className="relative h-[240px] sm:h-[330px] w-[160px] sm:w-[220px] bg-transparent rounded-xl overflow-hidden drop-shadow-xl">
        <div className="flex flex-col text-center bg-[#000000aa] mt-[175px] sm:mt-[260px] py-4 text-white z-50 group">
          <h3 className="text-sm text-white">{naziv}</h3>
          <h6 className="text-gray-300 text-[10px] sm:text-sm">
            {povezanDatum}
          </h6>
          <Obriši
            velicina={512}
            klase={`w-6 sm:w-8 absolute right-5 bottom-5 opacity-100  sm:opacity-20 sm:group-hover:opacity-100 hover:cursor-pointer`}
            cb={() => setPotvrda(true)}
          ></Obriši>
        </div>
        {/* <div className="absolute -bottom-28 right-0 translate-x-1/2 bg-[#000000aa] drop-shadow-[0px_-100px_6px_rgba(0,0,0)] w-[400px] sm:w-[600px] py-4 h-20"></div> */}
        <Link href={`slika/${id}`}>
          <img
            src={`/slike/${slika}`}
            className="object-cover h-[330px] w-[220px] absolute left-0 top-0 -z-10"
          ></img>
        </Link>
      </div>
    </>
  );
};

export default Kartica;
