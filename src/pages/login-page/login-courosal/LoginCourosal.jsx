import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const LoginCourosal = ({ slides }) => {
  return (
    <Swiper
      className="h-full login-swiper"
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
    >
      {slides.map((slide) => (
        <SwiperSlide className="h-full" key={slide.id}>
          <div className="h-full flex flex-col items-center justify-center w-[80%] ">
            <h1 className="text-[3.6rem] text-white font-semibold pb-[5%]">
              {" "}
              {slide.title}
            </h1>
            <p className="text-[1.8rem] text-white leading-[2.5rem]">
              {slide.desc}
            </p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default LoginCourosal;
