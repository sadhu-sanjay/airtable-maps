import { use, useState } from "react";
import { DropdownItem } from "~/components/models/types";

type MultiSelectProps = {
  data: any[];
  label: string;
  placeholder: string;
  doneCallBack: (selectedItems: DropdownItem[]) => void;
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  data,
  label,
  placeholder,
  doneCallBack,
}) => {

    

};

export default MultiSelect;
