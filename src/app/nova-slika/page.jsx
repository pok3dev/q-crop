"use client";
import Alert from "@/komponente/Alert";
import Upload from "@/komponente/Upload";
import Navbar from "@/komponente/navbar/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF"];

const NovaSlika = () => {
  // useState hookovi za grešku i naslov
  const [porukaGreske, setPorukaGreske] = useState("");
  const [naslov, setNaslov] = useState("");

  // Varijabla i funkcija za sliku
  const [slika, setSlika] = useState("");
  const handleImage = (slika) => {
    setSlika(slika);
  };

  const router = useRouter();

  // Funkcija za izdržavanje i provjeranje da li je unos podataka novog projekta validan
  const handlePocni = () => {
    if (!naslov) return setPorukaGreske("Naslov ne smije biti prazan.");
    router.push(`/slika/${naslov}`);
  };

  return (
    <div>
      <Navbar />
      {/* Alert komponenta */}
      {porukaGreske && <Alert poruka={porukaGreske} setter={setPorukaGreske} />}
      <div className="w-[60vw] mx-auto rounded-xl bg-slate-800 text-white p-4 flex items-center justify-center gap-4 mb-4">
        <h1 className="text-xl">1. Naziv projekta: </h1>
        <input
          className="text-xl bg-transparent p-2 border-b-2 focus:outline-none hover:scale-105 transition-all duration-300"
          placeholder="Novi projekat"
          onChange={(e) => setNaslov(e.target.value)}
        />
      </div>
      <div className="w-[60vw] mx-auto bg-slate-800 px-4 py-8 rounded-xl text-white flex flex-col items-center justify-center  mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl">2. Izaberite ili prevucite sliku:</h1>
        </div>
        {/* Komponenta za 'drag and drop' slika */}
        <FileUploader
          className={"z-10"}
          handleChange={handleImage}
          name="file"
          types={fileTypes}
        >
          <Upload />
        </FileUploader>
      </div>
      <div className="w-[60vw] mx-auto rounded-xl bg-slate-800 text-white py-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl">3. Počnite sa radom:</h1>
          <button
            className="bg-[#2a4657] px-8 py-4 rounded-md hover:scale-105 transition-all duration-300"
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
