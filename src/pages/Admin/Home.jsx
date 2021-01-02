import { useContext } from 'react'

import UserContext from '../../context/UserContext'

const AdminHome = () => {
    const userContext = useContext(UserContext)

    return (
        <div>
            Admin Home
            <br />
            {userContext.user.userId}
        </div>
    )
}

export default AdminHome