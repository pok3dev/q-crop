"use client";
import Alert from "@/komponente/Alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import validator from "validator";

const Registracija = () => {
  const [poruka, setPoruka] = useState("");
  const navigation = useRouter();
  // Funkcija za registraciju - Validacija unosa i slanje API zahtjeva
  const handleRegister = async (e) => {
    const forma = e.target;
    e.preventDefault();

    const ime = forma.ime.value;
    const mejl = forma.mejl.value;
    const šifra = forma.šifra.value;
    const šifraPotvrda = forma.šifraPotvrda.value;
    if (!ime || !mejl || !šifra || !šifraPotvrda) {
      return setPoruka("Unesite sva polja.");
    }
    if (ime.length > 25)
      return setPoruka("Ime ne smije biti duže od 25 znakova");
    if (mejl.length > 50)
      return setPoruka("Mejl ne smije biti duži od 50 znakova");
    if (šifra.length > 50)
      return setPoruka("Šifra ne smije biti duže od 50 znakova");

    if (šifra != šifraPotvrda) return setPoruka("Šifre moraju biti iste.");
    if (šifra.length < 8)
      return setPoruka("Šifra mora sadržavati minimalno 8 znakova.");
    if (!validator.isEmail(mejl)) return setPoruka("Mejl nije ispravan...");

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
      navigation.replace("/login");
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
          className="p-4 bg-white h-14 sm:h-16 rounded-xl text-black"
          name="ime"
        ></input>
        <input
          placeholder="Unesite mejl"
          className="p-4 bg-white h-14 sm:h-16 rounded-xl text-black"
          name="mejl"
        ></input>
        <input
          placeholder="Unesite šifru"
          className="p-4 bg-white h-14 sm:h-16 rounded-xl text-black"
          name="šifra"
          type="password"
        ></input>
        <input
          placeholder="Ponovite šifru"
          className="p-4 bg-white h-14 sm:h-16 rounded-xl text-black"
          name="šifraPotvrda"
          type="password"
        ></input>
        <button className="bg-green-300 p-4 sm:p-6 font-bold rounded-2xl ">
          Registruj se
        </button>
      </form>
      <p className="text-white text-center text-sm sm:text-lg -mt-4 -mb-8 sm:mt-4 sm:-mb-4">
        Vrati se nazad u slučaju da već imaš nalog.
      </p>
      <Link
        href="/login"
        className="bg-gray-600 p-4 sm:p-6 font-bold rounded-2xl text-white text-center"
      >
        Vrati se
      </Link>
    </>
  );
};

export default Registracija;
