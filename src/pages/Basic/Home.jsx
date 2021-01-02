import { useContext } from 'react'

import UserContext from '../../context/UserContext'

const Home = () => {
    const userContext = useContext(UserContext)

    return (
        <div>
            {userContext.user.userId}
        </div>
    )
}

export default Home