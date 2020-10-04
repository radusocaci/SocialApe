import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const AuthRoute = ({component: Component, authenticated, ...others}) => {
    return (
        <Route {...others}
               render={(props) => authenticated === true ? <Redirect to={'/'}/> : <Component {...props}/>}
        />
    );
};

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
});

AuthRoute.propTypes = {
    authenticated: PropTypes.object
};

export default connect(mapStateToProps)(AuthRoute);