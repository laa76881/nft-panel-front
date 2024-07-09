import api from "./axios";

export function getUsers() {
    let url = '/api/users'
    // if (location_id) url += `?location_id=${location_id}`
    return api.get(url);
}

export function getUser(id) {
    console.log('watch id', id)
    let url = `/api/user/${id}`
    // if (location_id) url += `?location_id=${location_id}`
    return api.get(url);
}