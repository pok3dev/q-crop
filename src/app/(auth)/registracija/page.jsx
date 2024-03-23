"use client";
import Alert from "@/komponente/Alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Registracija = () => {
  const [poruka, setPoruka] = useState("");

  // Funkcija za registraciju - Validacija unosa i slanje API zahtjeva
  const handleRegister = async (e) => {
    const forma = e.target;
    e.preventDefault();
    if (
      !forma.ime.value ||
      !forma.mejl.value ||
      !forma.šifra.value ||
      !forma.šifraPotvrda.value
    ) {
      setPoruka("Unesite sva polja.");
      return;
    } else if (forma.šifra.value != forma.šifraPotvrda.value) {
      setPoruka("Šifre moraju biti iste.");
      return;
    } else if (forma.šifra.value.length < 8) {
      setPoruka("Šifra mora sadržavati minimalno 8 znakova.");
      return;
    }

    const req = await fetch(
      "http://localhost:3001/korisnik/registrujKorisnika",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ime: forma.ime.value,
          mejl: forma.mejl.value,
          šifra: forma.šifra.value,
        }),
      }
    );
    const res = await req.json();
    if (res.status == "Uspješno") {
      setPoruka("Uspješno registrovanje");
      router.replace("/login");
    }
    if (res.status == "Greška") {
      setPoruka(res.poruka);
    }
  };

  return (
    <>
      {poruka && <Alert poruka={poruka} setter={setPoruka} />}
      <form
        className="flex flex-col gap-6 justify-center align-middle"
        onSubmit={handleRegister}
      >
        <input
          placeholder="Unesite ime"
          className="p-4 bg-white h-16 rounded-xl text-black"
          name="ime"
        ></input>
        <input
          placeholder="Unesite mejl"
          className="p-4 bg-white h-16 rounded-xl text-black"
          name="mejl"
        ></input>
        <input
          placeholder="Unesite šifru"
          className="p-4 bg-white h-16 rounded-xl text-black"
          name="šifra"
          type="password"
        ></input>
        <input
          placeholder="Ponovite šifru"
          className="p-4 bg-white h-16 rounded-xl text-black"
          name="šifraPotvrda"
          type="password"
        ></input>
        <button className="bg-green-300 p-6 font-bold rounded-2xl ">
          Registruj se
        </button>
      </form>
      <p className="text-white text-center mt-4 -mb-4">
        Vrati se nazad u slučaju da već imaš nalog.
      </p>
      <Link
        href="/login"
        className="bg-gray-600 p-6 font-bold rounded-2xl text-white text-center"
      >
        Vrati se
      </Link>
    </>
  );
};

export default Registracija;
