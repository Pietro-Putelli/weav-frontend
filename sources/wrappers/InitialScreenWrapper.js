import MainWrapper from "./MainWrapper";

const InitialScreenWrapper = (Component) => {
  return function inject(props) {
    return (
      <MainWrapper {...props}>
        <Component {...props} />
      </MainWrapper>
    );
  };
};

export default InitialScreenWrapper;
