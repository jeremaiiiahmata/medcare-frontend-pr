import { useEffect, useState } from 'react'
import useAxios from '../utils/UseAxios';

const PrescriptionListPage = () => {

    const [data, setData] = useState<[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const api = useAxios();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/prescriptions/1");
                console.log("API Response:", response.data);
                setData(Array.isArray(response.data.data) ? response.data.data : []);
            } catch (error) {
                console.log(error);
                setError("Something went wrong. Please try again.");
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

  return (
    <div>
        Prescription Lists of Patient
    </div>
  )
}

export default PrescriptionListPage