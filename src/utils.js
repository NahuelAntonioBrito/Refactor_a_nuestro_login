import {dirname} from "path";
import { fileURLToPath } from "url";
import bcrypy from 'bcrypt'

export const __dirname = dirname(fileURLToPath(import.meta.url))

export const crateHash = password => bcrypy.hashSync(password, bcrypy.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypy.compareSync(password, user.password)