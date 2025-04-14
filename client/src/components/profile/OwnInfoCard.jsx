import React from 'react';

const OwnInfoCard = ({ user = {} }) => {
  // Create a user object with defaults to prevent errors from missing data
  const userWithDefaults = {
    duration: user?.duration || "unknown time",
    createdAt: user?.createdAt || new Date().toISOString(),
    totalPosts: user?.totalPosts || 0,
    totalCommunities: user?.totalCommunities || 0,
    totalPostCommunities: user?.totalPostCommunities || 0,
    followers: user?.followers || [],
    following: user?.following || [],
    ...user
  };

  return (
    <div className="bg-white rounded-md border p-6 space-y-2 my-5">
      <div className="flex flex-wrap items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">Profile Summary</h3>
        <div className="text-sm text-gray-500">
          Joined {userWithDefaults.duration} ago (
          {new Date(userWithDefaults.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          )
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between text-sm">
        <div className="text-gray-500">Total Posts</div>
        <div className="font-medium text-gray-800">{userWithDefaults.totalPosts}</div>
      </div>
      <div className="flex flex-wrap items-center justify-between text-sm">
        <div className="text-gray-500">Total Communities</div>
        <div className="font-medium text-gray-800">{userWithDefaults.totalCommunities}</div>
      </div>
      {userWithDefaults.totalPosts > 0 && (
        <div className="flex flex-wrap items-center justify-between text-sm">
          <div className="text-gray-500">Posts in Communities</div>
          <div className="font-medium text-gray-800">
            {userWithDefaults.totalPosts} in {userWithDefaults.totalPostCommunities}{" "}
            {userWithDefaults.totalPostCommunities === 1 ? "community" : "communities"}
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between text-sm">
        <div className="text-gray-500">Followers</div>
        <div className="font-medium text-gray-800">
          {userWithDefaults.followers?.length ?? 0}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between text-sm">
        <div className="text-gray-500">Following</div>
        <div className="font-medium text-gray-800">
          {userWithDefaults.following?.length ?? 0}
        </div>
      </div>
    </div>
  );
};

export default OwnInfoCard;