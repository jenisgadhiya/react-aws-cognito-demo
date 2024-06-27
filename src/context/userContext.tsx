import userpool from "@/lib/userpool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
} from "react";

interface UserData {
  name: string;
  email: string;
}

interface UserContextType {
  user: UserData | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = () => {
    const cognitoUser = userpool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.getSession((err: Error) => {
        if (err) {
          setLoading(false);
          setUser(null);
          return;
        }
        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            setLoading(false);
            setUser(null);
            return;
          }
          const userData: UserData = {
            name: attributes
              ?.find((attr) => attr.getName() === "name")
              ?.getValue() as string,
            email: attributes
              ?.find((attr) => attr.getName() === "email")
              ?.getValue() as string,
          };
          setUser(userData);
          setLoading(false);
        });
      });
    } else {
      setLoading(false);
      setUser(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    const authenticationData = {
      Username: email,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const userData = {
      Username: email,
      Pool: userpool,
    };
    const cognitoUser = new CognitoUser(userData);

    return new Promise<void>((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          getCurrentUser();
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  const signOut = () => {
    const cognitoUser = userpool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
      setUser(null);
    }
  };

  const contextValue: UserContextType = {
    user,
    signIn,
    signOut,
    loading,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
