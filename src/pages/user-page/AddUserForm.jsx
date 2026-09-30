import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserForm, { formToAdmin } from "./user-page-components/UserForm";
import { addAdmin, selectAdmins } from "@/store/slices/adminsSlice";
import { useToast } from "@/hooks/useToast";
import { ROUTES } from "@/routes/routes";

const AddUserForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admins = useSelector(selectAdmins);
  const { showToast } = useToast();

  const handleSubmit = (form) => {
    const nextId = admins.reduce((max, a) => Math.max(max, Number(a.id) || 0), 0) + 1;
    const newAdmin = formToAdmin(form, { id: nextId });
    dispatch(addAdmin(newAdmin));
    showToast({
      variant: "success",
      title: "User created",
      description: `${newAdmin.name} has been added successfully.`,
    });
    navigate(ROUTES.SOLO);
  };

  return (
    <>
      <div className="flex justify-between items-center pt-[6.9rem] pb-[4.6rem] h-auto">
        <div>
          <h1 className="font-semibold text-(--black) text-[3rem]">Add User Data</h1>
          <p className="text-[1.6rem] text-gray-500">
            Admin {">"} User Data {">"} Add User Data
          </p>
        </div>
      </div>
      <div className="bg-transparent pr-[8rem]">
        <UserForm mode="add" onSubmit={handleSubmit} onCancel={() => navigate(ROUTES.SOLO)} />
      </div>
    </>
  );
};

export default AddUserForm;
