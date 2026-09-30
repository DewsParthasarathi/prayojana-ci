import LoginCourosal from "@pages/login-page/login-courosal/LoginCourosal";
import topPattern from "@assets/images/login-images/login-top-pattern.png";
import bottomPattern from "@assets/images/login-images/login-bottom-pattern.png";

const LoginLayout = ({ children }) => {
  const LoginSlides = [
    {
      id: 1,
      title: "Compassionate Senior Care for Your Loved Ones, Right at Home",
      desc: "We help your parents stay active, healthy, and comfortable with personalized senior care, health management, emergency support, and everyday assistance—giving families complete peace of mind, wherever they are.",
    },
    {
      id: 2,
      title: "Trusted Care for the People Who Cared for You",
      desc: "Whether you're living nearby or overseas, Prayojana provides reliable senior care services that keep your parents healthy, engaged, and supported with a dedicated local care team.",
    },
    {
      id: 3,
      title: "Peace of Mind for You. Purposeful Living for Your Parents",
      desc: "Our holistic care plans combine health support, home assistance, emergency care, and meaningful engagement to help seniors live happier, healthier, and more independent lives.",
    },
  ];

  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="flex py-[25px] pl-[22px] h-full">
        <div className="w-[40%] h-full bg-[url('@assets/images/login-images/login-left-bg.png')] bg-cover bg-center relative rounded-[10px] overflow-hidden z-[1]">
          <div className="absolute h-full w-full bg-[#006BBF] opacity-[0.8] top-0 left-0 right-0 bottom-0"></div>
          <div className="z-[5] absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full pl-[15%] h-full">
            <LoginCourosal slides={LoginSlides} />
          </div>
        </div>
        <div className="w-[60%] relative">
          <div className="absolute right-[-5%] top-[-5%] w-[20rem]">
            <img src={topPattern} alt="pattern" />
          </div>
          <div className="">{children} </div>

          <div className="absolute bottom-[-5%] left-[-5%] w-[20rem]">
            <img src={bottomPattern} alt="pattern" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
