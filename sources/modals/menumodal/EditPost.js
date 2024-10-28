import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { deleteBusinessPost, deleteMyPost } from "../../backend/posts";
import { CenterIconCell } from "../../components/cells";
import { PostCell } from "../../components/posts";
import { SCREENS } from "../../constants/screens";
import { useCurrentBusiness, useLanguages } from "../../hooks";
import { showStackModal } from "../../navigation/actions";
import { icons } from "../../styles";
import DoubleOptionPopupModal from "../popups/DoubleOptionPopupModal";

const EditPost = ({ props, setVisible: setVisibleModal }) => {
  const { post, onDeleted } = props;

  const [visible, setVisible] = useState(false);

  const { languageContent } = useLanguages();
  const { isBusiness } = useCurrentBusiness();

  const dispatch = useDispatch();

  const actions = useMemo(() => {
    return [
      {
        title: languageContent.actions.edit,
        icon: icons.Edit,
        type: "edit",
      },
      {
        title: languageContent.actions.delete,
        icon: icons.Bin,
        type: "delete",
      },
    ];
  }, []);

  return (
    <>
      <View style={{ alignSelf: "center" }}>
        <PostCell disabled post={post} scale={0.9} />
      </View>

      <View
        style={{
          marginTop: "8%",
          flexDirection: "row",
        }}
      >
        {actions.map(({ title, icon, type }, index) => {
          return (
            <CenterIconCell
              key={index}
              style={{ marginRight: index == 0 ? "3%" : 0 }}
              title={title}
              icon={icon}
              onPress={() => {
                if (type == "delete") {
                  setVisible(true);
                }

                if (type == "edit") {
                  showStackModal({
                    screen: isBusiness
                      ? SCREENS.EditBusinessPost
                      : SCREENS.EditUserPost,
                    passProps: { initialPost: post },
                  });
                }
              }}
            />
          );
        })}
      </View>

      <DoubleOptionPopupModal
        title={languageContent.popup_contents.delete_post}
        visible={visible}
        setVisible={setVisible}
        onDonePress={() => {
          dispatch(
            (isBusiness ? deleteBusinessPost : deleteMyPost)(
              post.id,
              (successful) => {
                if (successful) {
                  setVisible(false);
                  setVisibleModal(false);

                  onDeleted?.();
                }
              }
            )
          );
        }}
      />
    </>
  );
};

export default EditPost;
