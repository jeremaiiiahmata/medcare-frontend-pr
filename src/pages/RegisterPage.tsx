import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <>
      <div className="grid h-screen w-full grid-cols-2 bg-[#F1F7F7]">
        <div className="bg-[url(/logo-placeholder.png)] bg-contain"></div>
        <div className="place-self-center">
          <RegisterForm />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
