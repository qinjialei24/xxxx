import {call, put, takeLatest} from 'redux-saga/effects'
import {actionMap} from "./index";

function fetchUserApi(): Promise<number> {
    return new Promise((resolve => {
        setTimeout(() => {
            resolve(2222)
        })
    }))
}


function* fetchUser() {
    // @ts-ignore
    const num = yield call(fetchUserApi);
    // console.log("-> num", num);
    yield put({type: actionMap.count.add,});
}


function* mySaga() {
    yield takeLatest(actionMap.count.add, fetchUser);
}

export default mySaga;
