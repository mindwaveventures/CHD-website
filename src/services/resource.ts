import axiosAPI from '../middlewares/axios-interceptor';

const getResourcesFiles = () => axiosAPI.get('/get-user-resource');

const generatePDF = (data: any) => axiosAPI.post('/download-resource', data, { responseType: 'blob' });

export {
    getResourcesFiles,
    generatePDF,
};