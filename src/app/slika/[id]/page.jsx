"use client";

import Klizac from "@/komponente/Klizac";

import Boje from "@/komponente/ikone/Boje";
import Detalji from "@/komponente/ikone/Detalji";
import Efekti from "@/komponente/ikone/Efekti";
import Izrezi from "@/komponente/ikone/Izrezi";
import Reset from "@/komponente/ikone/Reset";
import Svjetlo from "@/komponente/ikone/Svjetlo";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import { useEffect, useRef, useState } from "react";
import Sacuvaj from "@/komponente/ikone/Sacuvaj";
import Preuzmi from "@/komponente/ikone/Preuzmi";
import Link from "next/link";

const Slika = () => {
  const [menu, setMenu] = useState(false);
  const [sekcija, setSekcija] = useState(-1);
  const [rezanje, setRezanje] = useState(false);

  const filteri = [
    [1, 1, 0, 1, 0],
    [0, 0, 1, 1],
  ];

  const elemenat = useRef(filteri);
  const cropperRef = useRef(null);

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    console.log(cropper);
  };

  const handleIzreži = () => {
    const cropper = cropperRef.current?.cropper;
    setRezanje(false);
    document.getElementById("slika").src = cropper
      .getCroppedCanvas()
      .toDataURL("image/png");
  };

  useEffect(() => {
    setMenu(false);
  }, []);

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

  const postaviFilter = (vrijednost, menu, indeks) => {
    elemenat.current[menu][indeks] = vrijednost;
    postaviFiltere();
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
      <span className="flex justify-between items-center text-white py-6 px-12 bg-slate-800">
        <button className="flex flex-col gap-1 justify-center items-center transition-all duration-300 hover:scale-105 group">
          <Preuzmi
            velicina={512}
            klase={`w-6 z-50 transition-all duration-300 group-hover:translate-y-1`}
          />
          <h1>Preuzmi</h1>
        </button>
        <Link href="/">
          <h1 className="font-bold text-3xl" title="Vrati se nazad">
            qCrop
          </h1>
        </Link>
        <button className="flex flex-col gap-1 justify-center items-center transition-all duration-300 hover:scale-105 group">
          <Sacuvaj
            velicina={512}
            klase={`w-6 z-50 transition-all duration-300 group-hover:translate-y-1`}
          />
          <h1>Sačuvaj</h1>
        </button>
      </span>
      <div className=" flex flex-col justify-between align-middle h-[87vh] ">
        <div
          className="relative mx-auto w-[60vw] h-[600px] bg-transparent pt-[3.75rem]"
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
            <div className="max-h-[60vh] overflow-hidden">
              <img
                id="slika"
                src="https://images.pexels.com/photos/18666530/pexels-photo-18666530/free-photo-of-glacier-water.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              ></img>
              {rezanje && (
                <Cropper
                  src="https://images.pexels.com/photos/18666530/pexels-photo-18666530/free-photo-of-glacier-water.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  className="absolute max-h-[60vh] top-[7.8vh] left-0 z-70"
                  // Cropper.js options
                  initialAspectRatio={16 / 9}
                  guides={false}
                  crop={onCrop}
                  ref={cropperRef}
                />
              )}
            </div>
            {rezanje && (
              <button
                className="font-bold w-32 bg-slate-800 px-8 py-4 text-white rounded-md"
                onClick={handleIzreži}
              >
                IZREŽI
              </button>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-[96px] bg-slate-800 text-white flex justify-between align-middle px-[24vw] capitalize">
          <button
            className="h-16 my-4 transition-all duration-300 hover:scale-105 hover:text-blue-500"
            onClick={() => {
              setRezanje(true);
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
            onClick={() => {
              setSekcija(2);
              setMenu(true);
            }}
          >
            <Efekti velicina={512} klase={`w-8`} />
            <h2>Efekti</h2>
          </button>
          <button
            className="h-16 my-4 transition-all duration-300 hover:scale-105 hover:text-gray-500"
            onClick={() => {
              setSekcija(3);
              setMenu(true);
            }}
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