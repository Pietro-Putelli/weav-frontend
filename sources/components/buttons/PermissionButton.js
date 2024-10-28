import React, { memo } from "react";
import { useDispatch } from "react-redux";
import { requestPermissionForType } from "../../utility/permissions";
import LeftIconButton from "./LeftIconButton";

const PermissionButton = memo(({ item, disabled }) => {
  const dispatch = useDispatch();

  const onPress = () => {
    dispatch(requestPermissionForType(item.type));
  };

  return (
    <LeftIconButton
      style={{ marginBottom: "4%", borderRadius: 20 }}
      icon={item.icon}
      title={item.title}
      disabled={disabled}
      onPress={onPress}
    />
  );
});

export default memo(PermissionButton);
