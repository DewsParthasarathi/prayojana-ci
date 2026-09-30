import CustomImage from "../image-component/CustomImage";

const CardComponent = ({
  image,
  name,
  subTitle,
  lastData,
  headingClassName = "",
  subTitleClassName = "",
  lastDataClassName = "",
  onClick,
  className = "",
  children,
  firstLetter,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex group w-[30rem] h-[30rem] flex-col items-center border border-[1px] border-[#dddddd] rounded-[19px] pt-[4rem] px-[7.8rem] pb-[1.8rem] ${className} relative`}
    >
      <div className="w-[10.8rem] h-[10.8rem] rounded-full overflow-hidden">
        {image ? (
          <CustomImage src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full  bg-[#1287E3] flex items-center justify-center text-white text-[4rem] font-bold">
            {firstLetter}
          </div>
        )}
      </div>

      <h3
        style={{ whiteSpace: "nowrap" }}
        className={`mt-6 text-[2.2rem] font-semibold text-center w-[9.5ch] truncate cursor-help"   ${headingClassName}`}
        title={name}
      >
        {name}
      </h3>

      <p
        style={{ whiteSpace: "nowrap" }}
        className={`mt-2 text-[13px] text-center ${subTitleClassName}`}
      >
        {subTitle}
      </p>

      <p
        style={{ whiteSpace: "nowrap" }}
        className={`mt-6 text-[1.6rem] font-semibold text-center ${lastDataClassName}`}
      >
        {lastData}
      </p>

      <div className="absolute right-[5%] top-[6%]  hidden group-hover:flex flex-col gap-[10px]">
        {children}
      </div>
    </div>
  );
};

export default CardComponent;
