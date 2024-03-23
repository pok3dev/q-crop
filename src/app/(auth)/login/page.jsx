"use client";
import Alert from "@/komponente/Alert";
import Link from "next/link";
import { useContext, useState } from "react";

const Login = () => {
  const [poruka, setPoruka] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    const forma = e.target;
    if (!forma.mejl.value || !forma.šifra.value) {
      setPoruka("Unesite sva polja.");
    }
    const req = await fetch("http://localhost:3001/korisnik/dohvatiKorisnika", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mejl: forma.mejl.value,
        šifra: forma.šifra.value,
      }),
    });
    const res = await req.json();
    if (res.status == "Uspješno") {
      setKorisnik(res.korisnik);
      location.reload();
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
        onSubmit={handleLogin}
      >
        <input
          placeholder="Unesite mejl"
          className="p-4 bg-white h-16 rounded-xl text-black"
          name="mejl"
        ></input>
        <input
          placeholder="Unesite lozinku"
          className="p-4 bg-white h-16 rounded-xl text-black"
          name="šifra"
          type="password"
        ></input>
        <button className="bg-green-300 p-6 font-bold rounded-2xl ">
          Uloguj se
        </button>
      </form>
      <p className="text-white text-center mt-12 -mb-4">
        Nemaš nalog? <br />
        Registruj se u roku od minut i pridruži nam se u uređivanju slika!
      </p>
      <Link
        href="/registracija"
        className="bg-gray-600 p-6 font-bold rounded-2xl text-white text-center"
      >
        Registruj se
      </Link>
    </>
  );
};

export default Login;
