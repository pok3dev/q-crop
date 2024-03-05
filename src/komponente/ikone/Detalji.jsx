const Detalji = ({ velicina, klase }) => {
  return (
    <div className="flex justify-center align-middle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`ionicon ${klase}`}
        viewBox={`0 0 ${velicina} ${velicina}`}
      >
        <path
          d="M393.87 190a32.1 32.1 0 01-45.25 0l-26.57-26.57a32.09 32.09 0 010-45.26L382.19 58a1 1 0 00-.3-1.64c-38.82-16.64-89.15-8.16-121.11 23.57-30.58 30.35-32.32 76-21.12 115.84a31.93 31.93 0 01-9.06 32.08L64 380a48.17 48.17 0 1068 68l153.86-167a31.93 31.93 0 0131.6-9.13c39.54 10.59 84.54 8.6 114.72-21.19 32.49-32 39.5-88.56 23.75-120.93a1 1 0 00-1.6-.26z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-miterlimit="10"
          stroke-width="32"
        />
        <circle cx="96" cy="416" r="16" />
      </svg>
    </div>
  );
};

export default Detalji;
