import { Navigation } from "react-native-navigation";

export const showSharedModal = ({ componentId, screen, passProps, items }) => {
  Navigation.push(componentId, {
    component: {
      name: screen,
      passProps,
      options: {
        animations: {
          push: {
            sharedElementTransitions: items.map((item) => {
              console.log(`${item}.from`);

              return {
                fromId: `${item}.from`,
                toId: `${item}.to`,
                interpolation: { type: "linear" },
              };
            }),
          },
        },
      },
    },
  });
};

[
  {
    fromId: `source.from`,
    toId: `source.to`,
    interpolation: { type: "spring" },
  },
  {
    fromId: "overlay.from",
    toId: "overlay.to",
    interpolation: { type: "overshoot" },
  },
];

// export const showSharedModal = ({ screen, id, ...props }) => {
//   Navigation.showModal({
//     component: {
//       name: screen,
//       ...props,
//       options: {
//         modalPresentationStyle: "overCurrentContext",
//         layout: {
//           backgroundColor: "transparent",
//           componentBackgroundColor: "transparent",
//         },
//         animations: {
//           showModal: {
//             alpha: {
//               from: 0,
//               to: 1,
//               duration: 500,
//             },
//             sharedElementTransitions: [
//               {
//                 fromId: `source.from`,
//                 toId: `source.to`,
//                 duration: 500,
//                 interpolation: {
//                   type: "overshoot",
//                 },
//               },
//             ],
//           },
//         },
//       },
//     },
//   });
// };

// export const dismissSharedModal = ({ componentId, id }) => {
//   Navigation.dismissModal(componentId, {
//     animations: {
//       dismissModal: {
//         alpha: {
//           from: 1,
//           to: 0,
//           duration: 500,
//         },
//         sharedElementTransitions: [
//           {
//             toId: `${id}.from`,
//             fromId: `${id}.to`,
//             duration: 500,
//             interpolation: {
//               type: "spring",
//             },
//           },
//         ],
//       },
//     },
//   });
// };

const SPRING_CONFIG = { mass: 3, damping: 500, stiffness: 200 };

export const SET_DURATION = 100;

export function buildFullScreenSharedElementAnimations(post) {
  return {
    showModal: {
      alpha: {
        from: 0,
        to: 1,
        duration: SET_DURATION,
      },
      sharedElementTransitions: [
        {
          fromId: `source.${post.id}.from`,
          toId: `source.${post.id}.to`,
          duration: SET_DURATION,
          interpolation: { type: "spring", ...SPRING_CONFIG },
        },
      ],
    },
    dismissModal: {
      alpha: {
        from: 1,
        to: 0,
        duration: SET_DURATION,
      },
      sharedElementTransitions: [
        {
          toId: `source.${post.id}.from`,
          fromId: `source.${post.id}.to`,
          duration: SET_DURATION,
          interpolation: { type: "spring", ...SPRING_CONFIG },
        },
      ],
    },
  };
}
