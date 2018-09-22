import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:18081';
axios.defaults.headers.common['app'] = 'SM-APP';

axios.interceptors.request.use(requestConfig => {
    return requestConfig;
});

const AsyncUtil = {
    get: (url, data, successHandler, errorHandler) => {
        axios.get(url, data).then(response => {
            if (successHandler)
                successHandler(response.data.details)
        }).catch(error => {
            console.log(error);
        });
    }, post: (url, data, successHandler, errorHandler) => {
        axios.post(url,  data).then(response => {
            if (successHandler)
                successHandler(response.data.details)
        }).catch(error => {
            console.log(error);
        });
    }, delete: (url, data, successHandler, errorHandler) => {
        axios.delete(url,  data).then(response => {
            if (successHandler)
                successHandler(response.data.details)
        }).catch(error => {
            console.log(error);
        });
    }
}





export default AsyncUtil;