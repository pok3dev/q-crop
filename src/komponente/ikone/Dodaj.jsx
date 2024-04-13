const Dodaj = ({ velicina, klase }) => {
  return (
    <div className="flex justify-center align-middle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`ionicon ${klase}`}
        viewBox={`0 0 ${velicina} ${velicina}`}
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="40"
          d="M256 112v288M400 256H112"
        />
      </svg>
    </div>
  );
};

export default Dodaj;
