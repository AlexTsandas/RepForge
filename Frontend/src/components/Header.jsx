import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import headerBackground from "@/assets/RepForge_original_dragons_responsive_2560x210.png";
import { useUser, useClerk } from "@clerk/react";
import { Button } from "@/components/ui/button.jsx";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet.jsx";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = (event) => {
      if (event.matches) setMenuOpen(false);
    };

    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  if (!isLoaded) return null;

  const displayName = user?.fullName || user?.username || "User";
  const navigationLinks = [
    { label: "Exercises", to: "/exercises" },
    {
      label: "My Routines",
      to: isSignedIn ? "/myroutines" : "/?preview=routines",
    },
    {
      label: "Workout History",
      to: isSignedIn ? "/workoutshistory" : "/?preview=history",
    },
  ];

  const accountMenu = isSignedIn ? (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="flex cursor-pointer items-center rounded-full p-1 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="size-10 lg:size-12">
          <AvatarImage src={user.imageUrl} alt={displayName} />
          <AvatarFallback>
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className="min-h-11 cursor-pointer text-sm lg:min-h-7 lg:text-xs"
          onClick={() => openUserProfile()}
        >
          Profile settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="min-h-11 cursor-pointer text-sm lg:min-h-7 lg:text-xs"
          onClick={() => signOut({ redirectUrl: "/" })}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;

  return (
    <header
      className="border-b bg-cover bg-[position:20%_center] bg-no-repeat px-4 py-3 lg:bg-center lg:px-6 lg:py-5"
      style={{ backgroundImage: `url("${headerBackground}")` }}
    >
      <div className="grid min-h-12 grid-cols-[1fr_auto_1fr] items-center gap-2 lg:hidden">
        <div className="justify-self-start">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="size-11 cursor-pointer rounded-lg" />}
              aria-label="Open navigation menu"
            >
              <HugeiconsIcon icon={Menu01Icon} className="size-6" aria-hidden="true" />
            </SheetTrigger>

            <SheetContent
              side="left"
              showCloseButton={false}
              className="data-[side=left]:w-[min(20rem,calc(100%-2rem))] overflow-y-auto overscroll-contain"
            >
              <SheetHeader className="relative border-b pr-16">
                <SheetTitle className="text-2xl font-bold">RepForge</SheetTitle>
                <SheetDescription>Your training space.</SheetDescription>
                <SheetClose
                  render={<Button variant="ghost" size="icon" className="absolute right-3 top-4 size-11 cursor-pointer" />}
                  aria-label="Close navigation menu"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-5" aria-hidden="true" />
                </SheetClose>
              </SheetHeader>

              <nav aria-label="Mobile navigation" className="space-y-2 p-4">
                {[
                  { label: isSignedIn ? "Dashboard" : "Home", to: "/" },
                  ...navigationLinks,
                ].map((link) => {
                  const active = location.pathname + location.search === link.to;

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`flex min-h-12 items-center rounded-xl px-4 text-base font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                        active
                          ? "bg-orange-50 text-orange-700"
                          : "hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {!isSignedIn && (
                <SheetFooter className="border-t pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                  <Button
                    nativeButton={false}
                    render={<Link to="/sign-up" />}
                    onClick={() => setMenuOpen(false)}
                    className="h-12 rounded-xl bg-orange-600 text-sm text-white hover:bg-orange-700"
                  >
                    Create an account
                  </Button>
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={<Link to="/sign-in" />}
                    onClick={() => setMenuOpen(false)}
                    className="h-12 rounded-xl text-sm"
                  >
                    Sign in
                  </Button>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>

        <Link to="/" className="rounded-lg text-2xl font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring">
          RepForge
        </Link>

        <div className="justify-self-end">
          {isSignedIn ? accountMenu : (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link to="/sign-in" />}
              className="h-11 rounded-lg px-3 text-sm"
            >
              Sign in
            </Button>
          )}
        </div>
      </div>

      <NavigationMenu className="hidden w-full max-w-none justify-start lg:flex">
        <NavigationMenuList className="w-full justify-start gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link to="/" />}
              className="text-2xl font-bold"
            >
              RepForge
            </NavigationMenuLink>
          </NavigationMenuItem>

          {navigationLinks.map((link) => (
            <NavigationMenuItem key={link.to}>
              <NavigationMenuLink
                render={<Link to={link.to} />}
                className="cursor-pointer text-lg font-medium"
              >
                {link.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          <NavigationMenuItem className="ml-auto flex h-14 items-center gap-2">
            {isSignedIn ? accountMenu : (
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
