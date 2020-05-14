/** 主页 **/

/** 所需的各种插件 **/
import React from "react";
import { connect } from "react-redux";
import ImgLogo from "../../assets/react-logo.jpg";
/** 所需的各种资源 **/
import "./index.less";

function HomePageContainer(props) {
    return (
        <div className="page-home all_nowarp">
            <div className="box">
                <img src={ImgLogo} />
                <div className="title">React-SPA</div>
                <div className="info">react16、redux4、router5、webpack4、eslint、babel7、antd3</div>
            </div>
        </div>
    );
}

export default connect(
    state => {
        return {};
    },
    dispatch => ({
        actions: {}
    })
)(HomePageContainer);
