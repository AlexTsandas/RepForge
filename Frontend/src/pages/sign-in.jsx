import { SignIn } from "@clerk/react";

const SignInPage = () => {
  return (
    <main className="flex min-h-[calc(100svh-6rem)] items-center justify-center px-4 py-8">
      <SignIn signUpUrl="/sign-up" />
    </main>
  );
};

export default SignInPage;