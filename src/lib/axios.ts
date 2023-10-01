import Axios from 'axios';

const createAxios = (authToken: string = '') => {
    const axios = Axios.create({
        headers: {
            //'X-Requested-With': 'XMLHttpRequest',
            authorization: `Bearer ${authToken}`
        },
        //withCredentials: true,
    });

    return axios;
}        

export default createAxios;
