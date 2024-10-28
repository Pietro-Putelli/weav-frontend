import MainWrapper from "./MainWrapper";

const RootScreenWrapper = (Component) => {
  return function inject(props) {
    return (
      <MainWrapper {...props}>
        <Component {...props} />
      </MainWrapper>
    );
  };
};

export default RootScreenWrapper;
