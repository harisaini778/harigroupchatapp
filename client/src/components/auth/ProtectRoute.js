import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = ({children,user,redirect="/"}) => {

    if(!user) {

        return <Navigate to={redirect}/>

    } else {
        return children ? children : <Outlet/>
    }
}

export default ProtectRoute;