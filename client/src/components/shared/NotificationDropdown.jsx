import { useEffect, useState } from "react";
import axios from "axios";
import { FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    const token = JSON.parse(localStorage.getItem("profile"))?.accessToken;

    try {
      const res = await axios.get("http://localhost:4000/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const validNotifications = res.data.filter((n) => n.post !== null);
      setNotifications(validNotifications);
      setUnreadCount(validNotifications.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("❌ Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    const token = JSON.parse(localStorage.getItem("profile"))?.accessToken;
    try {
      await axios.patch(
        `http://localhost:4000/notifications/mark-read/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchNotifications(); // recharger les notifs après marquage
    } catch (err) {
      console.error("❌ Failed to mark notification as read", err);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer relative text-2xl"
      >
        <FiBell className="text-gray-600 hover:text-primary" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md z-30 p-4">
          <h3 className="text-md font-semibold mb-2">📢 Notifications</h3>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="text-gray-500">Aucune notification</li>
            ) : (
              notifications.map((notif) => (
                <li key={notif._id} className="mb-2 border-b pb-2 text-sm">
                  <p>
                    <strong>Nouveau post à modérer dans</strong>{" "}
                    {notif.community?.name}
                  </p>
                  <p className="mt-1">
                    {notif.post?.content?.slice(0, 80) || "Contenu vide"}...
                  </p>
                  <Link
                    to={`/moderate/${notif.post._id}`}
                    onClick={() => markAsRead(notif._id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Examiner
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
