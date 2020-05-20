import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React from "react";

// ==================
// 组件
// ==================
function Page2(props) {
    return <div className="son">B 子container 2</div>;
}

export default connect(
    state => ({}),
    dispatch => ({
        actions: bindActionCreators({}, dispatch)
    })
)(Page2);
