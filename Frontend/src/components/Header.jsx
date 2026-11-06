import { Link } from "react-router";
import headerBackground from "@/assets/RepForge_original_dragons_responsive_2560x210.png";
import { useUser, useClerk } from "@clerk/react";
import { Button } from "@/components/ui/button.jsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.jsx";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu.jsx";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar.jsx";

const Header = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openUserProfile, signOut } = useClerk();

  if (!isLoaded) return null;

  const displayName = user?.fullName || user?.username || "User";

  return (
    <header
      className="border-b bg-cover bg-[position:20%_center] bg-no-repeat px-6 py-5 lg:bg-center"
      style={{ backgroundImage: `url("${headerBackground}")` }}
    >
      <NavigationMenu className="w-full max-w-none justify-start">
        <NavigationMenuList className="w-full justify-start gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link to="/" />}
              className="text-2xl font-bold"
            >
              RepForge
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
               render={<Link to="/exercises" />}
              className="cursor-pointer text-lg font-medium"
            >
              Exercises
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              
              className="cursor-pointer text-lg font-medium"
              render={
                !isSignedIn ? <Link to="/?preview=routines" /> : <Link to="/myroutines" />
              }
            >
              My Routines
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              // render={<Link to="/workoutshistory" />}
              className="cursor-pointer text-lg font-medium"
              render={
                !isSignedIn ? <Link to="/?preview=history" /> : <Link to="/workoutshistory" />
              }
            >
              Workout History
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem className="ml-auto flex h-14 items-center gap-2">
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Open account menu"
                  className="flex cursor-pointer items-center rounded-full p-1 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Avatar className="size-12">
                    <AvatarImage src={user.imageUrl} alt={displayName} />
                    <AvatarFallback>
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => openUserProfile()}
                  >
                    Profile settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signOut({ redirectUrl: "/" })}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link to="/sign-in" />}
                  className="h-10 px-4 text-base"
                >
                  Sign in
                </Button>

                <Button
                  nativeButton={false}
                  render={<Link to="/sign-up" />}
                  className="h-10 px-4 text-base"
                >
                  Sign up
                </Button>
              </>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default Header;