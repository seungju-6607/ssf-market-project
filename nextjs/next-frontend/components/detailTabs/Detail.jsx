
import { ImageList } from '@/components/commons/ImageList.jsx';
import { axiosPost } from "@/utils/dataFetch.js";

const getDetailinfo = async(pid) => {
    const url = "/product/detailinfo";
    const info  = await axiosPost(url, {"pid": pid});
    const list = JSON.parse(info.list);
    return { ...info, list: list };
}

export default async function Detail({imgList, pid}) {
    const info = await getDetailinfo(pid);

    return (
        <div>
            <DetailImages imgList={imgList} />
            <DetailInfo info={info} />
        </div>
    );
}

/**
 * ProductDetail > Detail > DetailImages
 */
export function DetailImages({imgList}) {
    return (
        <div className='detail-images'>
            <div style={{padding:"20px"}}></div>
            <img src="/images/holidays_notice.jpg" 
                 alt="notice" />
            <ImageList  imgList={imgList}
                        className="detail-images-list"  />
        </div>
    );
}

/**
 * ProductDetail > Detail > DetailInfo
 */
export function DetailInfo({info}) {
    return (
        <div className='detail-info'>
            <h4 className='detail-info-title-top'>
                {info && info.titleEn} / {info && info.titleKo}
                {info.list && info.list.map((item, idx) =>
                    <div key={idx}>
                        <h5 className='detail-info-title'>[{item.title}]</h5>
                        {item.title === "SIZE" || item.title === "MODEL SIZE" ?
                            <ul className='nolist'>
                                <li>{item.type}</li>
                                { item.title==="MODEL SIZE" &&
                                    <>
                                    <li>{item.height}</li>
                                    <li>{item.size}</li>
                                    </>
                                }
                                { item.title === "SIZE" &&
                                    <>
                                    <li>총길이: {item.totalLength}</li>
                                    <li>어깨너비: {item.shoulderWidth}</li>
                                    <li>가슴너비: {item.chestWidth}</li>
                                    <li>소매길이: {item.sleeveLength}</li>
                                    <li>소매밑단: {item.sleeveHemWidth}</li>
                                    <li>밑단너비: {item.hemLength}</li>
                                    <li>암홀: {item.armhole}</li>
                                    </>
                                }
                            </ul>
                         :
                            <ul className='list nolist'>
                                {item.title === "FABRIC" &&
                                    <>
                                    <li>Color: {item.color}</li>
                                    <li>{item.material}</li>
                                    </>
                                }
                                {
                                    item.description && item.description.map((desc, idx) =>
                                        <li key={idx}>{desc}</li>
                                    )
                                }
                            </ul>
                        }
                    </div>
                )}
            </h4>
        </div>
    );
}
