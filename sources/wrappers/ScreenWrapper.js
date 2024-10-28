import MainWrapper from "./MainWrapper";

const ScreenWrapper = (Component) => {
  return function inject(props) {
    return (
      <MainWrapper {...props}>
        <Component {...props} />
      </MainWrapper>
    );
  };
};

export default ScreenWrapper;
