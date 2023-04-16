import { useMutation } from 'react-query';
import axios from 'axios';

const addDragItem = (event) => {
    return axios.post("http://localhost:8080/dragItemList/", event)
}
const addEvent = (event) => {
    return axios.post("http://localhost:8080/events", event)
}
const updateEvent = (event) => {
    return axios.put(`http://localhost:8080/events/${event.id}`, event)
}
export const useAddDragItem = () => {
    return useMutation(addDragItem)
}
export const useAddEvent = () => {
    return useMutation(addEvent)
}
export const useUpdateEvent = () => {
    return useMutation(updateEvent)
}
