const Label = ({ children }: { children: any }) => {
  return (
    <span className="pr-2 text-base leading-6 font-semibold text-zinc-700 dark:text-zinc-100">
      {children}
      {": "}
    </span>
  );
};

export default Label;
