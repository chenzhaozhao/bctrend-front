import React, { useState } from "react";
const SwitchSelect = ({onChange,tabs}:{onChange:()=>void,tabs:string[]}) => {
  const [isSelect, setIsSelect] = useState(true);
  const changeStatus = () => {
    setIsSelect(!isSelect);
    onChange &&onChange()
  };
  return (
    <div
      className=" flex  border  border-black rounded-3xl"
      onClick={changeStatus}
    >
      <div className={isSelect ? "isSelect px-2 py-1" : "px-2 py-1"}>{tabs[0]}</div>
      <div className={!isSelect ? "isSelect px-2 py-1" : "px-2 py-1"}>{tabs[1]}</div>
    </div>
  );
};

export default SwitchSelect;
