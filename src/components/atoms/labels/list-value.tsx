interface ListValueProps {
  value: string;
}

export const ListValue: React.FC<ListValueProps> = ({ value }) => {
  return (
    <span className="text-sm leading-6 font-normal text-zinc-500 dark:text-zinc-400">
      {value}
    </span>
  );
};
