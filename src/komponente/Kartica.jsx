import Link from "next/link";

const Kartica = ({ id, naziv, slika, datum }) => {
  // Kartica - Predstavlja pojedinacni projekat u aplikaciji
  const formatiranDatum = datum.split("-");
  const povezanDatum = `${formatiranDatum[2].slice(0, 2)}.${
    formatiranDatum[1]
  }.${formatiranDatum[0]}.`;
  return (
    <Link
      href={`slika/${id}`}
      className="relative h-[240px] sm:h-[330px] w-[160px] sm:w-[220px] bg-transparent rounded-xl overflow-hidden hover:scale-105 transition-all duration-500 drop-shadow-xl"
    >
      <div className="flex flex-col text-center bg-[#000000aa] mt-[170px] sm:mt-[260px] py-4 text-white z-50">
        <h3 className="text-sm text-white">{naziv}</h3>
        <h6 className="text-sm">{povezanDatum}</h6>
      </div>
      {/* <div className="absolute -bottom-28 right-0 translate-x-1/2 bg-[#000000aa] drop-shadow-[0px_-100px_6px_rgba(0,0,0)] w-[400px] sm:w-[600px] py-4 h-20"></div> */}
      <img
        src={`/slike/${slika}`}
        className="object-cover h-[330px] w-[220px] absolute left-0 top-0 -z-10"
      ></img>
    </Link>
  );
};

export default Kartica;
