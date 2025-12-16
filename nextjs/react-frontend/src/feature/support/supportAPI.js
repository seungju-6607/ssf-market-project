import { axiosPost } from '../../utils/dataFetch.js';

export const getSearchList = async(data) => {
    const url = "/support/search/list";
    const jsonData = await axiosPost(url, data);
    return jsonData;
}

export const getList = async(data) => {
    const url = "/support/list";
    const jsonData = await axiosPost(url, data);
    return jsonData;
}