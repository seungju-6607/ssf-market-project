import ProductAvatar from "@/components/product/ProductAvatar.jsx";
import { axiosGet, groupByRows } from "@/utils/dataFetch.js";
import Link from "next/link";

const getProductList = async(number) => {
    const url = "/product/all";
    const jsonData = await axiosGet(url);
    const rows = groupByRows(jsonData, number);
    return rows;
}

export default async function ProductList() {
    const number = 3;
    const productList = await getProductList(number);
    
    return (
        <div>
                {productList && productList.map((rowArray, idx) => 
                    <div className='product-list' key={idx} >
                        {rowArray && rowArray.map((product, idx) =>
                            <Link href={`/products/${product.pid}`} key={idx}>
                                <ProductAvatar img={product.image}  />
                            </Link>                          
                        )}
                    </div>
                 )}
        </div>
    );
}

