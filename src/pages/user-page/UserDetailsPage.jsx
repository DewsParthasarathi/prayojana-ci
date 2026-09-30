import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import editIcon from "@assets/images/logos/customer-edit.png";
import CustomImage from "@/components/image-component/CustomImage";
import EmployeeInfo from "./user-page-components/EmployeeInfo";
import PersonalInfo from "./user-page-components/PersonalInfo";
import BackgroundInfo from "./user-page-components/BackgroundInfo";
import ProfessionalInfo from "./user-page-components/ProfessionalInfo";
import PersonalityInfo from "./user-page-components/PersonalityInfo";
import { selectAdminById } from "@/store/slices/adminsSlice";
import { ROUTES } from "@/routes/routes";

const UserDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const stateUser = location.state?.users;
  const id = params.userId ?? stateUser?.id;
  const storeUser = useSelector(selectAdminById(id));
  const user = storeUser || stateUser;

  if (!user) {
    return (
      <div className="pt-[6.9rem]">
        <p className="text-[1.8rem] text-gray-600">User not found.</p>
      </div>
    );
  }

  const goEdit = () =>
    navigate(ROUTES.USERDATAEDITFORM, { state: { userId: user.id, users: user } });

  return (
    <>
      <div className="flex justify-between items-center pt-[6.9rem] pb-[4.6rem] h-auto">
        <div>
          <h1 className="font-semibold text-(--black) text-[3rem]">User Data</h1>
          <p className="text-[1.6rem] text-gray-500">
            {user.role} {">"} User Data
          </p>
        </div>
        <button
          type="button"
          onClick={goEdit}
          className="flex items-center cursor-pointer"
          aria-label="Edit user"
        >
          <div className="edit-icon h-[15px] w-[15px]">
            <CustomImage src={editIcon} alt="edit icon" />
          </div>
          <p className="text-[2.6rem] text-[#158DEB] font-medium ml-2">Edit</p>
        </button>
      </div>
      <div className="bg-white rounded-[23px] p-[5.2rem] mb-[2%]">
        <EmployeeInfo users={user} />
        <PersonalInfo users={user} />
        <BackgroundInfo users={user} />
        <ProfessionalInfo users={user} />
        <PersonalityInfo users={user} />
      </div>
    </>
  );
};

export default UserDetailsPage;
