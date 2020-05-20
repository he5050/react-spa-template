/** 404 NotFound **/

/** 所需的各种插件 **/
import { connect } from "react-redux";
import React from "react";

/** 所需的所有资源 **/
import "./index.less";

function NotFoundPageContainer() {
    return (
        <div className="page-notfound">
            <div className="box">404 not found</div>
        </div>
    );
}

export default connect(
    state => ({}),
    dispatch => ({
        actions: {}
    })
)(NotFoundPageContainer);
