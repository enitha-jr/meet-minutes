import {Outlet} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
function App(){
  const userData = useSelector((state) => state.auth)
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default App