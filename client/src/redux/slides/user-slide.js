import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   _id: '',
   name: '',
   username: '',
   password: '',
   image: ' ',
   access_token: ''
}

export const userSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { _id = '', name='', username = '', password='', image='',access_token='' } = action.payload
            state._id = _id;
            state.name = name;
            state.username = username;
            state.password = password;
            state.image = image;
            state.access_token = access_token
        },
        resetUser: (state) => {
            state._id = '';
            state.name = '';
            state.username = '';
            state.password = '';
            state.image = '';
            state.access_token = ''
        }
    }
})

export const { updateUser , resetUser } = userSlice.actions

export default userSlice.reducer