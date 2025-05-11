import { LuArrowDownAZ, LuArrowDownZA, LuChevronsUpDown } from "react-icons/lu";

type SortIconType = {
  sortOrder: string | null;
};

const SortIcon = ({ sortOrder }: SortIconType) => {
  if (sortOrder === "ascend") return <LuArrowDownAZ style={{ marginLeft: 5 }} />;
  if (sortOrder === "descend") return <LuArrowDownZA style={{ marginLeft: 5 }} />;
  return <LuChevronsUpDown style={{ marginLeft: 5 }} />;
};

export default SortIcon;
