type SubTitleProps = {
  value: string;
  hidden?: boolean;
};

export const SubTitle: React.FC<SubTitleProps> = ({ value, hidden }) => {
  return (
    <span
      hidden={hidden}
      className="text-sm leading-6 font-normal text-zinc-500 dark:text-zinc-400"
    >
      {value}
    </span>
  );
};
