import React, { Fragment } from "react";
import Header from "../../common/header/Header";

const Home = (props) => {
  return (
    <Fragment>
      <Header baseUrl={props.baseUrl} />
    </Fragment>
  );
};

export default Home;
