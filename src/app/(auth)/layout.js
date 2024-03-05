const LoginLayout = ({ children }) => {
  return (
    <div className="mx-auto w-[540px] h-[100vh] flex flex-col gap-12 justify-center align-middle">
      <h1 className="text-white text-center text-4xl font-bold">qCrop</h1>
      {children}
    </div>
  );
};

export default LoginLayout;
