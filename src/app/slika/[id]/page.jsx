"use client";
import Klizac from "@/komponente/Klizac";
import Boje from "@/komponente/ikone/Boje";
import Detalji from "@/komponente/ikone/Detalji";
import Efekti from "@/komponente/ikone/Efekti";
import Izrezi from "@/komponente/ikone/Izrezi";
import Reset from "@/komponente/ikone/Reset";
import Svjetlo from "@/komponente/ikone/Svjetlo";
import Sacuvaj from "@/komponente/ikone/Sacuvaj";
import Preuzmi from "@/komponente/ikone/Preuzmi";
import Alert from "@/komponente/Alert";
import Strelica from "@/komponente/ikone/Strelica";
import Obriši from "@/komponente/ikone/Obriši";
import izbrisiAPI from "@/funkcije/izbrisiAPI";
import Confirm from "@/komponente/Confirm";

import domtoimage from "dom-to-image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import dataURLtoBlob from "@/komponente/funkcije/dataURLtoBlob";

const Slika = () => {
  const [poruka, setPoruka] = useState("");
  const [ucitavanjeSlike, setUcitavanjeSlike] = useState(true);

  const [menu, setMenu] = useState(false);
  const [sekcija, setSekcija] = useState(-1);
  const [rezanje, setRezanje] = useState(false);

  const [idKorisnika, setIdKorisnika] = useState("");
  const [slika, setSlika] = useState("");
  const [imeProjekta, setImeProjekta] = useState("");

  const pathname = usePathname();

  // Niz vrijednosti za filtere slike
  const filteri = [
    [1, 1, 0, 1, 0],
    [0, 0, 1, 1],
  ];

  const elemenat = useRef(filteri);

  // Funkcija za pretvaranje filtera u string za css filter stil
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

  // Funkcija za postavljanje filtera na sliku
  const postaviFiltere = () => {
    document.querySelector("#slika").style.filter = filteriCrop();
  };

  const filteriObj = {
    filter: filteriCrop(),
  };

  // Callback funkcija za ažuriranje pojedinih filtera na klizaču
  const postaviFilter = (vrijednost, menu, indeks) => {
    elemenat.current[menu][indeks] = vrijednost;
    postaviFiltere();
  };

  // Funkcija za postavljanje vrijednosti filtera koje smo prethodno dohvatili iz baze podataka
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

  // useState hookovi koji se koriste prilikom vraćanja na prethodno izrezanu sliku
  const [prethodnoStanje, setPrethodnoStanje] = useState("");
  const [prethodnoSkaliranje, setPrethodnoSkaliranje] = useState(1);

  const [jedinicaSkaliranja, setJedinicaSkaliranja] = useState(1);

  // Callback funkcija za rezanje
  const onCrop = () => {
    const rezanje = document.querySelector(".rezanje");
    const slika = document.getElementById("slika");

    document
      .getElementById("rezanje")
      .classList.add(
        slika.offsetHeight >= slika.offsetWidth ? "portrait" : "landscape"
      );

    // 1. Ako se prethodno dogodilo rezanje slike, skalirati na zadanu vrijednost i centrirati
    if (jedinicaSkaliranja !== 1) {
      rezanje.classList.add("centriraj");
      rezanje.style.transform = `translate(-50%,-50%) scale(${jedinicaSkaliranja})`;
    } else {
      rezanje.classList.remove("centriraj");
    }

    // 2. Postavljanje filtera
    postaviFiltere();
  };

  // Callback funkcija koja se koristi kada se završi za rezanjem slike
  const handleIzreži = () => {
    // 1. Uzimamo izrezani elemenat
    const cropper = cropperRef.current?.cropper;
    setRezanje(false);

    // 2. Postavljanje vrijednosti na hookove prethodnog stanja
    if (prethodnoStanje === "") setPrethodnoStanje(`/slike/${slika}`);
    else setPrethodnoStanje(document.getElementById("slika").src);
    setPrethodnoSkaliranje(jedinicaSkaliranja);

    // 3. Postavljanje jedinice skaliranja za naredna rezanja slike
    const skala =
      document.getElementById("slika").offsetHeight /
      cropper.getCroppedCanvas().height;
    setJedinicaSkaliranja(skala.toFixed(2));

    // 4. Postavljanje izvora na image elemenat
    document.getElementById("slika").src = cropper
      .getCroppedCanvas()
      .toDataURL("image/png");
  };

  // Callback funkcija za vraćanje na prethodne vrijednosti (rezanje);
  const handlePoništi = () => {
    if (!prethodnoStanje) return;
    document.getElementById("slika").src = prethodnoStanje;
    setJedinicaSkaliranja(prethodnoSkaliranje);
    setPrethodnoStanje("");
  };

  // Funkcija za dohvatanje projekta
  const dohvatiProjekat = async () => {
    // 1. API poziv sa id-em koji je zadan u url-u
    const url = await fetch("http://localhost:3001/projekti/dohvatiProjekat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id: pathname.split("/")[2],
      }),
    });

    const res = await url.json();

    // 2. Ako je status uspješan, postaviti sve vrijednosti
    if (res.status === "Uspješno" && res.data.projekat.length != 0) {
      setIdKorisnika(res.data.projekat[0]?.idKorisnika);
      setSlika(res.data.projekat[0]?.slika);
      setImeProjekta(res.data.projekat[0]?.ime_projekta);
      setUcitavanjeSlike(false);
      setFilteri({ ...res.data.filteri[0] });
    } else return setPoruka(res.poruka);

    const slika = document.getElementById("slika");

    slika.classList.add(
      slika.offsetHeight >= slika.offsetWidth ? "portrait" : "landscape"
    );
  };

  useEffect(() => {
    setMenu(false);
    dohvatiProjekat();
  }, []);

  // Callback funkcija za spašavanje slike
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

    // 1. API poziv sa prethodno zadanim podacima
    const url = await fetch("http://localhost:3001/projekti/sacuvajProjekat", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(podaci),
    });

    // 2. Ako je došlo do promjene u izvornoj slici (prilikom rezanja), sačuvati novu sliku
    if (prethodnoStanje != "") {
      const file = dataURLtoBlob(
        cropperRef.current?.cropper.getCroppedCanvas().toDataURL("image/png")
      );
      const formData = new FormData();
      formData.append("slika", file, slika);

      // 3. API poziv za spašavanje slike
      const url2 = await fetch("http://localhost:3001/projekti/sacuvajSliku", {
        method: "PATCH",
        redirect: "follow",
        headers: {
          // "Content-Type": "multipart/form-data",
        },
        credentials: "include",
        body: formData,
      });
    }

    const res = await url.json();

    // 4. Ako su oba poziva uspješna obavjestiti korisnika o uspješnom spašavanju, u suprotnom prikaži grešku
    if (res.status === "Uspješno") {
      if (prethodnoStanje != "") {
        const res2 = await url2.json();
        if (res2.status === "Uspješno") {
          setPoruka("Uspješno sačuvan projekat");
        } else return setPoruka(res2.poruka);
      } else setPoruka("Uspješno sačuvan projekat");
    } else return setPoruka(res.poruka);
  };

  // Callback funkcija za preuzimanje slike
  const handlePreuzmi = async () => {
    let node = document.getElementById("slika");
    // 1. Node paket za preuzimanje elementa slike
    domtoimage
      .toJpeg(node)
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = imeProjekta + "-download.jpeg";
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        setPoruka("Nešto nije u redu...");
      });
  };

  const navigate = useRouter();
  const [potvrda, setPotvrda] = useState(false);

  // Callback funkcija za brisanje slike
  const handleIzbriši = async () => {
    const podaci = {
      id: pathname.split("/")[2],
    };
    // 1. Ekstraktovana funkcija za brisanje
    const res = await izbrisiAPI(podaci);

    // 2. Ako je sve u redu, gasimo confirm ekran i vršimo redirekciju na početnu stranicu
    setPotvrda(false);
    if (res.status === "Uspješno") {
      navigate.replace("/");
    } else {
      setPoruka(res.poruka);
    }
  };

  const handleMouseDown = () => {
    document.querySelector("#slika").style.filter = "";
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
      {potvrda && (
        <Confirm
          poruka={`Da li želite da obrišete projekat ${imeProjekta}?`}
          setter={setPotvrda}
          cb={handleIzbriši}
        ></Confirm>
      )}
      {/* Alert komponenta */}
      {poruka && <Alert poruka={poruka} setter={setPoruka} />}
      <span className="flex justify-between items-center text-white py-3  sm:py-6 px-6 sm:px-12 bg-slate-800">
        <div className="flex gap-6 sm:gap-10">
          <Link
            href="/"
            className="flex flex-col gap-1 justify-center items-center group"
          >
            <Strelica velicina={512} klase={`w-6 z-50  -rotate-90`} />
            <h1 className="text-[10px] sm:text-sm md:text-md">Nazad</h1>
          </Link>
          <button
            className="flex flex-col gap-1 justify-center items-center transition-all duration-300 hover:text-red-400 group"
            onClick={() => setPotvrda(true)}
          >
            <Obriši velicina={512} klase={`w-6 z-50`} />
            <h1 className="text-[10px] sm:text-sm md:text-md">Obriši</h1>
          </button>
        </div>
        <Link href="/">
          <h1
            className="font-bold text-xl sm:text-2xl md:text-3xl absolute top-4 sm:top-6 left-1/2 -translate-x-1/2"
            title="Vrati se nazad"
          >
            qCrop
          </h1>
        </Link>
        <div className="flex gap-6 sm:gap-10">
          <button
            className="flex flex-col gap-1 justify-center items-center group"
            onClick={handlePreuzmi}
          >
            <Preuzmi velicina={512} klase={`w-6 md:w-6 z-50`} />
            <h1 className="text-[10px] sm:text-sm md:text-md">Preuzmi</h1>
          </button>
          <button className="flex flex-col gap-1 justify-center items-center group">
            <Sacuvaj velicina={512} klase={`w-6 z-50`} cb={handleSacuvaj} />
            <h1 className="text-[10px] sm:text-sm md:text-md">Sačuvaj</h1>
          </button>
        </div>
      </span>
      <div className="relative flex flex-col justify-center align-middle h-[100vh] -translate-y-24 ">
        <div className=" flex items-center justify-center mx-auto w-full sm:w-[95vw] h-[300px] sm:h-[500px] bg-transparent pt-[10rem]  mb-[26vh]">
          <div className="flex flex-col items-center justify-between gap-1">
            <div className="relative overflow-hidden">
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
                    className="hover:cursor-pointer"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                  ></img>
                )}
              </>

              {rezanje && (
                <Cropper
                  id="rezanje"
                  src={document.getElementById("slika").src}
                  style={{ filter: filteriObj.filter }}
                  className={`rezanje absolute top-0 left-0`}
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
                className="absolute px-8 py-4 bottom-[14vh] font-bold w-32 bg-slate-800 text-white rounded-md"
                onClick={handlePoništi}
              >
                PONIŠTI
              </button>
            )}
          </div>
        </div>
        <div className="absolute -bottom-8 sm:bottom-0 w-full h-[96px] bg-slate-800 text-white flex justify-between align-middle px-[6vw] sm:px-[12vw] lg:px-[24vw] capitalize">
          <button
            className="h-16 my-4 transition-all duration-300 hover:scale-105 hover:text-blue-500"
            onClick={() => {
              setRezanje(true);
              postaviFiltere();
            }}
          >
            <Izrezi velicina={512} klase={`w-8`} />
            <h2 className="text-[10px] sm:text-sm md:text-md">Izreži</h2>
          </button>
          <button
            className="h-16 my-4 transition-all duration-300 hover:scale-105 hover:text-yellow-500"
            onClick={() => {
              setSekcija(0);
              setMenu(true);
            }}
          >
            <Svjetlo velicina={512} klase={`w-8`} />
            <h2 className="text-[10px] sm:text-sm md:text-md">Svijetlo</h2>
          </button>
          <button
            className="h-16 my-4 transition-all duration-300 hover:scale-105 hover:text-red-500 "
            onClick={() => {
              setSekcija(1);
              setMenu(true);
            }}
          >
            <Boje velicina={512} klase={`w-8`} />
            <h2 className="text-[10px] sm:text-sm md:text-md">Boje</h2>
          </button>
          <button
            className="h-16 my-4 transition-all duration-300 hover:scale-105 hover:text-green-500"
            // onClick={() => {
            //   setSekcija(2);
            //   setMenu(true);
            // }}
          >
            <Efekti velicina={512} klase={`w-8`} />
            <h2 className="text-[10px] sm:text-sm md:text-md">Efekti</h2>
          </button>
          <button
            className="h-16 my-4 transition-all duration-300 hover:scale-105 hover:text-gray-500"
            // onClick={() => {
            //   setSekcija(3);
            //   setMenu(true);
            // }}
          >
            <Detalji velicina={512} klase={`w-8`} />
            <h2 className="text-[10px] sm:text-sm md:text-md">Detalji</h2>
          </button>
        </div>
      </div>
      {menu && (
        <span className="absolute flex flex-col justify-start items-center h-[500px] sm:h-[100vh] w-full sm:w-[400px] bottom-0 sm:top-0 pt-4 sm:pt-16 right-0 bg-[rgba(30,41,59,0.9)] sm:bg-slate-800 z-40">
          <div className="w-full flex justify-between pr-4">
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
