import axiosAPI from '../middlewares/axios-interceptor';

const uploadHistoricData = (data: any, options = {}) => axiosAPI.post('/upload-historic-data', data, options);

const uploadFutureData = (data: any, options = {}) => axiosAPI.post('/upload-future-data', data, options);

const getPredictions = (data: any) => axiosAPI.post('/get-predictions', data);

const downloadPrediction = (id: string) => axiosAPI.get(`/download-predictions/${id}`, { responseType: 'blob' });

const checkPredictionStatus = () => axiosAPI.get('/check-prediction-status');

const getPredictionByOrganisation = (data: any) => axiosAPI.post('/get-prediction-by-organisation', data);

const getPredictionByUser = (data: any) => axiosAPI.post('/get-prediction-by-user', data);

const getPredictionById = (id: string) => axiosAPI.get(`/get-prediction-by-id/${id}`);

export {
    uploadHistoricData,
    uploadFutureData,
    getPredictions,
    downloadPrediction,
    checkPredictionStatus,
    getPredictionByOrganisation,
    getPredictionByUser,
    getPredictionById
};
