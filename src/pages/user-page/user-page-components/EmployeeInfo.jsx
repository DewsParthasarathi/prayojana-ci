
const EmployeeInfo = ({ users }) => {
  return (
    <>
      <h1 className="text-[2.6rem] font-semibold pb-[1.5rem] border-b border-[#E6E6E6]">
        Employee Info
      </h1>
      <div className="flex flex-wrap justify-between items-center pt-[4.7rem] ">
        <div className="pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Employee ID</p>
          <p className="text-[1.9rem]">{users.empId}</p>
        </div>
        <div className="pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Date of Joining</p>
          <p className="text-[1.9rem]">{}</p>
        </div>
        <div className="pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Current Designation</p>
          <p className="text-[1.9rem]">{users.role}</p>
        </div>
        <div className="pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Role</p>
          <p className="text-[1.9rem]">{users.role}</p>
        </div>
        <div className="pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Business Email</p>
          <p className="text-[1.9rem]">{users.email}</p>
        </div>
        <div className="pb-[7.6rem]">
          <p className="text-[12px] text-[#00000080]">Status</p>
          <p className="text-[1.9rem]">{users.status}</p>
        </div>
      </div>
    </>
  );
};

export default EmployeeInfo;
