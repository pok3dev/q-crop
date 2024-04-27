"use client";

import Klizac from "@/komponente/Klizac";

import Boje from "@/komponente/ikone/Boje";
import Detalji from "@/komponente/ikone/Detalji";
import Efekti from "@/komponente/ikone/Efekti";
import Izrezi from "@/komponente/ikone/Izrezi";
import Reset from "@/komponente/ikone/Reset";
import Svjetlo from "@/komponente/ikone/Svjetlo";
import { useEffect, useRef, useState } from "react";
import Sacuvaj from "@/komponente/ikone/Sacuvaj";
import Preuzmi from "@/komponente/ikone/Preuzmi";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import Image from "next/image";
import Alert from "@/komponente/Alert";
import Strelica from "@/komponente/ikone/Strelica";
import Obriši from "@/komponente/ikone/Obriši";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import domtoimage from "dom-to-image";
import izbrisiAPI from "@/funkcije/izbrisiAPI";

const Slika = () => {
  const [porukaGreske, setPorukaGreske] = useState("");
  const [ucitavanjeSlike, setUcitavanjeSlike] = useState(true);

  const [menu, setMenu] = useState(false);
  const [sekcija, setSekcija] = useState(-1);
  const [rezanje, setRezanje] = useState(false);

  const [slika, setSlika] = useState("");
  const [imeProjekta, setImeProjekta] = useState("");

  const pathname = usePathname();

  const filteri = [
    [1, 1, 0, 1, 0],
    [0, 0, 1, 1],
  ];

  const elemenat = useRef(filteri);

  const postaviFiltere = () => {
    const svjetlo = [...elemenat.current[0]];
    const boje = [...elemenat.current[1]];
    svjetlo[0] = `brightness(${elemenat.current[0][0]})`;
    svjetlo[1] = `contrast(${elemenat.current[0][1]})`;
    svjetlo[2] = `grayscale(${elemenat.current[0][2]})`;
    svjetlo[3] = `brightness(${elemenat.current[0][3]})`;
    svjetlo[4] = `brightness(${1 - elemenat.current[0][4]})`;
    boje[0] = `hue-rotate(${elemenat.current[1][0] * 180}deg)`;
    boje[1] = `sepia(${elemenat.current[1][1]})`;
    boje[2] = `saturate(${elemenat.current[1][2]})`;
    boje[3] = `saturate(${elemenat.current[1][3]})`;
    const povezan = svjetlo.join(" ") + " " + boje.join(" ");
    document.querySelector("#slika").style.filter = povezan;
  };

  const filteriCrop = () => {
    const svjetlo = [...elemenat.current[0]];
    const boje = [...elemenat.current[1]];
    svjetlo[0] = `brightness(${elemenat.current[0][0]})`;
    svjetlo[1] = `contrast(${elemenat.current[0][1]})`;
    svjetlo[2] = `grayscale(${elemenat.current[0][2]})`;
    svjetlo[3] = `brightness(${elemenat.current[0][3]})`;
    svjetlo[4] = `brightness(${1 - elemenat.current[0][4]})`;
    boje[0] = `hue-rotate(${elemenat.current[1][0] * 180}deg)`;
    boje[1] = `sepia(${elemenat.current[1][1]})`;
    boje[2] = `saturate(${elemenat.current[1][2]})`;
    boje[3] = `saturate(${elemenat.current[1][3]})`;
    const povezan = svjetlo.join(" ") + " " + boje.join(" ");
    return povezan;
  };

  const filteriObj = {
    filter: filteriCrop(),
  };

  const postaviFilter = (vrijednost, menu, indeks) => {
    elemenat.current[menu][indeks] = vrijednost;
    postaviFiltere();
  };

  const setFilteri = ({
    svjetlost,
    kontrast,
    sjenke,
    bijele,
    crne,
    temperatura,
    tinta,
    vibranca,
    saturacija,
  }) => {
    elemenat.current[0][0] = svjetlost;
    elemenat.current[0][1] = kontrast;
    elemenat.current[0][2] = sjenke;
    elemenat.current[0][3] = bijele;
    elemenat.current[0][4] = crne;
    elemenat.current[1][0] = temperatura;
    elemenat.current[1][1] = tinta;
    elemenat.current[1][2] = vibranca;
    elemenat.current[1][3] = saturacija;
    postaviFiltere();
  };

  const cropperRef = useRef(null);

  const [prethodnoStanje, setPrethodnoStanje] = useState("");
  const [jedinicaSkaliranja, setJedinicaSkaliranja] = useState(1);

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    const el = document.querySelector(".rezanje");
    if (jedinicaSkaliranja !== 1) {
      el.classList.add("centriraj");
      el.style.transform = `translate(-50%,-50%) scale(${jedinicaSkaliranja})`;
    } else {
      document.getElementById("slika").classList.remove("centriraj");
    }
    postaviFiltere();
  };

  const handleIzreži = () => {
    const cropper = cropperRef.current?.cropper;
    setRezanje(false);

    if (prethodnoStanje === "") setPrethodnoStanje(`/slike/${slika}`);
    else setPrethodnoStanje(document.getElementById("slika").src);
    const skala = 400 / cropper.getCroppedCanvas().height;
    setJedinicaSkaliranja(skala.toFixed(2));

    document.getElementById("slika").src = cropper
      .getCroppedCanvas()
      .toDataURL("image/png");
  };

  const handlePoništi = () => {
    if (!prethodnoStanje) return;
    document.getElementById("slika").src = prethodnoStanje;
    setPrethodnoStanje("");
  };

  const dohvatiProjekat = async () => {
    const url = await fetch("http://localhost:3001/projekti/dohvatiProjekat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: pathname.split("/")[2],
      }),
    });
    const res = await url.json();
    console.log("test");
    if (res.status === "Uspješno" && res.projekat.length != 0) {
      setSlika(res.projekat[0]?.slika);
      console.log(res.projekat[0]);
      setImeProjekta(res.projekat[0]?.ime_projekta);
      setUcitavanjeSlike(false);
      setFilteri({ ...res.filteri[0] });
    } else return setPorukaGreske(res.poruka);
  };

  useEffect(() => {
    setMenu(false);
    dohvatiProjekat();
  }, []);

  function dataURLtoBlob(dataURL) {
    let array, binary, i, len;
    binary = atob(dataURL.split(",")[1]);
    array = [];
    i = 0;
    len = binary.length;
    while (i < len) {
      array.push(binary.charCodeAt(i));
      i++;
    }
    return new Blob([new Uint8Array(array)], {
      type: "image/png",
    });
  }

  const handleSacuvaj = async () => {
    const podaci = {
      id: pathname.split("/")[2],
      svjetlost: elemenat.current[0][0],
      kontrast: elemenat.current[0][1],
      sjenke: elemenat.current[0][2],
      bijele: elemenat.current[0][3],
      crne: elemenat.current[0][4],
      temperatura: elemenat.current[1][0],
      tinta: elemenat.current[1][1],
      vibranca: elemenat.current[1][2],
      saturacija: elemenat.current[1][3],
    };
    const url = await fetch("http://localhost:3001/projekti/sacuvajProjekat", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(podaci),
    });

    if (prethodnoStanje != "") {
      const file = dataURLtoBlob(
        cropperRef.current?.cropper.getCroppedCanvas().toDataURL("image/png")
      );
      const formData = new FormData();
      formData.append("slika", file, slika);
      for (var key of formData.entries()) {
        console.log(key[0] + ", " + key[1]);
      }

      const url2 = await fetch("http://localhost:3001/projekti/sacuvajSliku", {
        method: "PATCH",
        redirect: "follow",
        headers: {
          // "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
    }

    const res = await url.json();
    if (res.status === "Uspješno") {
      // Ako mora sačuvati sliku
      if (prethodnoStanje != "") {
        const res2 = await url2.json();
        if (res2.status === "Uspješno") {
          setPorukaGreske("Uspješno sačuvan projekat");
        } else return setPorukaGreske(res2.poruka);
      } else setPorukaGreske("Uspješno sačuvan projekat");
    } else return setPorukaGreske(res.poruka);
  };

  const handlePreuzmi = async () => {
    let node = document.getElementById("slika");
    console.log(node);
    domtoimage
      .toJpeg(node)
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = imeProjekta + "-download.jpeg";
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const handleIzbriši = async () => {
    const podaci = {
      id: pathname.split("/")[2],
      idKorisnika: 27,
    };

    const res = await izbrisiAPI();

    if (res.status === "Uspješno") {
      setPorukaGreske("Uspješno izbrisan projekat");
      router.push(`/`);
    } else {
      setPorukaGreske(res.poruka);
    }
  };

  const handleMouseDown = () => {
    document.querySelector("#slika").style.filter = "";
    document.querySelector(".tip").style.display = "none";
  };
  const handleMouseUp = () => {
    postaviFiltere();
  };

  const lista = [
    ["Svjetlost", "Kontrast", "Sjenke", "Bijele", "Crne"],
    ["Temperatura", "Tinta", "Vibranca", "Saturacija"],
    ["Tekstura", "Jasnoća", "Pročiščivanje", "Vinjeta"],
    ["Oštrina", "Radijus", "Redukcija šuma"],
  ];
  const meniSekcije = ["Svjetlo", "Boje", "Efekti", "Detalji"];
  return (
    <div>
      {/* Alert komponenta */}
      {porukaGreske && <Alert poruka={porukaGreske} setter={setPorukaGreske} />}
      <span className="flex justify-between items-center text-white py-6 px-12 bg-slate-800">
        <Link
          href="/"
          className="flex flex-col gap-1 justify-center items-center group"
        >
          <Strelica velicina={512} klase={`w-6 z-50  -rotate-90`} />
          <h1>Nazad</h1>
        </Link>
        <Link href="/">
          <h1
            className="font-bold text-3xl absolute top-8 left-1/2 -translate-x-1/2"
            title="Vrati se nazad"
          >
            qCrop
          </h1>
        </Link>
        <div className="flex gap-10">
          <button
            className="flex flex-col gap-1 justify-center items-center transition-all duration-300 hover:text-red-400 group"
            onClick={handleIzbriši}
          >
            <Obriši velicina={512} klase={`w-6 z-50`} />
            <h1>Obriši</h1>
          </button>
          <button
            className="flex flex-col gap-1 justify-center items-center group"
            onClick={handlePreuzmi}
          >
            <Preuzmi velicina={512} klase={`w-6 z-50`} />
            <h1>Preuzmi</h1>
          </button>
          <button className="flex flex-col gap-1 justify-center items-center group">
            <Sacuvaj velicina={512} klase={`w-6 z-50`} cb={handleSacuvaj} />
            <h1>Sačuvaj</h1>
          </button>
        </div>
      </span>
      <div className="relative flex flex-col justify-center align-middle h-[100vh] -translate-y-24">
        <div
          className=" flex items-center justify-center mx-auto w-[60vw] h-[600px] bg-transparent pt-[10rem]  mb-[26vh] "
          // onMouseDown={handleMouseDown}
          // onMouseUp={handleMouseUp}
        >
          <div className="tip absolute w-[60vw] h-[480px] left-0 top-16 hidden justify-center z-40 group ">
            <div className="flex flex-col gap-4 my-auto">
              <Reset
                velicina={512}
                klase={`w-12 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300`}
              />
              <h1 className="text-white text-xl text-center opacity-0 group-hover:opacity-100 z-30  transition-all duration-300">
                ZADRZI KLIK DA VIDIS PRETHODNO STANJE
              </h1>
            </div>
            <div className="absolute w-[60vw] h-[480px] bg-black hover:opacity-40 cursor-pointer opacity-0 group-hover:opacity-50 z-20  transition-all duration-300"></div>
          </div>
          <div className="flex flex-col items-center justify-between gap-1">
            <div className="relative max-h-[60vh] h-[400px] overflow-hidden">
              <>
                {ucitavanjeSlike && (
                  <h1 className="text-white text-2xl mt-[25vh]">
                    Slika se ucitava...
                  </h1>
                )}
                {!ucitavanjeSlike && (
                  <img
                    id="slika"
                    src={`/slike/${slika}`}
                    alt="editovana-slika"
                    className="h-[400px]"
                  ></img>
                )}
              </>

              {rezanje && (
                <Cropper
                  // src={`/slike/${slika}`}
                  src={document.getElementById("slika").src}
                  style={{ filter: filteriObj.filter }}
                  className={`rezanje absolute top-0 left-0 max-h-[60vh]`}
                  guides={false}
                  crop={onCrop}
                  ref={cropperRef}
                />
              )}
            </div>
            {rezanje && (
              <button
                className="absolute px-8 py-4 bottom-[14vh] font-bold w-32 bg-slate-800 text-white rounded-md"
                onClick={handleIzreži}
              >
                IZREŽI
              </button>
            )}
            {!rezanje && prethodnoStanje != "" && (
              <button
                className="absolute px-8 py-4 bottom-0 font-bold w-32 bg-slate-800 text-white rounded-md"
                onClick={handlePoništi}
              >
                PONIŠTI
              </button>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-[96px] bg-slate-800 text-white flex justify-between align-middle px-[24vw] capitalize">
          <button
            className="h-16 my-4 transition-all duration-300 hover:scale-105 hover:text-blue-500"
            onClick={() => {
              setRezanje(true);
              postaviFiltere();
            }}
          >
            <Izrezi velicina={512} klase={`w-8`} />
            <h2>Izreži</h2>
          </button>
          <button
            className="h-16 my-4 transition-all duration-300 hover:scale-105 hover:text-yellow-500"
            onClick={() => {
              setSekcija(0);
              setMenu(true);
            }}
          >
            <Svjetlo velicina={512} klase={`w-8`} />
            <h2>Svjetlo</h2>
          </button>
          <button
            className="h-16 my-4 transition-all duration-300 hover:scale-105 hover:text-red-500 "
            onClick={() => {
              setSekcija(1);
              setMenu(true);
            }}
          >
            <Boje velicina={512} klase={`w-8`} />
            <h2>Boje</h2>
          </button>
          <button
            className="h-16 my-4 transition-all duration-300 hover:scale-105 hover:text-green-500"
            // onClick={() => {
            //   setSekcija(2);
            //   setMenu(true);
            // }}
          >
            <Efekti velicina={512} klase={`w-8`} />
            <h2>Efekti</h2>
          </button>
          <button
            className="h-16 my-4 transition-all duration-300 hover:scale-105 hover:text-gray-500"
            // onClick={() => {
            //   setSekcija(3);
            //   setMenu(true);
            // }}
          >
            <Detalji velicina={512} klase={`w-8`} />
            <h2>Detalji</h2>
          </button>
        </div>
      </div>
      {menu && (
        <span className="absolute h-[100vh] w-[27vw] top-0 pt-16 right-0 bg-slate-800 z-40">
          <div className="flex justify-between">
            <div className="w-16 invisible"></div>
            <h1 className="text-center bg-transparent text-2xl text-white mt-4">
              {meniSekcije[sekcija]}
            </h1>
            <button
              className="p-4 font-bold text-white text-2xl"
              onClick={() => setMenu(false)}
            >
              X
            </button>
          </div>
          {lista[sekcija].map((item, i) => (
            <div className="bg-transparent p-4 mx-8" key={item}>
              <h2 className="text-white mb-2">{item}</h2>
              <Klizac
                sirina={300}
                naziv={item}
                def={elemenat.current[sekcija][i]}
                menu={sekcija}
                indeks={i}
                setter={postaviFilter}
              />
            </div>
          ))}
        </span>
      )}
    </div>
  );
};

export default Slika;
