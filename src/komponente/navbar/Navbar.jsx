import "@/app/globals.css";
import Strelica from "../ikone/Strelica";

const Navbar = ({ imePrezime, cb }) => {
  return (
    <div className="absolute top-0 flex w-full justify-between py-6 px-12 align-middle text-white bg-slate-800 mb-6">
      {/* Odjava */}
      <button className="cursor-pointer" onClick={cb}>
        <Strelica velicina={512} klase={`w-6 z-50 -rotate-90`} />
        <h2>Odjava</h2>
      </button>
      {/* Naziv aplikacije */}
      <h1 className="absolute left-[50%] -translate-x-[50%] text-3xl font-bold ">
        qCrop
      </h1>
      {/* Opcije korisnika */}
      <span className="ml-auto flex align-middle gap-8">
        <h2 className="hidden md:block py-2 ">{imePrezime}</h2>
        <div className="rounded-full h-10 w-10 inline-block bg-white"></div>
      </span>
    </div>
  );
};

export default Navbar;
