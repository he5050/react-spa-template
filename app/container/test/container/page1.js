import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React from "react";

// ==================
// 组件
// ==================
function Page1(props) {
    return <div className="son">A 子container 1</div>;
}

export default connect(
    state => ({}),
    dispatch => ({
        actions: bindActionCreators({}, dispatch)
    })
)(Page1);
