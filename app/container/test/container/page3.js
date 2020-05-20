import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React from "react";

// ==================
// 组件
// ==================
function Page3(props) {
    return <div className="son">C 子container 3</div>;
}

export default connect(
    state => ({}),
    dispatch => ({
        actions: bindActionCreators({}, dispatch)
    })
)(Page3);
