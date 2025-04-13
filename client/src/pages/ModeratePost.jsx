import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const ModeratePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  const token = JSON.parse(localStorage.getItem("profile"))?.accessToken;

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`http://localhost:4000/notifications/moderate/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost(res.data);
    };
    fetchPost();
  }, [id]);

  const handleAccept = async () => {
    await axios.patch(`http://localhost:4000/notifications/accept/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/"); // Redirection
  };

  const handleReject = async () => {
    await axios.delete(`http://localhost:4000/notifications/reject/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/"); // Redirection
  };

  if (!post) return <p>Chargement...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Modération du Post</h2>
      <p className="mt-2">{post.content}</p>
      
      {/* Ajout de l'affichage de l'image ou de la vidéo */}
      <div className="mt-4">
        {post.fileUrl && post.fileType === "image" ? (
          <img
            src={post.fileUrl}
            alt={post.content}
            loading="lazy"
            className="cursor-pointer object-cover rounded-md max-w-full h-auto"
          />
        ) : (
          post.fileUrl && (
            <div className="w-full aspect-w-16 aspect-h-9">
              <video
                className="block mx-auto rounded-md focus:outline-none max-w-full h-auto"
                src={post.fileUrl}
                controls
              />
            </div>
          )
        )}
      </div>
      
      <div className="mt-4 flex gap-4">
        <button onClick={handleAccept} className="bg-green-500 text-white px-4 py-2 rounded">
          ✅ Accepter
        </button>
        <button onClick={handleReject} className="bg-red-500 text-white px-4 py-2 rounded">
          ❌ Refuser
        </button>
      </div>
    </div>
  );
};

export default ModeratePost;