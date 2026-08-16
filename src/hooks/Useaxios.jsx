import axios from 'axios';
import { useMemo } from 'react';

const Useaxios = () => {
    const axiosInstance =useMemo(()=>{
        return axios.create({
            baseURL: 'http://localhost:3000'
            // baseURL: 'https://career-track-lite-omz9.onrender.com'
          
            
          
        })
    },[])
    return axiosInstance;
};

export default Useaxios;