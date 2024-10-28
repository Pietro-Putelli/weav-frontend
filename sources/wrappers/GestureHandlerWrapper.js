import { gestureHandlerRootHOC } from "react-native-gesture-handler";

const GestureHandlerWrapper = ({ children }) => {
  const Component = gestureHandlerRootHOC(() => children);

  return <Component />;
};

export default GestureHandlerWrapper;
