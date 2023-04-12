import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';


const addEvent = (event) => {
    return axios.post("http://localhost:8000/events", event)
}
const updateEvent = (event) => {
    return axios.put(`http://localhost:8000/events/${event.id}`, event)
}
export const useAddEvent = () => {
    return useMutation(addEvent)
}
export const useUpdateEvent = () => {
    return useMutation(updateEvent)
}
