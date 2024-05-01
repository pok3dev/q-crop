import "@/app/globals.css";
import Strelica from "../ikone/Strelica";
import Osoba from "../ikone/Osoba";

const Navbar = ({ imePrezime, cb }) => {
  return (
    <div className="absolute top-0 flex w-full justify-between items-center py-4 sm:py-6 px-6 sm:px-12 text-white bg-slate-800 mb-6">
      {/* Odjava */}
      <button className="cursor-pointer" onClick={cb}>
        <Strelica velicina={512} klase={`w-6 z-50 -rotate-90`} />
        <h2 className=" hidden sm:inline">Odjava</h2>
      </button>
      {/* Naziv aplikacije */}
      <h1 className="absolute left-[50%] -translate-x-[50%] text-xl sm:text-3xl font-bold  ">
        qCrop
      </h1>
      {/* Opcije korisnika */}
      <span className="ml-auto flex align-middle gap-4">
        <h2 className="hidden md:block py-2 ">{imePrezime}</h2>
        <Osoba velicina={512} klase={`w-8 z-50`} />
      </span>
    </div>
  );
};

export default Navbar;
