"use client";
import Klizac from "@/komponente/Klizac";
import Link from "next/link";

const Login = () => {
  return (
    <>
      <form className="flex flex-col gap-6 justify-center align-middle">
        <input
          placeholder="Unesite mejl"
          className="p-4 bg-white h-16 rounded-xl text-black"
          name="mejl"
        ></input>
        <input
          placeholder="Unesite mejl"
          className="p-4 bg-white h-16 rounded-xl text-black"
          name="šifra"
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
      <Klizac />
    </>
  );
};

export default Login;
