import { SignUp } from "@clerk/react";

const SignUpPage = () => {
  return (
    <main className="flex min-h-[calc(100svh-6rem)] items-center justify-center px-4 py-8">
      <SignUp signUpUrl="/sign-up" />
    </main>
  );
};

export default SignUpPage;
