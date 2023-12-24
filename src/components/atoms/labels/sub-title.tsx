type SubTitleProps = {
  value: string;
  hidden?: boolean;
  className?: string;
};

export const SubTitle: React.FC<SubTitleProps> = ({
  value,
  hidden,
  className,
}) => {
  return (
    <span
      hidden={hidden}
      className={`${className} text-sm leading-6 font-normal text-zinc-500 dark:text-zinc-400`}
    >
      {value}
    </span>
  );
};
