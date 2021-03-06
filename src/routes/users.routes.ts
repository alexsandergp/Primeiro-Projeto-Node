//Este arquivo ele precisa ser responsavel somente por, chamar outro arquivo,
//da aplicação e devolver uma resposta


//regras de negocio, nao pode ter email duplicado, é necessario criptografar a senha do usuario,
// pois é constra as regras armazenar a senha do usuario, por conta de um ataque hacker por exemplo.


import { request, Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../service/CreateUserService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    // Com a atualização do TypeScript, isso se faz necessário
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.update_at,
    };

    return response.json(userWithoutPassword);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
    console.log(request.file);
    return response.json({ ok: true});
},
);

export default usersRouter;
