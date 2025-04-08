import { useState, useEffect } from "react";
import Tab from "../components/admin/Tab";
import Logs from "../components/admin/Logs";
import Settings from "../components/admin/Settings";
import CommunityManagement from "../components/admin/CommunityManagement";
import { useSelector, useDispatch } from "react-redux";
import { logoutAction } from "../redux/actions/adminActions";
import { useNavigate } from "react-router-dom";
import ModeratorsList from "../components/admin/ModeratorsList";
import SignUpNew from "./SignUp";
import AddModerator from "./AddModerator";
const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("logs");
  const adminPanelError = useSelector((state) => state.admin?.adminPanelError);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (adminPanelError === "Unauthorized") {
      dispatch(logoutAction()).then(() => {
        navigate("/admin/signin");
      });
    }
  }, [adminPanelError, dispatch, navigate]);

  return (
    <div className="pt-5 max-w-6xl mx-auto flex flex-col justify-center items-center ">
      <Tab activeTab={activeTab} handleTabClick={handleTabClick} />

      {activeTab === "logs" && <Logs />}
      {activeTab === "Community Management" && <CommunityManagement />}
      {activeTab === "moderators" && <ModeratorsList />}

    </div>
  );
};

export default AdminPanel;
