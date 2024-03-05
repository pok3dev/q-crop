import Link from "next/link";

const Registracija = () => {
  return (
    <>
      <form className="flex flex-col gap-6 justify-center align-middle">
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
        ></input>
        <input
          placeholder="Ponovite šifru"
          className="p-4 bg-white h-16 rounded-xl text-black"
          name="šifra"
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
