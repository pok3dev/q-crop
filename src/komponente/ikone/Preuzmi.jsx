const Preuzmi = ({ velicina, klase }) => {
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
          stroke-width="48"
          d="M112 268l144 144 144-144M256 392V100"
        />
      </svg>
    </div>
  );
};

export default Preuzmi;
