import React from "react";

function Count(props){
    console.log('Count rerender')
    // const [countValue, setCountValue] = React.useState(0);
    return (
        <div>
            <div>
                value:{props.countValue}
            </div>
            <button onClick={props.alertDemo}> alertDemo </button>
        </div>
    )

}

function PureX(){
    console.log('PureX render')
    return (
        <div>
            PureX
        </div>
    )
}


const CountMemo =React.memo(Count)


export function Demo1(){
    console.log('Demo1 rerender')


    const [countValue, setCountValue] = React.useState(0);
    const [countValue2, setCountValue2] = React.useState(0);

    const alertDemo = () => {
        alert(countValue)
    }

    const alertDemoCallback = React.useCallback(alertDemo,[countValue])


    return(
        <div>
            <div>
                countValue value:{countValue}
            </div>

            <button onClick={() =>setCountValue(countValue+1)}> +</button>
            <Count alertDemo ={alertDemoCallback}/>
            {/*<CountMemo alertDemo ={alertDemoCallback}/>*/}
            <PureX/>

            <br/>

            countValue2 改变触发父组件渲染

            <button onClick={() =>setCountValue2(countValue2+1)}> +</button>

            <div>
                countValue2 :{countValue}
            </div>



        </div>
    )
}






// const PureX2 =React.memo(PureX)
