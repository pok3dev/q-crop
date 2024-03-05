const Kartica = () => {
  // Kartica - Predstavlja pojedinacni projekat u aplikaciji
  return (
    <div className="h-[330px] w-[220px] bg-gray-500 rounded-xl">
      <div className="flex flex-col text-center bg-transparent mt-[270px]">
        <h3 className="bg-inherit text-sm">Naziv</h3>
        <h6 className="bg-inherit text-sm">20.2.2024.</h6>
      </div>
    </div>
  );
};

export default Kartica;
