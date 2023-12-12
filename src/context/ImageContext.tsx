import React, { createContext, useState, PropsWithChildren } from "react";

interface ImageContextType {
  profileImage: string | undefined;
  setProfileImage: (image: string | undefined) => void;
}

export const ImageContext = createContext<ImageContextType>({
  profileImage: undefined,
  setProfileImage: () => { },
});

export const ImageProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  );

  return (
    <ImageContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ImageContext.Provider>
  );
};
