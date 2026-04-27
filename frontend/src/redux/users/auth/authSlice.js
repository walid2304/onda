import { createSlice } from "@reduxjs/toolkit";

import { loginUser } from "../thunks/loginThunk";
import { registerUser } from "../thunks/registerThunk";
import { logoutUser } from "../thunks/logoutThunk";
import { getUsers } from "../thunks/getUsersThunk";
import { deleteUser } from "../thunks/deleteUserThunk";
import { updateUser } from "../thunks/updateUserThunk";
import { changeRole } from "../thunks/changeRoleThunk";

const authSlice = createSlice({

    name: "auth",

    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null,
        users: [],
        loading: false,
        error: null
    },

    reducers: {},

    extraReducers: (builder) => {

        builder

            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false

                if (action.payload.success) {

                    state.user = action.payload.user

                    localStorage.setItem(
                        "user",
                        JSON.stringify(action.payload.user)
                    )

                } else {
                    state.error = action.payload.message
                }
            })

            .addCase(loginUser.rejected, (state) => {
                state.loading = false
                state.error = "Erreur login"
            })


            // REGISTER
            .addCase(registerUser.pending, (state) => {
                state.loading = true
            })

            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success && action.payload.user) {
                    state.users.push(action.payload.user);
                }
            })
            .addCase(registerUser.rejected, (state) => {
                state.loading = false
                state.error = "Erreur register"
            })


            // LOGOUT
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null
                localStorage.removeItem("user")
            })


            // GET USERS
            .addCase(getUsers.pending, (state) => {
                state.loading = true
            })

            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload
            })

            .addCase(getUsers.rejected, (state) => {
                state.loading = false
                state.error = "Erreur chargement utilisateurs"
            })


            // DELETE USER
            .addCase(deleteUser.fulfilled, (state, action) => {

                const id = action.meta.arg

                state.users = state.users.filter(
                    (u) => u.id_user !== id
                )

            })


            // UPDATE USER
            .addCase(updateUser.fulfilled, (state, action) => {

                const updated = action.payload.user; // <-- utiliser payload.user renvoyé par API

                if (!updated) return; // sécurité

                // 1️⃣ mettre à jour la liste des utilisateurs
                const index = state.users.findIndex(u => u.id_user === updated.id_user);
                if (index !== -1) {
                    state.users[index] = { ...state.users[index], ...updated };
                }

                // 2️⃣ mettre à jour l’utilisateur connecté si c’est lui
                if (state.user && state.user.id_user === updated.id_user) {
                    state.user = { ...state.user, ...updated };

                    // 3️⃣ mettre à jour localStorage pour que le refresh conserve les infos
                    localStorage.setItem("user", JSON.stringify(state.user));
                }

            })


            // CHANGE ROLE
            .addCase(changeRole.fulfilled, (state, action) => {

                const data = action.meta.arg

                const user = state.users.find(
                    (u) => u.id_user === data.id_user
                )

                if (user) {
                    user.role = data.role
                }

            })

    }

})

export default authSlice.reducer