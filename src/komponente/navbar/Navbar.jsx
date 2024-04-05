import "@/app/globals.css";

const Navbar = () => {
  return (
    <div className="absolute flex w-full justify-between py-6 px-12 align-middle text-white bg-slate-800 mb-6">
      {/* Naziv aplikacije */}
      <h1 className="absolute left-[50%] -translate-x-[50%] text-3xl font-bold ">
        qCrop
      </h1>
      {/* Opcije korisnika */}
      <span className="ml-auto flex align-middle gap-8">
        <h2 className="hidden md:block py-2 ">Marko Marendovic</h2>
        <div className="rounded-full h-10 w-10 inline-block bg-white"></div>
      </span>
    </div>
  );
};

export default Navbar;
