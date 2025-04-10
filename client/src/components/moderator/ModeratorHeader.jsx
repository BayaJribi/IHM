import { FaBell } from "react-icons/fa";

const ModeratorHeader = () => {
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white border-b shadow-sm">
      <h1 className="text-lg font-bold text-primary">Espace Modérateur</h1>

      <div className="relative cursor-pointer">
        <FaBell className="text-gray-600 text-2xl" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
          3
        </span>
      </div>
    </div>
  );
};
const Moderator = () => {
    return (
      <>
        <ModeratorHeader /> {/* 🔔 Affichage ici */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="col-span-2 main-section rounded border bg-white p-4">
            <MainSection />
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">📢 Notifications</h2>
              <NotificationList />
            </div>
          </div>
          <div className="h-screen-20 sticky top-20 col-span-1 rounded border bg-white p-5">
            <ModeratorsList />
          </div>
        </div>
      </>
    );
  };

export default ModeratorHeader;
