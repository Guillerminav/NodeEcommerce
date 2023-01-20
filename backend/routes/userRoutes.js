import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import { generateToken, isAdmin, isAuth } from '../utils.js'
import expressAsyncHandler from 'express-async-handler'

const userRouter = express.Router()

userRouter.get('/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const users = await User.find({})
        res.send(users)
}))

userRouter.get(
    '/:id',
    isAuth,
    isAdmin, 
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id)
        if (user) {
            res.send(user)
        } else {
            res.status(404).send({ message: 'Usuario no encontrado' })
        }
    })
)

userRouter.put(
    '/:id',
    isAuth,
    isAdmin, 
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id)
        if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.isAdmin = Boolean(req.body.isAdmin)
            const updatedUser = await user.save()
            res.send({ message: 'Usuario actualizado', user: updatedUser})
        } else {
            res.status(404).send({ message: 'Usuario no encontrado' })
        }
    })
)

userRouter.post(
    '/signin', 
    expressAsyncHandler(async(req, res) => {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user)
                })
                return
            }
        }
        res.status(401).send({ message: 'Email o contraseña incorrecta' })
    })
)

userRouter.post(
    '/signup', 
    expressAsyncHandler(async(req, res) => {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password)
        })
        const user = await newUser.save()
        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user)
        })
    })
)

userRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async(req, res) => {
        const user = await User.findById(req.user._id)
        if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            if (req.body.password) {
                user.password = bcrypt.hashSync(req.body.password, 8)
            }
            const updateUser = await user.save()
            res.send({
                _id: updateUser._id,
                name: updateUser.name,
                email: updateUser.email,
                isAdmin: updateUser.isAdmin,
                token: generateToken(updateUser)
            })
        } else {
            res.status(404).send({ message: 'Usuario no encontrado' })
        }
    })
)

userRouter.delete(
    '/:id', 
    isAuth,
    isAdmin,
    expressAsyncHandler(async(req, res) => {
        const user = await User.findById(req.params.id)
        if (user) {
            if (user.email === 'admin@example.com') {
                res.status(400).send({ message: 'No se puede eliminar el usuario administrador'})
                return
            }
            await user.remove()
            res.send({ message: 'Usuario eliminado'} )
        } else {
            res.status(404).send({ message: 'No se encuentra el usuario' })
        }
    })
)

export default userRouter