const Reset = ({ velicina, klase }) => {
  return (
    <div className="flex justify-center align-middle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`ionicon ${klase}`}
        viewBox={`0 0 ${velicina} ${velicina}`}
      >
        <path
          d="M320 146s24.36-12-64-12a160 160 0 10160 160"
          fill="none"
          stroke="white"
          stroke-linecap="round"
          stroke-miterlimit="10"
          stroke-width="48"
        />
        <path
          fill="none"
          stroke="white"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="48"
          d="M256 58l80 80-80 80"
        />
      </svg>
    </div>
  );
};

export default Reset;
