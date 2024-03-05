import Kartica from "@/komponente/Kartica";
import Strelica from "@/komponente/ikone/Strelica";
import Footer from "@/komponente/navbar/Footer";
import Navbar from "@/komponente/navbar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col gap-12 text-white">
        {/* Dobrodošlica */}
        <h1 className="ml-12 text-xl">Dobrodošao/la, Marko</h1>
        {/* Pretraga i sortiranje */}
        <div className="flex px-10 w-[596px] md:w-[640px] lg:w-[768px] gap-8 ">
          <button className="flex flex-col justify-items-center align-middle">
            <Strelica klase={`w-8 h-8`} />
            <h2>Datum</h2>
          </button>
          <input
            placeholder="Pretrazite slike"
            className="w-[85%] p-4 bg-white h-12 rounded-xl text-black"
          ></input>
        </div>
        {/* Projekti */}
        <div className="flex px-10 gap-6">
          <Kartica />
          <Kartica />
          <Kartica />
          <Kartica />
        </div>
      </main>
      {/* Podnozje sa dugmicima zapocinjanja projekta */}
      <Footer />
    </>
  );
}
