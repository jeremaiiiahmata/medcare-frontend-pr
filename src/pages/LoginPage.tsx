import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <div className="grid h-screen w-full grid-cols-2 bg-[#F1F7F7]">
        <div className="place-self-center">
          <LoginForm />
        </div>
        <div className="bg-[url(/logo-placeholder.png)] bg-contain"></div>
      </div>
    </>
  );
};

export default LoginPage;
