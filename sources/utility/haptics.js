import * as Haptics from "expo-haptics";

export const triggerHapticOnce = ((type = "impactLight") => {
  let executed = false;
  return () => {
    if (!executed) {
      executed = true;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      setTimeout(() => {
        executed = false;
      }, 200);
    }
  };
})();

export const triggerHaptic = (type = "impactLight", callback) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  setTimeout(() => {
    callback?.();
  }, 300);
};
