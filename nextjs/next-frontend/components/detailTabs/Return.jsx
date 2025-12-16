import {axiosGet} from "@/utils/dataFetch.js";

const getReturn = async() => {
    const url = "/product/return";
    const returnData  = await axiosGet(url);
    const list = JSON.parse(returnData.list);
    return {...returnData, list: list};
}


export default async function Return() {
    const returnData = await getReturn();

    return (
        <div>
            <div style={{paddingTop:"20px"}}></div>
            <h4>{returnData && returnData.title}</h4>
            <p style={{paddingBottom:"20px"}}>{returnData && returnData.description}</p>
            <table className='review-list-content'>
                <tbody>
                    {returnData.list && returnData.list.map((item, idx) =>
                        <tr key={idx}>
                            <td style={{width:"30%", textAlign:"center"}}>{item.title}</td>
                            <td>
                                <ul  style={{textAlign:"left"}}>
                                {item.infoList 
                                    && item.infoList .map((item, idx) =>
                                        <li key={idx}>{item}</li>
                                    )}
                                </ul>
                            </td>
                        </tr>
                    ) }
                    <tr><td colSpan={2}></td></tr>
                </tbody>
            </table>
        </div>
    );
}

