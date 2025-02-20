import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <>
      <div className="grid h-screen w-full grid-cols-2 bg-[#e7ffec]">
        <div className="bg-[url(/logo-placeholder.png)] bg-contain"></div>
        <div className="place-self-center">
          <RegisterForm />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
