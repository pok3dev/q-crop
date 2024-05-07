"use client";
import Alert from "@/komponente/Alert";
import Upload from "@/komponente/Upload";
import Strelica from "@/komponente/ikone/Strelica";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF"];

const NovaSlika = () => {
  const sl = useRef(null);

  const [poruka, setPoruka] = useState("");
  const [naslov, setNaslov] = useState("");
  const [slika, setSlika] = useState(false);

  // Callback funkcija za upload slike
  const handleImage = async (upload) => {
    // 1. Postavljanje imena sa jpeg ekstenzijom na sl referencu
    sl.current = `${upload.name.split(".")[0]}.jpeg`;

    // 2. Kreiranje FormData za uplaod slike
    const formData = new FormData();
    formData.append("slika", upload);

    // 3. API poziv sa slikom koju smo postavili na formData
    const url = await fetch("http://localhost:3001/slike/postaviSliku", {
      method: "POST",
      redirect: "follow",
      body: formData,
    });

    // 4. Ako je status uspješan, postavljamo sliku zamjenjujemo upload prozorom
    const res = await url.json();
    if (res.status === "Uspješno") {
      setSlika(true);
    }
  };

  // Callback funkcija za brisanje slike
  const handleDelete = async (ime, event) => {
    const url = await fetch("http://localhost:3001/slike/obrisiSliku", {
      method: "DELETE",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nazivSlike: ime,
      }),
    });
    if (url.status === 204) {
      setSlika(false);
    }
  };

  const router = useRouter();

  // Funkcija za izdržavanje i provjeru da li je unos podataka novog projekta validan
  const handlePocni = async () => {
    if (!naslov) return setPoruka("Naslov ne smije biti prazan.");
    if (!slika) return setPoruka("Moraš prvo postaviti sliku.");

    // 1. API poziv sa nazivom i slikom
    const url = await fetch("http://localhost:3001/projekti/kreirajProjekat", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nazivProjekta: naslov,
        slika: sl.current,
      }),
    });

    const res = await url.json();

    // 2. Ako je status uspješan, izvršiti redirekciju na stranicu za uređivanje slike
    if (res.status === "Uspješno") {
      router.push(`/slika/${res.data}`);
    } else return setPoruka(res.poruka);
  };

  return (
    <div ref={sl}>
      <div className="absolute top-0 flex w-full justify-between items-center py-4 sm:py-6 px-6 sm:px-12 text-white bg-slate-800 mb-4 sm:mb-6">
        {/* Odjava */}
        <Link
          href={"/"}
          className="cursor-pointer"
          // Kada odlučimo napustiti stranicu, izbrisati sliku sa servera
          onClick={(event) => {
            slika ? handleDelete(sl.current, event) : null;
          }}
        >
          <Strelica velicina={512} klase={`w-6 z-50 -rotate-90`} />
          <h2 className=" hidden sm:inline">Vrati se</h2>
        </Link>
        {/* Naziv aplikacije */}
        <h1 className="absolute left-[50%] -translate-x-[50%] text-xl sm:text-3xl font-bold  ">
          qCrop
        </h1>
        {/* Opcije korisnika */}
        <span className="ml-auto flex align-middle gap-8">
          <div className="rounded-full h-10 w-10 inline-block bg-white"></div>
        </span>
      </div>
      {/* Alert komponenta */}
      {poruka && <Alert poruka={poruka} setter={setPoruka} />}
      <div className="w-[95vw] sm:w-[90vw] md:w-[60vw] mx-auto rounded-xl bg-slate-800 text-white p-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 mt-24 sm:mt-32">
        <h1 className="text-sm sm:text-lg lg:text-xl">1. Naziv projekta:</h1>
        <input
          className="text-sm sm:text-lg lg:text-xl bg-transparent p-2 border-b-2 focus:outline-none sm:hover:scale-105 transition-all duration-300"
          placeholder="Novi projekat"
          onChange={(e) => setNaslov(e.target.value)}
        />
      </div>
      <div className="w-[95vw] sm:w-[90vw] md:w-[60vw] mx-auto bg-slate-800 px-4 py-8 rounded-xl text-white flex flex-col items-center justify-center  mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-sm sm:text-lg lg:text-xl">
            2. Izaberite ili prevucite sliku:
          </h1>
        </div>
        {/* Komponenta za 'drag and drop' slika */}
        {slika && (
          <>
            <Image
              className="p-8"
              height={200}
              width={300}
              src={`/slike/${sl.current}`}
              alt="postavljena slika"
            />
            <button
              className="bg-[#2a4657] px-8 py-4 rounded-md sm:hover:scale-105 transition-all duration-300"
              onClick={handleDelete.bind(event, sl.current)}
            >
              Obriši sliku
            </button>
          </>
        )}
        {!slika && (
          <FileUploader
            className={"z-10"}
            handleChange={handleImage}
            name="file"
            types={fileTypes}
          >
            <Upload />
          </FileUploader>
        )}
      </div>
      <div className="w-[95vw] sm:w-[90vw] md:w-[60vw] mx-auto rounded-xl bg-slate-800 text-white py-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg sm:text-xl">3. Počnite sa radom:</h1>
          <button
            className="bg-[#2a4657] px-8 py-4 rounded-md sm:hover:scale-105 transition-all duration-300 text-sm sm:text-lg"
            onClick={handlePocni}
          >
            POČNI
          </button>
        </div>
      </div>
    </div>
  );
};

export default NovaSlika;
