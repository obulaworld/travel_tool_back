import express from 'express'
import User from './auth.controller'

const Router = express.Router()

Router.post('/login', User.login);
Router.post('/register', User.register);

export default Router;