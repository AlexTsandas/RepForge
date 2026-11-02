import { Spinner } from "@/components/ui/spinner.jsx";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div
      role="status"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-orange-50">
        <Spinner
          aria-hidden="true"
          className="size-8 text-orange-500 motion-reduce:animate-none"
        />
      </div>

      <p className="text-lg font-medium tracking-wide text-muted-foreground">
        {message}
      </p>
    </div>
  );
};

export default Loading;