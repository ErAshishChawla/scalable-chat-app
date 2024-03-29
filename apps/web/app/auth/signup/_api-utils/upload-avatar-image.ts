import axios from "axios";

export const uploadAvatarImage = async (awsUrl: string, avatarImage: File) => {
  console.log(avatarImage);
  const response = await axios.put(awsUrl, avatarImage, {
    headers: {
      "Content-Type": avatarImage.type,
    },
  });

  return response;
};
