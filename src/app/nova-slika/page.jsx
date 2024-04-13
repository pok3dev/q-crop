"use client";
import Alert from "@/komponente/Alert";
import Upload from "@/komponente/Upload";
import Navbar from "@/komponente/navbar/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF"];

const NovaSlika = () => {
  const sl = useRef(null);
  // useState hookovi za grešku i naslov
  const [porukaGreske, setPorukaGreske] = useState("");
  const [naslov, setNaslov] = useState("");

  // Varijabla i funkcija za sliku
  const [slika, setSlika] = useState(false);
  const handleImage = async (upload) => {
    sl.current = `${upload.name.split(".")[0]}.jpeg`;
    const formData = new FormData();
    formData.append("slika", upload);

    const url = await fetch("http://localhost:3001/slike/postaviSliku", {
      method: "POST",
      redirect: "follow",
      body: formData,
    });
    const res = await url.json();
    if (res.status === "Uspješno") {
      setSlika(true);
    }
  };

  const handleDelete = async (ime, event) => {
    const url = await fetch("http://localhost:3001/slike/obrisiSliku", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nazivSlike: ime,
      }),
    });
    const res = await url.json();
    if (res.status === "Uspješno") {
      setSlika(false);
    }
  };

  const router = useRouter();

  // Funkcija za izdržavanje i provjeranje da li je unos podataka novog projekta validan
  const handlePocni = async () => {
    if (!naslov) return setPorukaGreske("Naslov ne smije biti prazan.");
    if (!slika) return setPorukaGreske("Moraš prvo postaviti sliku.");

    const url = await fetch("http://localhost:3001/projekti/kreirajProjekat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nazivProjekta: naslov,
        slika: sl.current,
      }),
    });
    const res = await url.json();
    if (res.status === "Uspješno") {
      console.log(res);
      router.push(`/slika/${res.id}`);
    } else return setPorukaGreske(res.poruka);
  };

  return (
    <div ref={sl}>
      <Navbar />
      {/* Alert komponenta */}
      {porukaGreske && <Alert poruka={porukaGreske} setter={setPorukaGreske} />}
      <div className="w-[60vw] mx-auto rounded-xl bg-slate-800 text-white p-4 flex items-center justify-center gap-4 mb-4 mt-32">
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
        {slika && (
          <>
            <Image
              className="p-8"
              height={300}
              width={400}
              src={`/slike/${sl.current}`}
              alt="postavljena slika"
            />
            <button
              className="bg-[#2a4657] px-8 py-4 rounded-md hover:scale-105 transition-all duration-300"
              onClick={handleDelete.bind(event, sl.current)}
            >
              Izaberite drugu sliku
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
