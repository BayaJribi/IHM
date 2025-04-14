import { CiEdit } from "react-icons/ci";
import { useState } from "react";
import ProfileUpdateModal from "../modals/ProfileUpdateModal";
import Tooltip from "../shared/Tooltip";

const OwnProfileCard = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="rounded-md border bg-white p-6">
      <div
        className="flex cursor-pointer justify-end text-xl"
        onClick={handleOpenModal}
      >
        <Tooltip text="Edit profile">
          <CiEdit />
        </Tooltip>
      </div>

      <div className="flex flex-col items-center justify-center">
        <img
          className="h-28 w-28 rounded-full object-cover"
          src={user.avatar}
          alt="Profile"
        />
        <h2 className="mt-5 text-center text-lg font-bold">{user.name}</h2>
      </div>

      <ProfileUpdateModal
        user={user}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default OwnProfileCard;
