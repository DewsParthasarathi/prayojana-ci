import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserForm, { adminToForm, formToAdmin } from "./user-page-components/UserForm";
import { selectAdminById, updateAdmin } from "@/store/slices/adminsSlice";
import { useToast } from "@/hooks/useToast";
import { ROUTES } from "@/routes/routes";

const EditUsersForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const userId = location.state?.userId ?? location.state?.users?.id;
  const admin = useSelector(selectAdminById(userId));

  const initial = useMemo(() => adminToForm(admin), [admin]);

  if (!admin) {
    return (
      <div className="pt-[6.9rem]">
        <p className="text-[1.8rem] text-gray-600">User not found.</p>
        <button
          onClick={() => navigate(ROUTES.SOLO)}
          className="mt-[2rem] text-[#1486DF] text-[1.6rem]"
        >
          Back to Users
        </button>
      </div>
    );
  }

  const handleSubmit = (form) => {
    const updated = formToAdmin(form, admin);
    dispatch(updateAdmin({ id: admin.id, changes: updated }));
    showToast({
      variant: "success",
      title: "User updated",
      description: `${updated.name}'s details have been updated.`,
    });
    navigate(`/userdata/${admin.id}`, { state: { users: updated } });
  };

  return (
    <>
      <div className="flex justify-between items-center pt-[6.9rem] pb-[4.6rem] h-auto">
        <div>
          <h1 className="font-semibold text-(--black) text-[3rem]">Edit User Data</h1>
          <p className="text-[1.6rem] text-gray-500">
            Admin {">"} User Data {">"} Edit User Data
          </p>
        </div>
      </div>
      <div className="bg-transparent pr-[8rem]">
        <UserForm
          mode="edit"
          initialValues={initial}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/userdata/${admin.id}`, { state: { users: admin } })}
        />
      </div>
    </>
  );
};

export default EditUsersForm;
