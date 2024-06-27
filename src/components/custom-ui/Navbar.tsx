import { useUserContext } from "@/context/userContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

const Navbar = () => {
  const { user, signOut } = useUserContext();
  return (
    <div className="absolute top-0 flex justify-between items-center w-full h-[60px] bg-slate-900 text-white px-8">
      <h4 className="text-xl">React AWS Cognito Demo</h4>
      <Popover>
        <PopoverTrigger>
          <Avatar>
            <AvatarFallback
              children={user?.name?.[0]?.toUpperCase()}
              className="text-slate-900 text-2xl font-bold"
            />
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-auto px-2 py-1">
          <Button onClick={signOut}>Logout</Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Navbar;
