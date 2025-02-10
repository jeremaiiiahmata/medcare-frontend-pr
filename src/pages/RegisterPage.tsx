import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <>
      <div className="grid h-screen w-full grid-cols-2">
        <div className="bg-[url(/bg.png)] bg-center"></div>
        <div className="place-self-center">
          <RegisterForm />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
