"use client";
import Alert from "../../../komponente/Alert";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Login = () => {
  const [poruka, setPoruka] = useState("");
  const [provjera, setProvjera] = useState(true);

  const navigate = useRouter();

  // Provjeravamo da li je korisnik već ulogovan ( ako token postoji u browseru )
  useEffect(() => {
    // 1. API poziv
    (async () => {
      const req = await fetch("http://localhost:3001/korisnik/jelUlogovan", {
        method: "GET",
        redirect: "follow",
        credentials: "include", // Za cookije!
      });

      const res = await req.json();

      // 2. Ako je status uspješan, izvršiti redirekciju na početnu stranicu, u suprotnom ostati na istoj stranici
      if (res.status == "Uspješno") {
        navigate.replace("/");
      } else {
        setProvjera(false);
      }
    })();
  }, []);

  // Callback funkcija za logovanje
  const handleLogin = async (e) => {
    // 1. Sprječavamo ponovno učitanje stranice
    e.preventDefault();
    const forma = e.target;

    // 2. Ako sva polja nisu unesena, ispisati poruku
    if (!forma.mejl.value || !forma.šifra.value) {
      return setPoruka("Unesite sva polja.");
    }

    // 3. API poziv sa login podacima
    const req = await fetch("http://localhost:3001/korisnik/dohvatiKorisnika", {
      method: "POST",
      credentials: "include", // Za cookije!
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mejl: forma.mejl.value,
        šifra: forma.šifra.value,
      }),
    });

    // 4. Ako je status uspješan, izvršiti redirekciju na početnu stranicu, u suprotnom ispisati poruku
    const res = await req.json();
    if (res.status == "Uspješno") {
      navigate.replace("/");
    }
    if (res.status == "Greška") {
      setPoruka(res.poruka);
    }
  };

  return (
    <>
      {!provjera && (
        <>
          {poruka && <Alert poruka={poruka} setter={setPoruka} />}
          <form
            className="flex flex-col gap-6 justify-center align-middle"
            onSubmit={handleLogin}
          >
            <input
              placeholder="Unesite mejl"
              className="p-4  bg-white h-14 sm:h-16 rounded-xl text-black sm"
              name="mejl"
            ></input>
            <input
              placeholder="Unesite lozinku"
              className="p-4 bg-white h-14 sm:h-16 rounded-xl text-black"
              name="šifra"
              type="password"
            ></input>
            <button className="bg-green-300 p-4 sm:p-6 font-bold rounded-2xl ">
              Uloguj se
            </button>
          </form>
          <p className="text-white text-sm sm:text-lg text-center sm:mt-12 -mb-6 sm:-mb-4">
            Nemaš nalog?
            <br />
            <br />
            Registruj se u roku od minut i pridruži nam se u uređivanju slika!
          </p>
          <Link
            href="/registracija"
            className="bg-gray-600 p-4 sm:p-6 font-bold rounded-2xl text-white text-center"
          >
            Registruj se
          </Link>
        </>
      )}
    </>
  );
};

export default Login;
