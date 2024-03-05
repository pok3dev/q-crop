const Upload = () => {
  // Upload - Komponenta dijete za 'drag and drop files' komponentu
  return (
    <div className="w-[400px] h-[300px] bg-transparent border-4 border-[#2a4657] rounded-xl border-dashed flex justify-center items-center mt-6 cursor-pointer hover:scale-105 transition-all duration-300 z-0">
      <h1 className="text-[#2a4657] font-bold text-center">
        Prevuci sliku ili klikni i odaberi željenu sliku
      </h1>
    </div>
  );
};

export default Upload;
