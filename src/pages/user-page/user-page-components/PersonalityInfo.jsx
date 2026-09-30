import React from "react";

const PersonalityInfo = ({ users }) => {
  return (
    <>
      <h1 className="text-[2.6rem] font-semibold pb-[1.5rem] border-b border-[#E6E6E6]">
        Professional Info
      </h1>
      <div className=" pt-[2.7rem]">
        <h2 className="text-[2rem] font-medium pb-[1.6rem]">Interests</h2>
        <div className="chips flex items-center gap-[1.1rem] pb-[4rem]">
          {users?.personalityInfo?.interests?.map((interest, index) => (
            <p
              key={index}
              className="chip   px-[1.6rem] py-[0.5rem] rounded-[1.7rem] bg-[#FAFAFA] border border-[#D2D2D2] text-[1.4rem] text-[#333333] text-center "
            >
              {interest}
            </p>
          ))}
        </div>
      </div>
      <div className="">
        <h2 className="text-[2rem] font-medium pb-[1.6rem]">Traits</h2>
        <div className="chips flex items-center gap-[1.1rem] pb-[4rem]">
          {users?.personalityInfo?.traits?.map((trait, index) => (
            <p
              key={index}
              className="chip px-[1.6rem] py-[0.5rem] rounded-[1.7rem] bg-[#FAFAFA] border border-[#D2D2D2] text-[1.4rem] text-[#333333] text-center "
            >
              {trait}
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default PersonalityInfo;
