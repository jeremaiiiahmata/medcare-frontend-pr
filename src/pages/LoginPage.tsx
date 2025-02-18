import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <div className="grid h-screen w-full grid-cols-2">
        <div className="place-self-center">
          <LoginForm />
        </div>
        <div className="bg-[url(/bg.png)] bg-center"></div>
      </div>
    </>
  );
};

export default LoginPage;
