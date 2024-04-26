const Confirm = ({ poruka, setter, cb }) => {
  // Alert - Uljepsani analog funkcije 'confirm("")'
  // - poruka - Poruka koja se prikazuje u napomeni
  // - setter - Funkcija koja zatvara prozor napomene
  return (
    <span className="absolute top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center z-10">
      <div className="p-8 bg-slate-800 text-white flex flex-col justify-center items-center gap-6 rounded-lg z-20">
        <h1 className="text-xl">{poruka}</h1>
        <div className="flex gap-4">
          <button className="px-8 py-4 bg-red-400  rounded-lg" onClick={cb}>
            Da
          </button>
          <button
            className="px-8 py-4 bg-[#2a4657]  rounded-lg"
            onClick={() => setter(false)}
          >
            Ne
          </button>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-40 flex justify-center items-center"></div>
    </span>
  );
};

export default Confirm;
