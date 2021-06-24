import {useSelector} from "react-redux";
import {User} from "../store/modules/user";
import {reducers} from "../store";


export function UserInfo(){
    const user = useSelector((state:any)=>state.user) as User['state']
    return(
        <div>
            <button onClick={() => {
                reducers.user.setUserName('老王')
            }}>设置username 为 老王</button>
            <h1>userName:{user.name}</h1>
            <h1>age:{user.age}</h1>
        </div>
    )
}
